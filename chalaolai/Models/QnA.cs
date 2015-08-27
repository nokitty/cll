using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Models
{
    public class QnA
    {
        public int QnAID { get; set; }
        public string Question { get; set; }
        public string Answer { get; set; }
        public DateTime CreatedTime { get; set; }
    }
}