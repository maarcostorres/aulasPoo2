namespace MVConsultoria.Web.Models
{
    public class Parcela
    {
        public int Id { get; set; }
        public int CompraId { get; set; }
        public Compra Compra { get; set; } = null!;
        public DateTime DataVencimento { get; set; }
        public decimal Valor { get; set; }
        public bool Pago { get; set; }
    }
}
