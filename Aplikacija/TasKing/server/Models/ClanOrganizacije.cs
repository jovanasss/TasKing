using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace Models
{
    [Table("Clan organizacije")]
    public class ClanOrganizacije
    {
        [Key]
        public int ID { get; set; }

        [Required]
        public bool administrator { get; set; }

        [Required]
        public bool izbacen { get; set; }
        
        public Korisnik korisnikID { get; set; }

        public Organizacija organizacijaID { get; set; }

        public List<ClanTima> clanoviTima { get; set; }
    }

}