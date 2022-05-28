using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace Models
{
    [Table("Clan tima")]
    public class ClanTima
    {
        [Key]
        public int ID { get; set; }

        public Tim tim { get; set; }
        
        [Required]
        public bool vodjaTima { get; set; }

        [Required]
        public bool izbacen { get; set; }

        public DateTime vremePosecivanja { get; set; }

        public List<Task> taskovi { get; set; }

        [JsonIgnore]
        public ClanOrganizacije clanOgranizacije { get; set; }
    }
}