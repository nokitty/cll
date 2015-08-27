using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;

namespace Models
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
        public int PersonID { get; set; }
        virtual public Person Person { get; set; }        
        public ReportedPersonCheckStates CheckState { get; set; }

        public ReportedPerson()
        {
            CheckState = ReportedPersonCheckStates.NotCheck;
        }
    }

    public enum ReportedPersonCheckStates : byte
    {
        NotCheck=1,
        Pass=2,
        NotPass=3
    }
}
