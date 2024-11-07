using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MVConsultoria.Web.Data;
using MVConsultoria.Web.Models;
using Microsoft.AspNetCore.Authorization;


namespace MVConsultoria.Web.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class ComprasController : ControllerBase
    {
        private readonly MVConsultoriaContext _context;

        public ComprasController(MVConsultoriaContext context)
        {
            _context = context;
        }


        // GET: api/Compras
        [HttpGet]
        public async Task<ActionResult<IEnumerable<CompraDto>>> GetCompras()
        {
            var compras = await _context.Compras
                .Include(c => c.Cliente) // Inclui o cliente nas compras
                .Select(c => new CompraDto
                {
                    Id = c.Id,
                    DataCompra = c.DataCompra,
                    ValorTotal = c.ValorTotal,
                    QuantidadeParcelas = c.QuantidadeParcelas,
                    //IdCliente = c.ClienteId,
                    NomeCliente = c.Cliente.Nome // Retorna o nome do cliente
                })
                .ToListAsync();

            return Ok(compras);
        }


        // POST: api/Compras
        [HttpPost]
        public async Task<ActionResult<Compra>> PostCompra(CompraCreateDto compraDto)
        {
            // Verifica se o cliente existe com base no ClienteId recebido
            var cliente = await _context.Clientes
                .Include(c => c.Compras)  // Inclui as compras associadas ao cliente
                .ThenInclude(compra => compra.Parcelas)  // Inclui as parcelas associadas às compras
                .FirstOrDefaultAsync(c => c.Id == compraDto.ClienteId);

            if (cliente == null)
            {
                return NotFound(new { message = "Cliente não encontrado." });
            }

            // Verifica se o cliente está bloqueado
            if (cliente.Bloqueado)
            {
                return BadRequest(new { message = "Cliente está bloqueado e não pode realizar compras." });
                //return BadRequest("Cliente está bloqueado e não pode realizar compras.");
            }

            // Verifica se o cliente tem parcelas em atraso
            var parcelasAtrasadas = cliente.Compras
                .SelectMany(c => c.Parcelas)
                .Where(p => !p.Pago && p.DataVencimento < DateTime.Now)
                .ToList();

            if (parcelasAtrasadas.Any())
            {
                return BadRequest(new { message = "Não é possível realizar a compra. O cliente possui parcelas em atraso." });
                //return BadRequest("Não é possível realizar a compra. O cliente possui parcelas em atraso.");
            }

            // Verifica se o cliente tem limite disponível suficiente
            if (cliente.LimiteDisponivel < compraDto.ValorTotal)
            {
                return BadRequest(new { message = "Limite de crédito disponível insuficiente." });
                //return BadRequest("Limite de crédito disponível insuficiente.");
            }

            // Subtrai o valor da compra do limite disponível
            cliente.LimiteDisponivel -= compraDto.ValorTotal;

            // Cria o objeto `Compra` com os dados fornecidos e associa o cliente
            var novaCompra = new Compra
            {
                ClienteId = cliente.Id,      // Associa o cliente encontrado
                Cliente = cliente,           // Define explicitamente o objeto Cliente
                DataCompra = compraDto.DataCompra,
                ValorTotal = compraDto.ValorTotal,
                QuantidadeParcelas = compraDto.QuantidadeParcelas
            };

            // Adiciona a nova compra ao contexto
            _context.Compras.Add(novaCompra);
            await _context.SaveChangesAsync();

            // Gera as parcelas com base na quantidade informada
            GerarParcelasParaCompra(novaCompra);

            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetCompras), new { id = novaCompra.Id }, novaCompra);
        }



        private void GerarParcelasParaCompra(Compra compra)
        {
            double valorParcela = compra.ValorTotal / compra.QuantidadeParcelas;

            for (int i = 0; i < compra.QuantidadeParcelas; i++)
            {
                var parcela = new Parcela
                {
                    CompraId = compra.Id,
                    DataVencimento = compra.DataCompra.AddMonths(i + 1), // A cada mês
                    Valor = valorParcela,
                    Pago = false
                };

                // Adiciona a parcela à coleção de parcelas da compra
                compra.Parcelas.Add(parcela);

                // Adiciona a parcela ao contexto para ser persistida no banco de dados
                _context.Parcelas.Add(parcela);
            }
        }


        private static DateTime CalcularDataVencimento(DateTime diaDePagamento, DateTime dataCompra)
        {
            DateTime dataVencimentoInicial = new DateTime(dataCompra.Year, dataCompra.Month, diaDePagamento.Day);

            // Se o vencimento inicial for menor que 12 dias após a compra, mova para o próximo mês
            if ((dataVencimentoInicial - dataCompra).TotalDays < 12)
            {
                dataVencimentoInicial = dataVencimentoInicial.AddMonths(1);
            }

            return dataVencimentoInicial;
        }


        [HttpGet("cliente/{clienteId}/compras")]
        public async Task<ActionResult<IEnumerable<CompraDto>>> GetComprasPorCliente(int clienteId)
        {
            var compras = await _context.Compras
                .Where(c => c.ClienteId == clienteId)
                .Select(c => new CompraDto
                {
                    Id = c.Id,
                    DataCompra = c.DataCompra,
                    ValorTotal = c.ValorTotal,
                    QuantidadeParcelas = c.QuantidadeParcelas
                })
                .ToListAsync();

            if (compras == null || compras.Count == 0)
            {
                return NotFound("Nenhuma compra encontrada para o cliente.");
            }

            return Ok(compras);
        }



        // PUT: api/Compras/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> PutCompra(int id, CompraDto compraAtualizada)
        {
            // Verifica se a compra existe
            var compra = await _context.Compras
                .Include(c => c.Cliente) // Inclui o cliente associado
                .Include(c => c.Parcelas) // Inclui as parcelas associadas à compra
                .FirstOrDefaultAsync(c => c.Id == id);

            if (compra == null)
            {
                return NotFound("Compra não encontrada.");
            }

            var cliente = compra.Cliente;

            // Reverte o limite disponível do cliente antes de recalcular
            cliente.LimiteDisponivel += compra.ValorTotal;

            // Atualiza o valor total e a quantidade de parcelas da compra
            compra.ValorTotal = compraAtualizada.ValorTotal;
            compra.QuantidadeParcelas = compraAtualizada.QuantidadeParcelas;

            // Atualiza o limite disponível com o novo valor da compra
            if (cliente.LimiteDisponivel < compra.ValorTotal)
            {
                return BadRequest(new { message = "Limite de crédito disponível insuficiente para o novo valor." });
            }

            cliente.LimiteDisponivel -= compra.ValorTotal;

            // Remove as parcelas antigas
            _context.Parcelas.RemoveRange(compra.Parcelas);

            // Gera novas parcelas de acordo com o valor atualizado
            GerarParcelasParaCompraAtualizada(compra);

            try
            {
                // Salva as alterações no banco de dados
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!_context.Compras.Any(c => c.Id == id))
                {
                    return NotFound("Compra não encontrada.");
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // Método para gerar as parcelas de acordo com a quantidade informada
        private void GerarParcelasParaCompraAtualizada(Compra compra)
        {
            double valorParcela = compra.ValorTotal / compra.QuantidadeParcelas;

            for (int i = 0; i < compra.QuantidadeParcelas; i++)
            {
                var parcela = new Parcela
                {
                    CompraId = compra.Id,
                    DataVencimento = compra.DataCompra.AddMonths(i + 1), // Vencimento mensal
                    Valor = valorParcela,
                    Pago = false
                };

                _context.Parcelas.Add(parcela);
            }
        }

    }







}

