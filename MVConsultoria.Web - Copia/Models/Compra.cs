using System.ComponentModel.DataAnnotations; // Importar este namespace
namespace MVConsultoria.Web.Models
{

    public class Compra
    {
        public int Id { get; set; }

        public int ClienteId { get; set; }

        public required Cliente Cliente { get; set; }// Relacionamento com o Cliente

        public DateTime DataCompra { get; set; }
        public double ValorTotal { get; set; }

        public ICollection<Parcela> Parcelas { get; set; } = new List<Parcela>();

        // Nova propriedade para quantidade de parcelas
        [Range(1, 5, ErrorMessage = "O número de parcelas deve estar entre 1 e 5.")]
        public int QuantidadeParcelas { get; set; }





    }
}
