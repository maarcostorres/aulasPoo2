namespace MVConsultoria.Web.Models
{
    public class Cliente
    {
        public int Id { get; set; }
        public string Nome { get; set; } = string.Empty;
        public string CPF { get; set; } = string.Empty;
        public string Endereco { get; set; } = string.Empty;
        public string Telefone { get; set; } = string.Empty;
        public DateTime DiaDePagamento { get; set; }
        public decimal LimiteDeCredito { get; set; }

        // Adicionando relacionamentos
        public ICollection<Compra> Compras { get; set; } = new List<Compra>();
        public ICollection<Pagamento> Pagamentos { get; set; } = new List<Pagamento>();
    }
}
