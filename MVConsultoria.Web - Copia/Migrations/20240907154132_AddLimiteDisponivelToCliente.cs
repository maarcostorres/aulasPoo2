using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MVConsultoria.Web.Migrations
{
    /// <inheritdoc />
    public partial class AddLimiteDisponivelToCliente : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<decimal>(
                name: "LimiteDisponivel",
                table: "Clientes",
                type: "decimal(18,2)",
                nullable: false,
                defaultValue: 0m);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "LimiteDisponivel",
                table: "Clientes");
        }
    }
}
