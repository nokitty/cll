using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Data.Entity;

namespace Model
{
    static public class DB
    {
        static DB()
        {
            DbConfiguration.SetConfiguration(new MySql.Data.Entity.MySqlEFConfiguration());
        }
        public static ChaoLaoLaiContext Create()
        {
            return new ChaoLaoLaiContext();
        }
    }
}
