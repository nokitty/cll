using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Models;
using DAL;
using System.Dynamic;

namespace chalaolai.Controllers
{
    public class CreditController : Controller
    {
        //
        // GET: /Query/

        ChaLaoLaiContext db;

        public CreditController()
        {
            db = new ChaLaoLaiContext();
        }

        protected override void Dispose(bool disposing)
        {
            db.Dispose();
            base.Dispose(disposing);
        }
        public ActionResult Index()
        {
            if (Session["isMobile"] != null)
                return View("Index.mobile");
            else
                return View("Index.pc");
        }

        public ActionResult Search(string name, string num)
        {
            if (string.IsNullOrWhiteSpace(name))
                return HttpNotFound();

            var persons = db.Persons.
                Where(p => (p.Name == name.Trim() && p.CardNum.StartsWith(num)));

            var list = new List<ExpandoObject>();
            foreach (var person in persons)
            {
                dynamic d = new ExpandoObject();
                //基本信息
                d.person = person;

                //法院公布次数
                var publicCount = db.PublicPersons.
                    Where(i => i.PersonID == person.PersonID).Count();

                //用户举报次数
                var reportCount = db.ReportedPersons
                    .Where(i => i.ReportedPersonID == person.PersonID).Count();

                //p2p不良记录
                var p2pCount = db.P2PPersons
                    .Where(i => i.PersonID == person.PersonID).Count();

                //举报总次数
                d.totalCount = publicCount + reportCount + p2pCount;

                list.Add(d);
            }

            ViewBag.result = list;
            ViewBag.name = name;
            if (Session["isMobile"] != null)
                return View("search.mobile");
            else
                return View("search.pc");
        }

        public ActionResult Person(int id)
        {
            var person = db.Persons.Find(id);
            if (person == null)
                return HttpNotFound();

            var ppList = db.PublicPersons.Where(i => i.PersonID == person.PersonID).ToList();
            var upList = db.ReportedPersons.Where(i => i.ReportedPersonID == person.PersonID).ToList();
            var p2pList = db.P2PPersons.Where(i => i.PersonID == person.PersonID).ToList();

            ViewBag.person = person;
            ViewBag.ppList = ppList;
            ViewBag.upList = upList;
            ViewBag.p2pList = p2pList;

            if (Session["isMobile"] != null)
                return View("person.mobile");
            else
                return View("person.pc");
        }

        public ActionResult Public(int id)
        {
            var p = db.PublicPersons.Find(id);
            if (p == null)
                return HttpNotFound();

            ViewBag.p = p;
            if (Session["isMobile"] != null)
                return View("public.mobile");
            else
                return View("public.pc");
        }

        public ActionResult Report(int id)
        {
            var p = db.ReportedPersons.Find(id);
            if (p == null)
                return HttpNotFound();

            ViewBag.p = p;
            if (Session["isMobile"] != null)
                return View("Report.mobile");
            else
                return View("Report.pc");
        }

        public ActionResult P2P(int id)
        {
            var p = db.P2PPersons.Find(id);
            if (p == null)
                return HttpNotFound();

            ViewBag.p = p;
            if (Session["isMobile"] != null)
                return View("P2P.mobile");
            else
                return View("P2P.pc");
        }
    }
}
