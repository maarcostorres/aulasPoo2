using Microsoft.EntityFrameworkCore;
using MVConsultoria.Web.Models;

namespace MVConsultoria.Web.Data
{
    public class MVConsultoriaContext : DbContext
    {
        public MVConsultoriaContext(DbContextOptions<MVConsultoriaContext> options) : base(options)
        {
        }

        public DbSet<Cliente> Clientes { get; set; }
        public DbSet<Compra> Compras { get; set; }
        public DbSet<Parcela> Parcelas { get; set; }
        public DbSet<Pagamento> Pagamentos { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // Configurando relacionamentos

            // Cliente <-> Compra
            modelBuilder.Entity<Cliente>()
                .HasMany(c => c.Compras);
            //.WithOne(c => c.Cliente)
            //.HasForeignKey(c => c.ClienteId);

            // Compra <-> Parcela
            modelBuilder.Entity<Compra>()
                .HasMany(c => c.Parcelas);
            //.WithOne(p => p.Compra)
            //.HasForeignKey(p => p.CompraId);

            // Cliente <-> Pagamento
            modelBuilder.Entity<Cliente>()
                .HasMany(c => c.Pagamentos)
                .WithOne(p => p.Cliente)
                .HasForeignKey(p => p.ClienteId);
        }
    }
}
