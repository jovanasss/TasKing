using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace TasKing.Migrations
{
    public partial class V1 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Korisnik",
                columns: table => new
                {
                    ID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    korisnickoIme = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: false),
                    lozinka = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: false),
                    ime = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: false),
                    prezime = table.Column<string>(type: "nvarchar(30)", maxLength: 30, nullable: false),
                    profilnaSlika = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    email = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Korisnik", x => x.ID);
                });

            migrationBuilder.CreateTable(
                name: "Organizacija",
                columns: table => new
                {
                    ID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ime = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    datumOsnivanja = table.Column<DateTime>(type: "datetime2", nullable: false),
                    slika = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    aktivna = table.Column<bool>(type: "bit", nullable: false),
                    vremePosecivanja = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Organizacija", x => x.ID);
                });

            migrationBuilder.CreateTable(
                name: "Tim",
                columns: table => new
                {
                    ID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ime = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    aktivan = table.Column<bool>(type: "bit", nullable: false),
                    datumOsnivanja = table.Column<DateTime>(type: "datetime2", nullable: false),
                    vremePosecivanja = table.Column<DateTime>(type: "datetime2", nullable: false),
                    slika = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Tim", x => x.ID);
                });

            migrationBuilder.CreateTable(
                name: "Clan organizacije",
                columns: table => new
                {
                    ID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    administrator = table.Column<bool>(type: "bit", nullable: false),
                    izbacen = table.Column<bool>(type: "bit", nullable: false),
                    korisnikIDID = table.Column<int>(type: "int", nullable: true),
                    organizacijaIDID = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Clan organizacije", x => x.ID);
                    table.ForeignKey(
                        name: "FK_Clan organizacije_Korisnik_korisnikIDID",
                        column: x => x.korisnikIDID,
                        principalTable: "Korisnik",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Clan organizacije_Organizacija_organizacijaIDID",
                        column: x => x.organizacijaIDID,
                        principalTable: "Organizacija",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Projekat",
                columns: table => new
                {
                    ID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    naziv = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    opis = table.Column<string>(type: "nvarchar(300)", maxLength: 300, nullable: false),
                    status = table.Column<bool>(type: "bit", nullable: false),
                    timIDID = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Projekat", x => x.ID);
                    table.ForeignKey(
                        name: "FK_Projekat_Tim_timIDID",
                        column: x => x.timIDID,
                        principalTable: "Tim",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Clan tima",
                columns: table => new
                {
                    ID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    timIDID = table.Column<int>(type: "int", nullable: true),
                    vodjaTima = table.Column<bool>(type: "bit", nullable: false),
                    izbacen = table.Column<bool>(type: "bit", nullable: false),
                    clanOgranizacijeIDID = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Clan tima", x => x.ID);
                    table.ForeignKey(
                        name: "FK_Clan tima_Clan organizacije_clanOgranizacijeIDID",
                        column: x => x.clanOgranizacijeIDID,
                        principalTable: "Clan organizacije",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Clan tima_Tim_timIDID",
                        column: x => x.timIDID,
                        principalTable: "Tim",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Task",
                columns: table => new
                {
                    ID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    naziv = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    opis = table.Column<string>(type: "nvarchar(300)", maxLength: 300, nullable: false),
                    status = table.Column<bool>(type: "bit", nullable: false),
                    vrednost = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    tip = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    projekatID = table.Column<int>(type: "int", nullable: true),
                    clanTimaID = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Task", x => x.ID);
                    table.ForeignKey(
                        name: "FK_Task_Clan tima_clanTimaID",
                        column: x => x.clanTimaID,
                        principalTable: "Clan tima",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Task_Projekat_projekatID",
                        column: x => x.projekatID,
                        principalTable: "Projekat",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Clan organizacije_korisnikIDID",
                table: "Clan organizacije",
                column: "korisnikIDID");

            migrationBuilder.CreateIndex(
                name: "IX_Clan organizacije_organizacijaIDID",
                table: "Clan organizacije",
                column: "organizacijaIDID");

            migrationBuilder.CreateIndex(
                name: "IX_Clan tima_clanOgranizacijeIDID",
                table: "Clan tima",
                column: "clanOgranizacijeIDID");

            migrationBuilder.CreateIndex(
                name: "IX_Clan tima_timIDID",
                table: "Clan tima",
                column: "timIDID");

            migrationBuilder.CreateIndex(
                name: "IX_Projekat_timIDID",
                table: "Projekat",
                column: "timIDID");

            migrationBuilder.CreateIndex(
                name: "IX_Task_clanTimaID",
                table: "Task",
                column: "clanTimaID");

            migrationBuilder.CreateIndex(
                name: "IX_Task_projekatID",
                table: "Task",
                column: "projekatID");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Task");

            migrationBuilder.DropTable(
                name: "Clan tima");

            migrationBuilder.DropTable(
                name: "Projekat");

            migrationBuilder.DropTable(
                name: "Clan organizacije");

            migrationBuilder.DropTable(
                name: "Tim");

            migrationBuilder.DropTable(
                name: "Korisnik");

            migrationBuilder.DropTable(
                name: "Organizacija");
        }
    }
}
