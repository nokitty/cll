using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;

namespace Models
{
    public class PublicPerson
    {
        public int PublicPersonID { get; set; }
        [MaxLength(45)]
        public string CaseCode { get; set; }
        [MaxLength(45)]
        public string CourtName { get; set; }
        [MaxLength(45)]
        public string AreaName { get; set; }
        [MaxLength(45)]
        public string GistID { get; set; }
        public DateTime RegDate { get; set; }
        [MaxLength(45)]
        public string GistUnit { get; set; }
        public string Duty { get; set; }
        public string Performance { get; set; }
        [MaxLength(45)]
        public string DisruptTypeName { get; set; }
        public DateTime PublishDate { get; set; }
        public int PersonID { get; set; }
        virtual public Person Person { get; set; }
    }
}
