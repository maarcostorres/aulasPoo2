using Microsoft.AspNetCore.Mvc;
using MVConsultoria.Web.Data;
using MVConsultoria.Web.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;


namespace MVConsultoria.Web.Controllers
{
    [Authorize]
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
        public async Task<ActionResult<IEnumerable<ClienteDto>>> GetClientes()
        {
            try
            {
                // Seleciona os dados relevantes e mapeia para o DTO
                var clientes = await _context.Clientes
                    .Select(c => new ClienteDto
                    {
                        Id = c.Id,
                        Nome = c.Nome,
                        CPF = c.CPF,
                        Email = c.Email,
                        Endereco = c.Endereco,
                        Telefone = c.Telefone,
                        DiaDePagamento = c.DiaDePagamento,
                        LimiteDeCredito = c.LimiteDeCredito,
                        LimiteDisponivel = c.LimiteDisponivel,
                        Bloqueado = c.Bloqueado
                    })
                    .ToListAsync();

                // Se não houver clientes, retorna uma mensagem apropriada
                if (clientes == null || !clientes.Any())
                {
                    return NotFound(new { message = "Nenhum cliente encontrado." });
                }

                return Ok(clientes);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Ocorreu um erro ao buscar os clientes.", error = ex.Message });
            }
        }



        [HttpGet("localizarCliente/{id}")]
        public async Task<ActionResult<ClienteDto>> GetCliente(int id)
        {
            var cliente = await _context.Clientes.FirstOrDefaultAsync(c => c.Id == id);

            if (cliente == null)
            {
                return NotFound();
            }

            // Mapeia os dados do cliente para o DTO
            var clienteDto = new ClienteDto
            {
                Id = cliente.Id,
                Nome = cliente.Nome,
                CPF = cliente.CPF,
                Email = cliente.Email,
                Endereco = cliente.Endereco,
                Telefone = cliente.Telefone,
                DiaDePagamento = cliente.DiaDePagamento,
                LimiteDeCredito = cliente.LimiteDeCredito,
                LimiteDisponivel = cliente.LimiteDisponivel,
                Bloqueado = cliente.Bloqueado
            };

            return clienteDto;
        }




        // POST: api/Clientes/cadastrarCliente
        [HttpPost("cadastrarCliente")]
        public async Task<ActionResult<Cliente>> PostCliente(Cliente cliente)
        {
            // Verifica se o CPF já existe
            var clienteExistente = await _context.Users.FirstOrDefaultAsync(c => c.CPF == cliente.CPF);
            if (clienteExistente != null)
            {
                return BadRequest(new { message = "CPF já cadastrado." });
            }

            // Criptografa a senha antes de salvar no banco de dados
            cliente.Senha = BCrypt.Net.BCrypt.HashPassword(cliente.Senha);

            // Define um limite de crédito padrão para novos clientes, se não definido
            if (cliente.LimiteDeCredito == 0)
            {
                cliente.LimiteDeCredito = 300.00;
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

            // Criptografa a senha antes de salvar no banco de dados
            cliente.Senha = BCrypt.Net.BCrypt.HashPassword(cliente.Senha);


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
        public async Task<IActionResult> AjustarLimiteDeCredito(int id, [FromBody] LimiteDto limiteDto)
        {
            // Busca o cliente pelo ID
            var cliente = await _context.Clientes
                .Include(c => c.Compras)  // Inclui as compras associadas ao cliente
                .ThenInclude(compra => compra.Parcelas)  // Inclui as parcelas associadas às compras
                .FirstOrDefaultAsync(c => c.Id == id);

            if (cliente == null)
            {
                return NotFound("Cliente não encontrado.");
            }

            // Ajusta o limite de crédito do cliente
            if (limiteDto.NovoLimite < 0)
            {
                return BadRequest("O limite de crédito não pode ser negativo.");
            }

            // Atualiza o limite de crédito
            cliente.LimiteDeCredito = limiteDto.NovoLimite;

            // Calcula o total das parcelas em aberto (não pagas)
            double totalParcelasEmAberto = cliente.Compras
                .SelectMany(c => c.Parcelas)
                .Where(p => !p.Pago)
                .Sum(p => p.Valor);

            // Atualiza o limite disponível (Limite de crédito - Total de parcelas em aberto)
            cliente.LimiteDisponivel = cliente.LimiteDeCredito - totalParcelasEmAberto;

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
