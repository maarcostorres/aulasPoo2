using System;
using Microsoft.EntityFrameworkCore.Migrations;
using MySql.EntityFrameworkCore.Metadata;

#nullable disable

namespace MVConsultoria.Web.Migrations
{
    /// <inheritdoc />
    public partial class SecondCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Compras_Clientes_ClienteId",
                table: "Compras");

            migrationBuilder.DropTable(
                name: "Clientes");

            migrationBuilder.DropColumn(
                name: "Login",
                table: "Users");

            migrationBuilder.AlterColumn<bool>(
                name: "Bloqueado",
                table: "Users",
                type: "tinyint(1)",
                nullable: true,
                oldClrType: typeof(bool),
                oldType: "tinyint(1)");

            migrationBuilder.AddColumn<DateTime>(
                name: "DiaDePagamento",
                table: "Users",
                type: "datetime(6)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Endereco",
                table: "Users",
                type: "longtext",
                nullable: true);

            migrationBuilder.AddColumn<decimal>(
                name: "LimiteDeCredito",
                table: "Users",
                type: "decimal(18,2)",
                nullable: true);

            migrationBuilder.AddColumn<decimal>(
                name: "LimiteDisponivel",
                table: "Users",
                type: "decimal(18,2)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Telefone",
                table: "Users",
                type: "longtext",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "UserBloqueado",
                table: "Users",
                type: "tinyint(1)",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<int>(
                name: "ClienteId1",
                table: "Compras",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "QuantidadeParcelas",
                table: "Compras",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_Compras_ClienteId1",
                table: "Compras",
                column: "ClienteId1");

            migrationBuilder.AddForeignKey(
                name: "FK_Compras_Users_ClienteId",
                table: "Compras",
                column: "ClienteId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Compras_Users_ClienteId1",
                table: "Compras",
                column: "ClienteId1",
                principalTable: "Users",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Compras_Users_ClienteId",
                table: "Compras");

            migrationBuilder.DropForeignKey(
                name: "FK_Compras_Users_ClienteId1",
                table: "Compras");

            migrationBuilder.DropIndex(
                name: "IX_Compras_ClienteId1",
                table: "Compras");

            migrationBuilder.DropColumn(
                name: "DiaDePagamento",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "Endereco",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "LimiteDeCredito",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "LimiteDisponivel",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "Telefone",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "UserBloqueado",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "ClienteId1",
                table: "Compras");

            migrationBuilder.DropColumn(
                name: "QuantidadeParcelas",
                table: "Compras");

            migrationBuilder.AlterColumn<bool>(
                name: "Bloqueado",
                table: "Users",
                type: "tinyint(1)",
                nullable: false,
                defaultValue: false,
                oldClrType: typeof(bool),
                oldType: "tinyint(1)",
                oldNullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Login",
                table: "Users",
                type: "longtext",
                nullable: false);

            migrationBuilder.CreateTable(
                name: "Clientes",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySQL:ValueGenerationStrategy", MySQLValueGenerationStrategy.IdentityColumn),
                    Bloqueado = table.Column<bool>(type: "tinyint(1)", nullable: false),
                    CPF = table.Column<string>(type: "longtext", nullable: false),
                    DiaDePagamento = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    Endereco = table.Column<string>(type: "longtext", nullable: false),
                    LimiteDeCredito = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    LimiteDisponivel = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    Nome = table.Column<string>(type: "longtext", nullable: false),
                    Telefone = table.Column<string>(type: "longtext", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Clientes", x => x.Id);
                })
                .Annotation("MySQL:Charset", "utf8mb4");

            migrationBuilder.AddForeignKey(
                name: "FK_Compras_Clientes_ClienteId",
                table: "Compras",
                column: "ClienteId",
                principalTable: "Clientes",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
