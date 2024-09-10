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

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // Configurando relacionamentos

            // Compra <-> Parcela
            modelBuilder.Entity<Compra>()
                .HasMany(c => c.Parcelas)
                .WithOne(p => p.Compra)  // Garantindo que a parcela tem uma compra associada
                .HasForeignKey(p => p.CompraId);

            // Outras configurações de relacionamento podem ser adicionadas aqui

            // Definindo relacionamento entre Cliente e Compra
            modelBuilder.Entity<Cliente>()
                .HasMany(c => c.Compras)
                .WithOne(compra => compra.Cliente)
                .HasForeignKey(compra => compra.ClienteId);
        }
    }
}
