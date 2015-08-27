using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using DAL;
using Models;

namespace authority.Controllers
{
    public class AnnouncementController : Controller
    {
        ChaLaoLaiContext db;
        public AnnouncementController()
        {
            db = new ChaLaoLaiContext();
        }

        protected override void Dispose(bool disposing)
        {
            db.Dispose();
            base.Dispose(disposing);
        }
        //
        // GET: /Announcement/

        public ActionResult Index(int id)
        {
            var announcement = db.Announcements.Find(id);
            ViewBag.announcement = announcement;
            return View("index.pc");
        }

        public ActionResult list()
        {
            var list = db.Announcements.OrderByDescending(i => i.CreatedTime).Take(5).ToList();
            ViewBag.list = list;
            return View("list.pc");
        }
    }
}
