using Microsoft.AspNetCore.Mvc;
using MVConsultoria.Web.Data;
using MVConsultoria.Web.Models;
using MVConsultoria.Web.Dtos;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;
using BCrypt.Net;

namespace MVConsultoria.Web.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly MVConsultoriaContext _context;

        public UsersController(MVConsultoriaContext context)
        {
            _context = context;
        }

        // GET: api/Users
        [HttpGet]
        public async Task<ActionResult<IEnumerable<User>>> GetUsers()
        {
            return await _context.Users.ToListAsync();
        }

        // GET: api/Users/5
        [HttpGet("{id}")]
        public async Task<ActionResult<User>> GetUser(int id)
        {
            var user = await _context.Users.FindAsync(id);

            if (user == null)
            {
                return NotFound();
            }

            return user;
        }

        // POST: api/Users
        [HttpPost]
        public async Task<ActionResult<User>> PostUser(User user, [FromHeader] int adminId)
        {
            // Verifica se o adminId corresponde a um administrador
            var administrador = await _context.Administradores.FindAsync(adminId);
            if (administrador == null)
            {
                return Unauthorized("Apenas administradores podem adicionar usuários.");
            }

            // Verifica se o CPF do novo usuário já existe
            var usuarioExistente = await _context.Users.FirstOrDefaultAsync(u => u.CPF == user.CPF);
            if (usuarioExistente != null)
            {
                return BadRequest("Usuário com este CPF já está cadastrado.");
            }

            // Hash da senha antes de salvar no banco de dados
            user.Senha = BCrypt.Net.BCrypt.HashPassword(user.Senha);

            // Adiciona o novo usuário ao banco de dados
            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetUser", new { id = user.Id }, user);
        }





        // POST: api/Users/login
        [AllowAnonymous]
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDto loginDto)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.CPF == loginDto.Login);
            if (user == null || !BCrypt.Net.BCrypt.Verify(loginDto.Senha, user.Senha))
            {
                return Unauthorized(new { message = "Login ou senha incorretos" });
            }

            // Sucesso no login (aqui você pode gerar um token JWT)
            return Ok(new { message = "Login bem-sucedido!" });
        }

        // PUT: api/Users/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutUser(int id, User user, [FromHeader] int adminId)
        {
            // Verifica se o adminId corresponde a um administrador
            var administrador = await _context.Administradores.FindAsync(adminId);
            if (administrador == null)
            {
                return Unauthorized("Apenas administradores podem alterar usuários.");
            }

            if (id != user.Id)
            {
                return BadRequest();
            }

            _context.Entry(user).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!UserExists(id))
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

        // DELETE: api/Users/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUser(int id, [FromHeader] int adminId)
        {
            // Verifica se o adminId corresponde a um administrador
            var administrador = await _context.Administradores.FindAsync(adminId);
            if (administrador == null)
            {
                return Unauthorized("Apenas administradores podem excluir usuários.");
            }

            var user = await _context.Users.FindAsync(id);
            if (user == null)
            {
                return NotFound();
            }

            _context.Users.Remove(user);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool UserExists(int id)
        {
            return _context.Users.Any(e => e.Id == id);
        }

        // PUT: api/Users/5/bloquear
        [HttpPut("{id}/bloquear")]
        public async Task<IActionResult> BloquearUsuario(int id, [FromHeader] int adminId)
        {
            var administrador = await _context.Administradores.FindAsync(adminId);
            if (administrador == null)
            {
                return Unauthorized("Apenas administradores podem bloquear usuários.");
            }

            var user = await _context.Users.FindAsync(id);
            if (user == null)
            {
                return NotFound("Usuário não encontrado.");
            }

            user.UserBloqueado = true;

            _context.Entry(user).State = EntityState.Modified;
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // PUT: api/Users/5/desbloquear
        [HttpPut("{id}/desbloquear")]
        public async Task<IActionResult> DesbloquearUsuario(int id, [FromHeader] int adminId)
        {
            var administrador = await _context.Administradores.FindAsync(adminId);
            if (administrador == null)
            {
                return Unauthorized("Apenas administradores podem desbloquear usuários.");
            }

            var user = await _context.Users.FindAsync(id);
            if (user == null)
            {
                return NotFound("Usuário não encontrado.");
            }

            user.UserBloqueado = false;

            _context.Entry(user).State = EntityState.Modified;
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
