using System.ComponentModel.DataAnnotations;

namespace MVConsultoria.Web.Models
{

    public class Cliente : User
    {


        [Required(ErrorMessage = "O endereço é obrigatório.")]
        public string Endereco { get; set; } = string.Empty;

        [Required(ErrorMessage = "O telefone é obrigatório.")]
        public string Telefone { get; set; } = string.Empty;


        public DateTime DiaDePagamento { get; set; }

        [Range(0, double.MaxValue, ErrorMessage = "O limite de crédito deve ser um valor positivo.")]
        public double LimiteDeCredito { get; set; }

        public double LimiteDisponivel { get; set; }

        // Novo campo para indicar se o cliente está bloqueado
        public bool Bloqueado { get; set; } = false;

        // Relacionamento com compras
        public ICollection<Compra> Compras { get; set; } = new List<Compra>();




    }


}
