public class ParcelaDto
{
    public int Id { get; set; }
    public DateTime DataVencimento { get; set; }
    public decimal Valor { get; set; }
    public bool Pago { get; set; }
    public DateTime? DataPagamento { get; set; }
    public decimal ValorPago { get; set; }

    // Adicionar nome do cliente
    public string NomeCliente { get; set; }  // Propriedade para o nome do cliente

    public int CompraId { get; set; }  // ID da compra
}
