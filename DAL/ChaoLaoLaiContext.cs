using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Data.Entity;
using System.Data.Entity.ModelConfiguration.Conventions;

namespace Model
{
    public class ChaoLaoLaiContext:DbContext
    {
        public ChaoLaoLaiContext() : base("database=chalaolai;server=localhost;uid=root; pwd=123456") { }        
        public DbSet<Person> Persons { get; set; }
        public DbSet<ReportedPerson> ReportedPersons { get; set; }
        public DbSet<PublicPerson> PublicPersons { get; set; }

        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            modelBuilder.Conventions.Remove<PluralizingTableNameConvention>();
        }
    }
}
