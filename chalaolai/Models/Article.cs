using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.ComponentModel.DataAnnotations;

namespace Models
{
    public class Article
    {
        public int ArticleID { get; set; }
        [MaxLength(45)]
        public string Title { get; set; }
        [MaxLength(45)]
        public string Keywords { get; set; }
        public string Content { get; set; }
        public DateTime CreatedTime { get; set; }

    }
}