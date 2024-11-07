namespace MVConsultoria.Web.Models
{
    public class Parcela
    {
        public int Id { get; set; }
        public int CompraId { get; set; }
        public Compra? Compra { get; set; }
        public DateTime DataVencimento { get; set; }
        public double Valor { get; set; }
        public bool Pago { get; set; }
        public DateTime? DataPagamento { get; set; }  // Pode ser nulo até o pagamento
        public double ValorPago { get; set; }  // O valor efetivamente pago
    }
}
