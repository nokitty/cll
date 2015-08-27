using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.ComponentModel.DataAnnotations;

namespace Model
{
    public class Person
    {
        public int PersonID { get; set; }
        [Required]
        [MaxLength(45)]
        public string Name { get; set; }

        [Required]
        [MaxLength(45)]
        public string CardNum { get; set; }

        [Required]
        [MaxLength(45)]
        public string Province { get; set; }

        [Required]
        [MaxLength(45)]
        public string City { get; set; }
    }
}
