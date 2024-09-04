namespace MVConsultoria.Web.Models
{
    public class Compra
    {
        public int Id { get; set; }
        public int ClienteId { get; set; }
        public Cliente Cliente { get; set; } = null!;
        public DateTime DataCompra { get; set; }
        public decimal ValorTotal { get; set; }
        public ICollection<Parcela> Parcelas { get; set; } = new List<Parcela>();
    }
}
