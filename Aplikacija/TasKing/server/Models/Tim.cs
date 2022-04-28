using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace Models
{
    [Table("Tim")]
    public class Tim
    {
        [Key]
        public int ID { get; set; }

        [Required]
        [MaxLength(50)]
        public string ime { get; set; }
        
        public bool aktivan{ get; set; }
        
        public DateTime datumOsnivanja { get; set; }

        [MaxLength(50)]
        public string slika { get; set; }

        public List<ClanTima> clanoviTima { get; set; }

        public List<Projekat> projekti { get; set; }

    }

}