using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MVConsultoria.Web.Migrations
{
    /// <inheritdoc />
    public partial class AdjustClienteCompraRelation : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Compras_Users_ClienteId1",
                table: "Compras");

            migrationBuilder.DropIndex(
                name: "IX_Compras_ClienteId1",
                table: "Compras");

            migrationBuilder.DropColumn(
                name: "ClienteId1",
                table: "Compras");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "ClienteId1",
                table: "Compras",
                type: "int",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Compras_ClienteId1",
                table: "Compras",
                column: "ClienteId1");

            migrationBuilder.AddForeignKey(
                name: "FK_Compras_Users_ClienteId1",
                table: "Compras",
                column: "ClienteId1",
                principalTable: "Users",
                principalColumn: "Id");
        }
    }
}
