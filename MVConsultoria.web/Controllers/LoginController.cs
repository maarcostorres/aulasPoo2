using Microsoft.AspNetCore.Mvc;
using MVConsultoria.Web.Dtos;
using MVConsultoria.Web.Data;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
//using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
//using MVConsultoria.Web.Dtos;
//using MVConsultoria.Web.Data;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
//using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;




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

        /* // POST: api/Auth/login
         [HttpPost("login")]
         public async Task<IActionResult> Login([FromBody] LoginDto loginDto)
         {
             // Verifica se o usuário existe
             var user = await _context.Users.FirstOrDefaultAsync(u => u.Login == loginDto.Login);
             if (user == null || user.Senha != loginDto.Senha)
             {
                 return Unauthorized(new { message = "Login ou senha incorretos" });
             }

             // Sucesso no login
             // Aqui você pode gerar um token JWT ou retornar alguma resposta personalizada
             return Ok(new { message = "Login bem-sucedido!" });
         }*/



        // POST: api/Auth/login
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDto loginDto)
        {
            // Verifica se o usuário existe
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Login == loginDto.Login);
            if (user == null || user.Senha != loginDto.Senha)
            {
                return Unauthorized(new { message = "Login ou senha incorretos" });
            }

            // Gera o token JWT
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.UTF8.GetBytes("your_secret_key"); // Use a mesma chave secreta
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new[]
                {
                    new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                    new Claim(ClaimTypes.Name, user.Login),
                    new Claim(ClaimTypes.Role, "User") // Você pode adicionar mais claims aqui, como Role
                }),
                Expires = DateTime.UtcNow.AddHours(1), // Define o tempo de expiração do token
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature),
                Issuer = "yourapp",
                Audience = "yourapp"
            };

            var token = tokenHandler.CreateToken(tokenDescriptor);
            var tokenString = tokenHandler.WriteToken(token);

            // Retorna o token JWT para o cliente
            return Ok(new { token = tokenString });
        }
    }
}
