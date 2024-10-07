public class CompraCreateDto
{
    public int ClienteId { get; set; }
    public DateTime DataCompra { get; set; }
    public decimal ValorTotal { get; set; }
    public int QuantidadeParcelas { get; set; }
}
