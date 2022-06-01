using Microsoft.EntityFrameworkCore.Migrations;

namespace TasKing.Migrations
{
    public partial class V3 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "status",
                table: "Projekat",
                newName: "aktivan");

            migrationBuilder.RenameColumn(
                name: "status",
                table: "Poziv u tim",
                newName: "prihvacen");

            migrationBuilder.RenameColumn(
                name: "status",
                table: "Poziv u organizaciju",
                newName: "prihvacen");

            migrationBuilder.AddColumn<int>(
                name: "organizacijaID",
                table: "Tim",
                type: "int",
                nullable: true);

            migrationBuilder.AlterColumn<int>(
                name: "status",
                table: "Task",
                type: "int",
                nullable: false,
                oldClrType: typeof(bool),
                oldType: "bit");

            migrationBuilder.CreateTable(
                name: "Prijava Za Task",
                columns: table => new
                {
                    ID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    taskID = table.Column<int>(type: "int", nullable: false),
                    clanTimaID = table.Column<int>(type: "int", nullable: false),
                    pregledan = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Prijava Za Task", x => x.ID);
                    table.ForeignKey(
                        name: "FK_Prijava Za Task_Clan tima_clanTimaID",
                        column: x => x.clanTimaID,
                        principalTable: "Clan tima",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Prijava Za Task_Task_taskID",
                        column: x => x.taskID,
                        principalTable: "Task",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Tim_organizacijaID",
                table: "Tim",
                column: "organizacijaID");

            migrationBuilder.CreateIndex(
                name: "IX_Prijava Za Task_clanTimaID",
                table: "Prijava Za Task",
                column: "clanTimaID");

            migrationBuilder.CreateIndex(
                name: "IX_Prijava Za Task_taskID",
                table: "Prijava Za Task",
                column: "taskID");

            migrationBuilder.AddForeignKey(
                name: "FK_Tim_Organizacija_organizacijaID",
                table: "Tim",
                column: "organizacijaID",
                principalTable: "Organizacija",
                principalColumn: "ID",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Tim_Organizacija_organizacijaID",
                table: "Tim");

            migrationBuilder.DropTable(
                name: "Prijava Za Task");

            migrationBuilder.DropIndex(
                name: "IX_Tim_organizacijaID",
                table: "Tim");

            migrationBuilder.DropColumn(
                name: "organizacijaID",
                table: "Tim");

            migrationBuilder.RenameColumn(
                name: "aktivan",
                table: "Projekat",
                newName: "status");

            migrationBuilder.RenameColumn(
                name: "prihvacen",
                table: "Poziv u tim",
                newName: "status");

            migrationBuilder.RenameColumn(
                name: "prihvacen",
                table: "Poziv u organizaciju",
                newName: "status");

            migrationBuilder.AlterColumn<bool>(
                name: "status",
                table: "Task",
                type: "bit",
                nullable: false,
                oldClrType: typeof(int),
                oldType: "int");
        }
    }
}
