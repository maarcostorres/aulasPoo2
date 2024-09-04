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
            return await _context.Parcelas.Include(p => p.Compra).ToListAsync();
        }

        // GET: api/Parcelas/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Parcela>> GetParcela(int id)
        {
            var parcela = await _context.Parcelas.FindAsync(id);

            if (parcela == null)
            {
                return NotFound();
            }

            return parcela;
        }

        // POST: api/Parcelas
        [HttpPost]
        public async Task<ActionResult<Parcela>> PostParcela(Parcela parcela)
        {
            _context.Parcelas.Add(parcela);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetParcela), new { id = parcela.Id }, parcela);
        }

        // PUT: api/Parcelas/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutParcela(int id, Parcela parcela)
        {
            if (id != parcela.Id)
            {
                return BadRequest();
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

        private bool ParcelaExists(int id)
        {
            return _context.Parcelas.Any(e => e.Id == id);
        }
    }
}
