using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace Models
{
    [Table("Korisnik")]
    public class Korisnik
    {
        [Key]
        public int ID { get; set; }

        [Required]
        [MaxLength(20)]
        public string korisnickoIme { get; set; }

        [Required]
        [MaxLength(20)]
        public string lozinka { get; set; }

        [Required]
        [MaxLength(20)]
        public string ime { get; set; }

        [Required]
        [MaxLength(30)]
        public string prezime { get; set; }

        [Required]
        [MaxLength(20)]
        [RegularExpression(@"\d+")]
        public string brTelefona { get; set; }

        public string profilnaSlika { get; set; }

        [Required]
        [MaxLength(50)]
        [RegularExpression(@"^[a-zA-Z0-9+_.-]+@[a-z]+[.]+[c]+[o]+[m]$")]
        public string email { get; set; }

        public List<ClanOrganizacije> clanoviOrganizacije { get; set; }

        public List<PozivUOrganizaciju> primljeniPoziviIzOrganizacije { get; set; }

        public List<PozivUTim> primljeniPoziviIzTima { get; set; }
    }
}