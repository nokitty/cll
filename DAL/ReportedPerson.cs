using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;

namespace Model
{
   public class ReportedPerson
    {
        public int ReportedPersonID { get; set; }
       [MaxLength(20)]
        public string Province { get; set; }
       [MaxLength(20)]
        public string City { get; set; }
       [MaxLength(20)]
        public string Tel { get; set; }
        public decimal Arrears { get; set; }
        public int Count { get; set; }
        public DateTime LoanDate { get; set; }
        public DateTime RepayDate { get; set; }
        public string Remark { get; set; }
        public string Pics { get; set; }
        public DateTime ReportDate { get; set; }
    }
}
