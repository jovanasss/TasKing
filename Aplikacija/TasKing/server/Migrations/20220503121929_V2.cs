using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace TasKing.Migrations
{
    public partial class V2 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Clan organizacije_Korisnik_korisnikIDID",
                table: "Clan organizacije");

            migrationBuilder.DropForeignKey(
                name: "FK_Clan organizacije_Organizacija_organizacijaIDID",
                table: "Clan organizacije");

            migrationBuilder.DropForeignKey(
                name: "FK_Clan tima_Clan organizacije_clanOgranizacijeIDID",
                table: "Clan tima");

            migrationBuilder.DropForeignKey(
                name: "FK_Clan tima_Tim_timIDID",
                table: "Clan tima");

            migrationBuilder.DropForeignKey(
                name: "FK_Projekat_Tim_timIDID",
                table: "Projekat");

            migrationBuilder.DropColumn(
                name: "vremePosecivanja",
                table: "Tim");

            migrationBuilder.DropColumn(
                name: "vremePosecivanja",
                table: "Organizacija");

            migrationBuilder.RenameColumn(
                name: "timIDID",
                table: "Projekat",
                newName: "timID");

            migrationBuilder.RenameIndex(
                name: "IX_Projekat_timIDID",
                table: "Projekat",
                newName: "IX_Projekat_timID");

            migrationBuilder.RenameColumn(
                name: "timIDID",
                table: "Clan tima",
                newName: "timID");

            migrationBuilder.RenameColumn(
                name: "clanOgranizacijeIDID",
                table: "Clan tima",
                newName: "clanOgranizacijeID");

            migrationBuilder.RenameIndex(
                name: "IX_Clan tima_timIDID",
                table: "Clan tima",
                newName: "IX_Clan tima_timID");

            migrationBuilder.RenameIndex(
                name: "IX_Clan tima_clanOgranizacijeIDID",
                table: "Clan tima",
                newName: "IX_Clan tima_clanOgranizacijeID");

            migrationBuilder.RenameColumn(
                name: "organizacijaIDID",
                table: "Clan organizacije",
                newName: "organizacijaID");

            migrationBuilder.RenameColumn(
                name: "korisnikIDID",
                table: "Clan organizacije",
                newName: "korisnikID");

            migrationBuilder.RenameIndex(
                name: "IX_Clan organizacije_organizacijaIDID",
                table: "Clan organizacije",
                newName: "IX_Clan organizacije_organizacijaID");

            migrationBuilder.RenameIndex(
                name: "IX_Clan organizacije_korisnikIDID",
                table: "Clan organizacije",
                newName: "IX_Clan organizacije_korisnikID");

            migrationBuilder.AddColumn<string>(
                name: "kod",
                table: "Tim",
                type: "nvarchar(6)",
                maxLength: 6,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "kod",
                table: "Organizacija",
                type: "nvarchar(6)",
                maxLength: 6,
                nullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "profilnaSlika",
                table: "Korisnik",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.AddColumn<string>(
                name: "brTelefona",
                table: "Korisnik",
                type: "nvarchar(20)",
                maxLength: 20,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<DateTime>(
                name: "vremePosecivanja",
                table: "Clan tima",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<DateTime>(
                name: "vremePosecivanja",
                table: "Clan organizacije",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.CreateTable(
                name: "Poziv u organizaciju",
                columns: table => new
                {
                    ID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    pozvaniKorisnikID = table.Column<int>(type: "int", nullable: false),
                    vremePoziva = table.Column<DateTime>(type: "datetime2", nullable: false),
                    status = table.Column<bool>(type: "bit", nullable: false),
                    organizacijaID = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Poziv u organizaciju", x => x.ID);
                    table.ForeignKey(
                        name: "FK_Poziv u organizaciju_Korisnik_pozvaniKorisnikID",
                        column: x => x.pozvaniKorisnikID,
                        principalTable: "Korisnik",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Poziv u organizaciju_Organizacija_organizacijaID",
                        column: x => x.organizacijaID,
                        principalTable: "Organizacija",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Poziv u tim",
                columns: table => new
                {
                    ID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    pozvaniKorisnikID = table.Column<int>(type: "int", nullable: false),
                    vremePoziva = table.Column<DateTime>(type: "datetime2", nullable: false),
                    status = table.Column<bool>(type: "bit", nullable: false),
                    timID = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Poziv u tim", x => x.ID);
                    table.ForeignKey(
                        name: "FK_Poziv u tim_Korisnik_pozvaniKorisnikID",
                        column: x => x.pozvaniKorisnikID,
                        principalTable: "Korisnik",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Poziv u tim_Tim_timID",
                        column: x => x.timID,
                        principalTable: "Tim",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Poziv u organizaciju_organizacijaID",
                table: "Poziv u organizaciju",
                column: "organizacijaID");

            migrationBuilder.CreateIndex(
                name: "IX_Poziv u organizaciju_pozvaniKorisnikID",
                table: "Poziv u organizaciju",
                column: "pozvaniKorisnikID");

            migrationBuilder.CreateIndex(
                name: "IX_Poziv u tim_pozvaniKorisnikID",
                table: "Poziv u tim",
                column: "pozvaniKorisnikID");

            migrationBuilder.CreateIndex(
                name: "IX_Poziv u tim_timID",
                table: "Poziv u tim",
                column: "timID");

            migrationBuilder.AddForeignKey(
                name: "FK_Clan organizacije_Korisnik_korisnikID",
                table: "Clan organizacije",
                column: "korisnikID",
                principalTable: "Korisnik",
                principalColumn: "ID",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Clan organizacije_Organizacija_organizacijaID",
                table: "Clan organizacije",
                column: "organizacijaID",
                principalTable: "Organizacija",
                principalColumn: "ID",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Clan tima_Clan organizacije_clanOgranizacijeID",
                table: "Clan tima",
                column: "clanOgranizacijeID",
                principalTable: "Clan organizacije",
                principalColumn: "ID",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Clan tima_Tim_timID",
                table: "Clan tima",
                column: "timID",
                principalTable: "Tim",
                principalColumn: "ID",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Projekat_Tim_timID",
                table: "Projekat",
                column: "timID",
                principalTable: "Tim",
                principalColumn: "ID",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Clan organizacije_Korisnik_korisnikID",
                table: "Clan organizacije");

            migrationBuilder.DropForeignKey(
                name: "FK_Clan organizacije_Organizacija_organizacijaID",
                table: "Clan organizacije");

            migrationBuilder.DropForeignKey(
                name: "FK_Clan tima_Clan organizacije_clanOgranizacijeID",
                table: "Clan tima");

            migrationBuilder.DropForeignKey(
                name: "FK_Clan tima_Tim_timID",
                table: "Clan tima");

            migrationBuilder.DropForeignKey(
                name: "FK_Projekat_Tim_timID",
                table: "Projekat");

            migrationBuilder.DropTable(
                name: "Poziv u organizaciju");

            migrationBuilder.DropTable(
                name: "Poziv u tim");

            migrationBuilder.DropColumn(
                name: "kod",
                table: "Tim");

            migrationBuilder.DropColumn(
                name: "kod",
                table: "Organizacija");

            migrationBuilder.DropColumn(
                name: "brTelefona",
                table: "Korisnik");

            migrationBuilder.DropColumn(
                name: "vremePosecivanja",
                table: "Clan tima");

            migrationBuilder.DropColumn(
                name: "vremePosecivanja",
                table: "Clan organizacije");

            migrationBuilder.RenameColumn(
                name: "timID",
                table: "Projekat",
                newName: "timIDID");

            migrationBuilder.RenameIndex(
                name: "IX_Projekat_timID",
                table: "Projekat",
                newName: "IX_Projekat_timIDID");

            migrationBuilder.RenameColumn(
                name: "timID",
                table: "Clan tima",
                newName: "timIDID");

            migrationBuilder.RenameColumn(
                name: "clanOgranizacijeID",
                table: "Clan tima",
                newName: "clanOgranizacijeIDID");

            migrationBuilder.RenameIndex(
                name: "IX_Clan tima_timID",
                table: "Clan tima",
                newName: "IX_Clan tima_timIDID");

            migrationBuilder.RenameIndex(
                name: "IX_Clan tima_clanOgranizacijeID",
                table: "Clan tima",
                newName: "IX_Clan tima_clanOgranizacijeIDID");

            migrationBuilder.RenameColumn(
                name: "organizacijaID",
                table: "Clan organizacije",
                newName: "organizacijaIDID");

            migrationBuilder.RenameColumn(
                name: "korisnikID",
                table: "Clan organizacije",
                newName: "korisnikIDID");

            migrationBuilder.RenameIndex(
                name: "IX_Clan organizacije_organizacijaID",
                table: "Clan organizacije",
                newName: "IX_Clan organizacije_organizacijaIDID");

            migrationBuilder.RenameIndex(
                name: "IX_Clan organizacije_korisnikID",
                table: "Clan organizacije",
                newName: "IX_Clan organizacije_korisnikIDID");

            migrationBuilder.AddColumn<DateTime>(
                name: "vremePosecivanja",
                table: "Tim",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<DateTime>(
                name: "vremePosecivanja",
                table: "Organizacija",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AlterColumn<string>(
                name: "profilnaSlika",
                table: "Korisnik",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true);

            migrationBuilder.AddForeignKey(
                name: "FK_Clan organizacije_Korisnik_korisnikIDID",
                table: "Clan organizacije",
                column: "korisnikIDID",
                principalTable: "Korisnik",
                principalColumn: "ID",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Clan organizacije_Organizacija_organizacijaIDID",
                table: "Clan organizacije",
                column: "organizacijaIDID",
                principalTable: "Organizacija",
                principalColumn: "ID",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Clan tima_Clan organizacije_clanOgranizacijeIDID",
                table: "Clan tima",
                column: "clanOgranizacijeIDID",
                principalTable: "Clan organizacije",
                principalColumn: "ID",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Clan tima_Tim_timIDID",
                table: "Clan tima",
                column: "timIDID",
                principalTable: "Tim",
                principalColumn: "ID",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Projekat_Tim_timIDID",
                table: "Projekat",
                column: "timIDID",
                principalTable: "Tim",
                principalColumn: "ID",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
