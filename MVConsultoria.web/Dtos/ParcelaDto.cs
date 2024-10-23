public class ParcelaDto
{
    public int Id { get; set; }
    public DateTime DataVencimento { get; set; }
    public decimal Valor { get; set; }
    public bool Pago { get; set; }
    public DateTime? DataPagamento { get; set; }
    public decimal ValorPago { get; set; }


    public string NomeCliente { get; set; }

    public int CompraId { get; set; }
}
