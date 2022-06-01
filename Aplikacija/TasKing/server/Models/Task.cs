using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace Models
{
    [Table("Task")]
    public class Task
    {
        [Key]
        public int ID { get; set; }

        [Required]
        [MaxLength(50)]
        public string naziv { get; set; }

        [Required]
        [MaxLength(300)]
        public string opis { get; set; }

        [Required]
        public int status { get; set; }

        [Required]
        public string vrednost { get; set; }

        public string tip { get; set; }

        public Projekat projekat { get; set; }

        public ClanTima clanTima { get; set; }

        public List<PrijavaZaTask> prijaveZaTask { get; set; }

    }

}