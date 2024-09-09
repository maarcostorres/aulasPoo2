using System.ComponentModel.DataAnnotations;

namespace MVConsultoria.Web.Models
{
    public class Cliente
    {
        public int Id { get; set; }

        [Required(ErrorMessage = "O nome é obrigatório.")]
        public string Nome { get; set; } = string.Empty;

        [Required(ErrorMessage = "O CPF é obrigatório.")]
        [RegularExpression(@"^\d{11}$", ErrorMessage = "O CPF deve ter 11 dígitos.")]
        public string CPF { get; set; } = string.Empty;

        [Required(ErrorMessage = "O endereço é obrigatório.")]
        public string Endereco { get; set; } = string.Empty;

        [Required(ErrorMessage = "O telefone é obrigatório.")]
        public string Telefone { get; set; } = string.Empty;

        public DateTime DiaDePagamento { get; set; }

        [Range(0, double.MaxValue, ErrorMessage = "O limite de crédito deve ser um valor positivo.")]
        public decimal LimiteDeCredito { get; set; }

        public decimal LimiteDisponivel { get; set; }

        // Novo campo para indicar se o cliente está bloqueado
        public bool Bloqueado { get; set; } = false;  // Inicia como não bloqueado
    }

}
