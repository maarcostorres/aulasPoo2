using Microsoft.AspNetCore.Mvc;
using MVConsultoria.Web.Dtos;
using MVConsultoria.Web.Data;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.AspNetCore.Authorization;
using BCrypt.Net;
using MVConsultoria.Web.Models;

namespace MVConsultoria.Web.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly MVConsultoriaContext _context;

        public AuthController(MVConsultoriaContext context)
        {
            _context = context;
        }

        // POST: api/Auth/login
        [AllowAnonymous]
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDto loginDto)
        {
            // Verifica se o usuário existe usando o CPF como login
            var user = await _context.Users.FirstOrDefaultAsync(u => u.CPF == loginDto.Login);
            if (user == null || !BCrypt.Net.BCrypt.Verify(loginDto.Senha, user.Senha))
            {
                return Unauthorized(new { message = "CPF ou senha incorretos" });
            }

            // Gera o token JWT
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.UTF8.GetBytes("supersecretkey12345678901234567890"); // Chave secreta com pelo menos 32 caracteres
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new[]
                {
                    new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                    new Claim(ClaimTypes.Name, user.CPF), // CPF como login
                    new Claim(ClaimTypes.Role, user is Administrador ? "Administrador" : "Cliente") // Role baseada no tipo de usuário
                }),
                Expires = DateTime.UtcNow.AddHours(1), // Tempo de expiração do token
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature),
                Issuer = "yourapp",
                Audience = "yourapp"
            };

            var token = tokenHandler.CreateToken(tokenDescriptor);
            var tokenString = tokenHandler.WriteToken(token);

            // Verifica o tipo de usuário e retorna no payload da resposta
            var userType = user is Administrador ? "Administrador" : "Cliente";

            // Retorna o token JWT para o cliente junto com o tipo de usuário
            return Ok(new { token = tokenString, userType });
        }
    }
}
