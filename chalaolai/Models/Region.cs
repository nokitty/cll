using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;

namespace Models
{
    public class Region
    {
        public int RegionID { get; set; }

        [Column(TypeName="char")]
        [MaxLength(2)]
        public string Province { get; set; }

        [Column(TypeName = "char")]
        [MaxLength(2)]
        public string City { get; set; }

        [Column(TypeName = "char")]
        [MaxLength(2)]
        public string Area { get; set; }

        [MaxLength(45)]
        public string Name { get; set; }
    }
}
