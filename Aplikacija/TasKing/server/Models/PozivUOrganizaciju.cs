using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace Models
{
    [Table("Poziv u organizaciju")]
    public class PozivUOrganizaciju
    {
        [Key]
        public int ID { get; set; }

        [Required]
        public Korisnik pozvaniKorisnik { get; set; }

        [Required]
        public DateTime vremePoziva { get; set; }

        [Required]
        public bool prihvacen { get; set; }

        [Required]
        public Organizacija organizacija { get; set; }
    }
}