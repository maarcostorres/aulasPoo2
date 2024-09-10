using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MVConsultoria.Web.Data;
using MVConsultoria.Web.Models;

namespace MVConsultoria.Web.Controllers
{
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
        public async Task<ActionResult<IEnumerable<Compra>>> GetCompras()
        {
            return await _context.Compras
                .Include(c => c.Parcelas)
                .ToListAsync();
        }


        // POST: api/Compras
        [HttpPost]
        public async Task<ActionResult<Compra>> PostCompra(Compra compra)
        {
            // Verifica se o cliente existe
            var cliente = await _context.Clientes
                .Include(c => c.Compras)  // Inclui as compras associadas ao cliente
                .ThenInclude(compra => compra.Parcelas)  // Inclui as parcelas associadas às compras
                .FirstOrDefaultAsync(c => c.Id == compra.ClienteId);

            if (cliente == null)
            {
                return NotFound("Cliente não encontrado.");
            }

            // Verifica se o cliente está bloqueado
            if (cliente.Bloqueado)
            {
                return BadRequest("Cliente está bloqueado e não pode realizar compras.");
            }

            // Verifica se o cliente tem parcelas em atraso
            var parcelasAtrasadas = cliente.Compras
                .SelectMany(c => c.Parcelas)
                .Where(p => !p.Pago && p.DataVencimento < DateTime.Now)
                .ToList();

            if (parcelasAtrasadas.Any())
            {
                return BadRequest("Não é possível realizar a compra. O cliente possui parcelas em atraso.");
            }

            // Verifica se o cliente tem limite disponível suficiente
            if (cliente.LimiteDisponivel < compra.ValorTotal)
            {
                return BadRequest("Limite de crédito disponível insuficiente.");
            }

            // Subtrai o valor da compra do limite disponível
            cliente.LimiteDisponivel -= compra.ValorTotal;

            // Adiciona a compra
            _context.Compras.Add(compra);
            await _context.SaveChangesAsync();

            // Associa cada parcela à compra e define a data de vencimento baseada no DiaDePagamento do cliente
            foreach (var parcela in compra.Parcelas)
            {
                parcela.CompraId = compra.Id;
                parcela.DataVencimento = CalcularDataVencimento(cliente.DiaDePagamento, compra.DataCompra);
            }

            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetCompras), new { id = compra.Id }, compra);
        }

        //Método para calcular o vencimento das parcelas
        private DateTime CalcularDataVencimento(DateTime diaDePagamento, DateTime dataCompra)
        {
            DateTime dataVencimentoInicial = new DateTime(dataCompra.Year, dataCompra.Month, diaDePagamento.Day);

            // Se o vencimento inicial for menor que 12 dias após a compra, mova para o próximo mês
            if ((dataVencimentoInicial - dataCompra).TotalDays < 12)
            {
                dataVencimentoInicial = dataVencimentoInicial.AddMonths(1);
            }

            return dataVencimentoInicial;
        }


        // Método para gerar parcelas
        private void GerarParcelasParaCompra(Compra compra)
        {
            int numeroParcelas = 4;  // Exemplo de número de parcelas
            decimal valorParcela = compra.ValorTotal / numeroParcelas;

            for (int i = 0; i < numeroParcelas; i++)
            {
                var parcela = new Parcela
                {
                    CompraId = compra.Id,
                    DataVencimento = compra.DataCompra.AddMonths(i + 1), // As parcelas vencem a cada mês
                    Valor = valorParcela,
                    Pago = false
                };

                _context.Parcelas.Add(parcela);
            }
        }
    }
}
