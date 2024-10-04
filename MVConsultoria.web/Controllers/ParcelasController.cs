using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MVConsultoria.Web.Data;
using MVConsultoria.Web.Models;



namespace MVConsultoria.Web.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class ParcelasController : ControllerBase
    {
        private readonly MVConsultoriaContext _context;

        public ParcelasController(MVConsultoriaContext context)
        {
            _context = context;
        }

        // GET: api/Parcelas
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Parcela>>> GetParcelas()
        {
            return await _context.Parcelas.ToListAsync();
        }


        [HttpGet("cliente/{clienteId}/todas-parcelas")]
        public async Task<ActionResult<IEnumerable<ParcelaDto>>> GetTodasParcelasPorCliente(int clienteId)
        {
            var cliente = await _context.Clientes
                .Include(c => c.Compras)
                .ThenInclude(compra => compra.Parcelas)
                .FirstOrDefaultAsync(c => c.Id == clienteId);

            if (cliente == null)
            {
                return NotFound("Cliente não encontrado.");
            }

            // Selecionar apenas as propriedades relevantes para o DTO de Parcela
            var todasParcelas = cliente.Compras
                .SelectMany(c => c.Parcelas)
                .Select(p => new ParcelaDto
                {
                    Id = p.Id,
                    DataVencimento = p.DataVencimento,
                    Valor = p.Valor,
                    Pago = p.Pago,
                    DataPagamento = p.DataPagamento,
                    ValorPago = p.ValorPago
                })
                .ToList();

            if (!todasParcelas.Any())
            {
                return NotFound("Nenhuma parcela encontrada para o cliente.");
            }

            return Ok(todasParcelas);
        }



        // POST: api/Parcelas
        [HttpPost]
        public async Task<ActionResult<Parcela>> PostParcela(Parcela parcela)
        {
            // Validações adicionais
            if (parcela.Valor <= 0)
            {
                return BadRequest("O valor da parcela deve ser positivo.");
            }

            if (parcela.DataVencimento < DateTime.Now)
            {
                return BadRequest("A data de vencimento não pode ser no passado.");
            }

            // Verifica se a compra existe
            var compra = await _context.Compras.FindAsync(parcela.CompraId);
            if (compra == null)
            {
                return NotFound("Compra não encontrada.");
            }

            _context.Parcelas.Add(parcela);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetParcelas), new { id = parcela.Id }, parcela);
        }

        // PUT: api/Parcelas/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutParcela(int id, Parcela parcela)
        {
            if (id != parcela.Id)
            {
                return BadRequest();
            }

            // Validações adicionais
            if (parcela.Valor <= 0)
            {
                return BadRequest("O valor da parcela deve ser positivo.");
            }

            if (parcela.DataVencimento < DateTime.Now)
            {
                return BadRequest("A data de vencimento não pode ser no passado.");
            }

            _context.Entry(parcela).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ParcelaExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // DELETE: api/Parcelas/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteParcela(int id)
        {
            var parcela = await _context.Parcelas.FindAsync(id);
            if (parcela == null)
            {
                return NotFound();
            }

            _context.Parcelas.Remove(parcela);
            await _context.SaveChangesAsync();

            return NoContent();
        }


        // PUT: api/Parcelas/5/pagar
        [HttpPut("{id}/pagar")]
        public async Task<IActionResult> RegistrarPagamento(int id, decimal valorPago)
        {
            // Busca a parcela pelo ID
            var parcela = await _context.Parcelas.FindAsync(id);
            if (parcela == null)
            {
                return NotFound("Parcela não encontrada.");
            }

            // Verifica se a parcela já foi paga
            if (parcela.Pago)
            {
                return BadRequest("Esta parcela já foi paga.");
            }

            // Valida o valor pago
            if (valorPago <= 0)
            {
                return BadRequest("O valor pago deve ser positivo.");
            }

            // Busca a compra associada para acessar o cliente
            var compra = await _context.Compras.Include(c => c.Cliente)
                                               .FirstOrDefaultAsync(c => c.Id == parcela.CompraId);
            if (compra == null)
            {
                return NotFound("Compra não encontrada.");
            }

            // Verifica se o valor pago é menor que o valor da parcela
            if (valorPago < parcela.Valor)
            {
                // Calcula o valor restante
                decimal valorRestante = parcela.Valor - valorPago;

                // Atualiza a parcela original como paga parcialmente
                parcela.Pago = true; // Considera que essa parte foi paga
                parcela.ValorPago = valorPago;
                parcela.DataPagamento = DateTime.Now;

                // Cria uma nova parcela com o valor restante e a mesma data de vencimento
                var novaParcela = new Parcela
                {
                    CompraId = parcela.CompraId,
                    DataVencimento = parcela.DataVencimento, // Mantém a mesma data de vencimento
                    Valor = valorRestante,
                    Pago = false
                };

                // Adiciona a nova parcela ao banco de dados
                _context.Parcelas.Add(novaParcela);
            }
            else if (valorPago == parcela.Valor)
            {
                // Se o valor pago for igual ao valor da parcela, marca a parcela como totalmente paga
                parcela.Pago = true;
                parcela.ValorPago = valorPago;
                parcela.DataPagamento = DateTime.Now;
            }

            // Incrementa o limite disponível do cliente
            var cliente = compra.Cliente;
            cliente.LimiteDisponivel += valorPago;

            // Atualiza o estado da parcela e do cliente
            _context.Entry(parcela).State = EntityState.Modified;
            _context.Entry(cliente).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ParcelaExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        private bool ParcelaExists(int id)
        {
            return _context.Parcelas.Any(e => e.Id == id);
        }



        // GET: api/Parcelas/cliente/{clienteId}/parcela-minima
        [HttpGet("cliente/{clienteId}/parcela-minima")]
        public async Task<ActionResult<decimal>> GetParcelaMinima(int clienteId)
        {
            // Busca o cliente pelo ID
            var cliente = await _context.Clientes
                .Include(c => c.Compras)
                .ThenInclude(compra => compra.Parcelas)
                .FirstOrDefaultAsync(c => c.Id == clienteId);

            if (cliente == null)
            {
                return NotFound("Cliente não encontrado.");
            }

            // Define a data atual
            DateTime dataAtual = DateTime.Now;
            DateTime proximoDiaDePagamento;

            // Calcula o próximo dia de pagamento
            if (dataAtual.Day >= cliente.DiaDePagamento.Day) // Se o dia de pagamento já passou no mês corrente
            {
                proximoDiaDePagamento = new DateTime(dataAtual.Year, dataAtual.Month, cliente.DiaDePagamento.Day).AddMonths(1);
            }
            else
            {
                proximoDiaDePagamento = new DateTime(dataAtual.Year, dataAtual.Month, cliente.DiaDePagamento.Day);
            }

            // Filtra as parcelas com vencimento até o próximo dia de pagamento
            var parcelasAteProximoPagamento = cliente.Compras
                .SelectMany(c => c.Parcelas)
                .Where(p => !p.Pago && p.DataVencimento <= proximoDiaDePagamento)
                .ToList();

            // Soma o valor das parcelas a vencer até o próximo dia de pagamento
            decimal valorParcelaMinima = parcelasAteProximoPagamento.Sum(p => p.Valor);

            return Ok(valorParcelaMinima);
        }



    }
}