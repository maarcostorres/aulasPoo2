namespace MVConsultoria.Web.Models
{
    public class Pagamento
    {
        public int Id { get; set; }
        public int ClienteId { get; set; }
        public Cliente Cliente { get; set; } = null!;
        public DateTime DataPagamento { get; set; }
        public decimal ValorPago { get; set; }
    }
}
