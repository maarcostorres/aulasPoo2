using System.ComponentModel.DataAnnotations;


namespace MVConsultoria.Web.Dtos
{
    public class LoginDto
    {
        [Required]
        public string Login { get; set; }

        [Required]
        public string Senha { get; set; }
    }

}
