using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace Models
{
    [Table("Projekat")]
    public class Projekat
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
        public bool status { get; set; }

        [Required]
        public Tim timID { get; set; }

        public List<Task> taskovi { get; set; }
    }

}