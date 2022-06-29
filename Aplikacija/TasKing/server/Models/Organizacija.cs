using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace Models
{
    [Table("Organizacija")]
    public class Organizacija
    {
        [Key]
        public int ID { get; set; }

        [MaxLength(6)]
        public string kod { get; set; }

        [Required]
        [MaxLength(50)]
        public string ime { get; set; }

        public DateTime datumOsnivanja { get; set; }

        public string slika { get; set; }

        [Required]
        public bool aktivna { get; set; }

        public List<Tim> timovi { get; set; }

        public List<ClanOrganizacije> clanoviOrganizacije { get; set; }

        public List<PozivUOrganizaciju> poziviUOrganizaciju { get; set; }
    }
}