using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MVConsultoria.Web.Data;
using MVConsultoria.Web.Models;

namespace MVConsultoria.Web.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PagamentosController : ControllerBase
    {
        private readonly MVConsultoriaContext _context;

        public PagamentosController(MVConsultoriaContext context)
        {
            _context = context;
        }

        // GET: api/Pagamentos
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Pagamento>>> GetPagamentos()
        {
            return await _context.Pagamentos.Include(p => p.Cliente).ToListAsync();
        }

        // POST: api/Pagamentos
        [HttpPost]
        public async Task<ActionResult<Pagamento>> PostPagamento(Pagamento pagamento)
        {
            // Verifica se o cliente existe
            var cliente = await _context.Clientes.FindAsync(pagamento.ClienteId);
            if (cliente == null)
            {
                return NotFound("Cliente não encontrado.");
            }

            _context.Pagamentos.Add(pagamento);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetPagamentos), new { id = pagamento.Id }, pagamento);
        }
    }
}
