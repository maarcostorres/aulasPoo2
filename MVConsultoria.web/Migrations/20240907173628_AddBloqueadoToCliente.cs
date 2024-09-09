using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MVConsultoria.Web.Migrations
{
    /// <inheritdoc />
    public partial class AddBloqueadoToCliente : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<DateTime>(
                name: "DataPagamento",
                table: "Parcelas",
                type: "datetime(6)",
                nullable: true,
                oldClrType: typeof(DateTime),
                oldType: "datetime(6)");

            migrationBuilder.AddColumn<bool>(
                name: "Bloqueado",
                table: "Clientes",
                type: "tinyint(1)",
                nullable: false,
                defaultValue: false);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Bloqueado",
                table: "Clientes");

            migrationBuilder.AlterColumn<DateTime>(
                name: "DataPagamento",
                table: "Parcelas",
                type: "datetime(6)",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified),
                oldClrType: typeof(DateTime),
                oldType: "datetime(6)",
                oldNullable: true);
        }
    }
}
