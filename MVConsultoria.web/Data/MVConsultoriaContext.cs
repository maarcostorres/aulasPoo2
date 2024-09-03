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
    }
}
