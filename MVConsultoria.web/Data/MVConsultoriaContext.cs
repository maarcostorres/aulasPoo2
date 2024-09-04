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
            modelBuilder.Entity<Cliente>()
                .HasMany(c => c.Compras)
                .WithOne(c => c.Cliente)
                .HasForeignKey(c => c.ClienteId);

            modelBuilder.Entity<Compra>()
                .HasMany(c => c.Parcelas)
                .WithOne(p => p.Compra)
                .HasForeignKey(p => p.CompraId);

            modelBuilder.Entity<Pagamento>()
                .HasOne(p => p.Cliente)
                .WithMany(c => c.Pagamentos)
                .HasForeignKey(p => p.ClienteId);
        }
    }
}
