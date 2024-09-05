using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MVConsultoria.Web.Data;
using MVConsultoria.Web.Models;

namespace MVConsultoria.Web.Controllers
{
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

        // POST: api/Parcelas
        [HttpPost]
        public async Task<ActionResult<Parcela>> PostParcela(Parcela parcela)
        {
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
    }
}
