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
        public DbSet<User> Users { get; set; }
        public DbSet<Administrador> Administradores { get; set; }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // Configurando relacionamentos

            // Compra -> Cliente (relacionamento um para muitos)
            modelBuilder.Entity<Compra>()
                .HasOne(c => c.Cliente)
                .WithMany(cliente => cliente.Compras)
                .HasForeignKey(c => c.ClienteId)
                .OnDelete(DeleteBehavior.Cascade); // Define o comportamento de exclusão

            // Compra -> Parcela (relacionamento um para muitos)
            modelBuilder.Entity<Compra>()
                .HasMany(c => c.Parcelas)
                .WithOne(p => p.Compra)
                .HasForeignKey(p => p.CompraId)
                .OnDelete(DeleteBehavior.Cascade);

        }
    }
}
