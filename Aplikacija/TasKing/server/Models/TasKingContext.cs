using Microsoft.EntityFrameworkCore;

namespace Models
{
    public class TasKingContext : DbContext

    {
        public DbSet<ClanOrganizacije> ClanoviOrganizacije {get;set;}

        public DbSet<ClanTima> ClanoviTima {get;set;}

        public DbSet<Korisnik> Korisnici {get;set;}

        public DbSet<Organizacija> Organizacije {get ;set;}

        public DbSet<Projekat> Projekti {get; set;}

        public DbSet<Task> Taskovi {get; set;}

        public DbSet<Tim> Timovi {get; set;}

        public TasKingContext(DbContextOptions options) :base(options)
        {
        }
    }
}