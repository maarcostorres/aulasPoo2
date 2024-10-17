public class CompraDto
{
    public int Id { get; set; }
    public DateTime DataCompra { get; set; }
    public decimal ValorTotal { get; set; }
    public int QuantidadeParcelas { get; set; }

    //public int ClienteId { get; set; } // Adicione este campo

    public string NomeCliente { get; set; } // Nome do cliente (opcional para exibição)
}
