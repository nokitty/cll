using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Data.Entity;
using System.ComponentModel.DataAnnotations;

namespace Models
{
    public class UserLoginCookie
    {
        public int UserLoginCookieID { get; set; }

        [Required]
        public int UserID { get; set; }

        [Required]
        [MaxLength(45)]
        public string Value { get; set; }

        [Required]
        public DateTime Expire { get; set; }
    }
}