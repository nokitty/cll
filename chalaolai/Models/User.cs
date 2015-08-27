using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Data.Entity;
using System.ComponentModel.DataAnnotations;

namespace Models
{
    public class User
    {
        public int UserID { get; set; }
        [MaxLength(13)]
        [Required]
        public string Tel { get; set; }

        [MaxLength(64)]
        [Required]
        public string Password { get; set; }

        [MaxLength(20)]
        [Required]
        public string Name { get; set; }
    }
}