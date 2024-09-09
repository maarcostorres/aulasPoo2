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
            var cliente = await _context.Clientes.FindAsync(compra.ClienteId);
            if (cliente == null)
            {
                return NotFound("Cliente não encontrado.");
            }

            // Verifica se o cliente está bloqueado
            if (cliente.Bloqueado)
            {
                return BadRequest("Cliente está bloqueado e não pode realizar compras.");
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

            // Associa cada parcela à compra
            foreach (var parcela in compra.Parcelas)
            {
                parcela.CompraId = compra.Id;  // Usa o ID da compra
            }

            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetCompras), new { id = compra.Id }, compra);
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
