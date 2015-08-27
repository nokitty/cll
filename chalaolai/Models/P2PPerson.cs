using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.ComponentModel.DataAnnotations;

namespace Models
{
    public class P2PPerson
    {
        public int P2PPersonID { get; set; }
        [Required]
        [MaxLength(45)]
        public string Tel { get; set; }

        [Required]
        [MaxLength(45)]
        public string LoanAccount { get; set; }

        [Required]
        [MaxLength(45)]
        public string ExpireAccount { get; set; }

        [Required]
        public DateTime LoanDate { get; set; }

        [Required]
        [MaxLength(45)]
        public string InstalmentCount { get; set; }

        [Required]
        [MaxLength(45)]
        public string RepayAccount { get; set; }

        [Required]
        public int PersonID { get; set; }

        [Required]
        [MaxLength(45)]
        public string Source { get; set; }
        public virtual Person Person { get; set; }
    }
}