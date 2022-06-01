using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace Models
{
    [Table("Prijava Za Task")]
    public class PrijavaZaTask
    {
        [Key]
        public int ID { get; set; }

        [Required]
        public Task task { get; set; }

        [Required]
        public ClanTima clanTima { get; set; }

        public bool pregledan { get; set; }
    }

}