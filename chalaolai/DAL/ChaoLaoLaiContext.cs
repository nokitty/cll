using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Data.Entity;
using System.Data.Entity.ModelConfiguration.Conventions;
using Models;

namespace DAL
{
    [DbConfigurationType(typeof(MySql.Data.Entity.MySqlEFConfiguration))]
    public class ChaLaoLaiContext : DbContext
    {
        public ChaLaoLaiContext() : base("name=chalaolai") { }
        public DbSet<Person> Persons { get; set; }
        public DbSet<ReportedPerson> ReportedPersons { get; set; }
        public DbSet<PublicPerson> PublicPersons { get; set; }
        public DbSet<User> Users { get; set; }
        public DbSet<UserLoginCookie> UserLoginCookies { get; set; }
        public DbSet<P2PPerson> P2PPersons { get; set; }
        public DbSet<Announcement> Announcements { get; set; }
        public DbSet<Article> Articles { get; set; }
        public DbSet<QnA> QnAs { get; set; }

        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            modelBuilder.Conventions.Remove<PluralizingTableNameConvention>();
        }
    }
}
