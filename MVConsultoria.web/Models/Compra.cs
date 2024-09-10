namespace MVConsultoria.Web.Models
{
    /*public class Compra
    {
        public int Id { get; set; }
        public int ClienteId { get; set; }

        // Relacionamento com o Cliente
        public Cliente? Cliente { get; set; }  // O Cliente não é necessário na criação da compra

        public DateTime DataCompra { get; set; }
        public decimal ValorTotal { get; set; }

        public ICollection<Parcela> Parcelas { get; set; } = new List<Parcela>();
    }*/

    public class Compra
    {
        public int Id { get; set; }

        public int ClienteId { get; set; }
        public Cliente? Cliente { get; set; }  // Relacionamento com o Cliente

        public DateTime DataCompra { get; set; }
        public decimal ValorTotal { get; set; }

        public ICollection<Parcela> Parcelas { get; set; } = new List<Parcela>();
    }

}
