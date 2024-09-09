using Microsoft.AspNetCore.Mvc;
using MVConsultoria.Web.Data;
using MVConsultoria.Web.Models;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;

namespace MVConsultoria.Web.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ClientesController : ControllerBase
    {
        private readonly MVConsultoriaContext _context;

        public ClientesController(MVConsultoriaContext context)
        {
            _context = context;
        }

        // GET: api/Clientes/listarClientes
        [HttpGet("listarClientes")]
        public async Task<ActionResult<IEnumerable<Cliente>>> GetClientes()
        {
            return await _context.Clientes.ToListAsync();
        }

        // GET: api/Clientes/localizarCliente/{id}
        [HttpGet("localizarCliente/{id}")]
        public async Task<ActionResult<Cliente>> GetCliente(int id)
        {
            var cliente = await _context.Clientes.FindAsync(id);

            if (cliente == null)
            {
                return NotFound();
            }

            return cliente;
        }

        // POST: api/Clientes/cadastrarCliente
        [HttpPost("cadastrarCliente")]
        public async Task<ActionResult<Cliente>> PostCliente(Cliente cliente)
        {
            // Verifica se o CPF já existe
            var clienteExistente = await _context.Clientes.FirstOrDefaultAsync(c => c.CPF == cliente.CPF);
            if (clienteExistente != null)
            {
                return BadRequest("CPF já cadastrado.");
            }

            // Define um limite de crédito padrão para novos clientes, se não definido
            if (cliente.LimiteDeCredito == 0)
            {
                cliente.LimiteDeCredito = 300.00m;  // Exemplo de limite de crédito padrão
            }

            // Define o limite disponível igual ao limite de crédito
            cliente.LimiteDisponivel = cliente.LimiteDeCredito;

            // Adiciona o cliente ao banco de dados
            _context.Clientes.Add(cliente);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetCliente", new { id = cliente.Id }, cliente);
        }

        // PUT: api/Clientes/atualizarCliente/{id}
        [HttpPut("atualizarCliente/{id}")]
        public async Task<IActionResult> AtualizarCliente(int id, Cliente cliente)
        {
            if (id != cliente.Id)
            {
                return BadRequest();
            }

            _context.Entry(cliente).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ClienteExists(id))
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

        // DELETE: api/Clientes/deletarCliente/{id}
        [HttpDelete("deletarCliente/{id}")]
        public async Task<IActionResult> DeleteCliente(int id)
        {
            var cliente = await _context.Clientes.FindAsync(id);
            if (cliente == null)
            {
                return NotFound();
            }

            _context.Clientes.Remove(cliente);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // PUT: api/Clientes/alterarLimite/{id}
        [HttpPut("alterarLimite/{id}")]
        public async Task<IActionResult> AjustarLimiteDeCredito(int id, decimal novoLimite)
        {
            // Busca o cliente pelo ID
            var cliente = await _context.Clientes.FindAsync(id);
            if (cliente == null)
            {
                return NotFound("Cliente não encontrado.");
            }

            // Ajusta o limite de crédito do cliente
            if (novoLimite < 0)
            {
                return BadRequest("O limite de crédito não pode ser negativo.");
            }

            cliente.LimiteDeCredito = novoLimite;
            _context.Entry(cliente).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ClienteExists(id))
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

        private bool ClienteExists(int id)
        {
            return _context.Clientes.Any(e => e.Id == id);
        }

        // NOVOS ENDPOINTS QUE FALTAVAM

        // GET: api/Clientes/{clienteId}/compras
        [HttpGet("{clienteId}/compras")]
        public async Task<ActionResult<IEnumerable<Compra>>> GetComprasPorCliente(int clienteId)
        {
            var cliente = await _context.Clientes.FindAsync(clienteId);
            if (cliente == null)
            {
                return NotFound("Cliente não encontrado.");
            }

            var compras = await _context.Compras
                .Where(c => c.ClienteId == clienteId)
                .ToListAsync();

            if (!compras.Any())
            {
                return NotFound("Nenhuma compra encontrada para o cliente.");
            }

            return Ok(compras);
        }

        // GET: api/Clientes/{clienteId}/parcelasPagas
        [HttpGet("{clienteId}/parcelasPagas")]
        public async Task<ActionResult<IEnumerable<Parcela>>> GetParcelasPagasPorCliente(int clienteId)
        {
            var cliente = await _context.Clientes.FindAsync(clienteId);
            if (cliente == null)
            {
                return NotFound("Cliente não encontrado.");
            }

            var parcelasPagas = await _context.Parcelas
                .Include(p => p.Compra)
                .Where(p => p.Compra.ClienteId == clienteId && p.Pago == true)
                .ToListAsync();

            if (!parcelasPagas.Any())
            {
                return NotFound("Nenhuma parcela paga encontrada para o cliente.");
            }

            return Ok(parcelasPagas);
        }

        // GET: api/Clientes/{clienteId}/parcelasAbertas
        [HttpGet("{clienteId}/parcelasAbertas")]
        public async Task<ActionResult<IEnumerable<Parcela>>> GetParcelasAbertasPorCliente(int clienteId)
        {
            var cliente = await _context.Clientes.FindAsync(clienteId);
            if (cliente == null)
            {
                return NotFound("Cliente não encontrado.");
            }

            var parcelasAbertas = await _context.Parcelas
                .Include(p => p.Compra)
                .Where(p => p.Compra.ClienteId == clienteId && p.Pago == false)
                .ToListAsync();

            if (!parcelasAbertas.Any())
            {
                return NotFound("Nenhuma parcela em aberto encontrada para o cliente.");
            }

            return Ok(parcelasAbertas);
        }
        // PUT: api/Clientes/bloquearCliente/5
        [HttpPut("bloquearCliente/{id}")]
        public async Task<IActionResult> BloquearCliente(int id)
        {
            var cliente = await _context.Clientes.FindAsync(id);
            if (cliente == null)
            {
                return NotFound("Cliente não encontrado.");
            }

            // Bloqueia o cliente
            cliente.Bloqueado = true;
            _context.Entry(cliente).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ClienteExists(id))
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

        // PUT: api/Clientes/desbloquearCliente/5
        [HttpPut("desbloquearCliente/{id}")]
        public async Task<IActionResult> DesbloquearCliente(int id)
        {
            var cliente = await _context.Clientes.FindAsync(id);
            if (cliente == null)
            {
                return NotFound("Cliente não encontrado.");
            }

            // Desbloqueia o cliente
            cliente.Bloqueado = false;
            _context.Entry(cliente).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ClienteExists(id))
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

    }
}
