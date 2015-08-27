using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Models;
using DAL;

namespace chalaolai.Controllers
{
    public class HomeController : Controller
    {
        //
        // GET: /Home/
        private ChaLaoLaiContext db;

        public HomeController()
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
                return View("~/views/credit/Index.mobile.cshtml");
            else
            {
                var articles = db.Articles.OrderByDescending(i => i.CreatedTime).Take(10).ToList();
                var qnas = db.QnAs.OrderByDescending(i => i.CreatedTime).Take(10).ToList();
                var announcements = db.Announcements.OrderByDescending(i => i.CreatedTime).Take(10).ToList();

                ViewBag.articles = articles;
                ViewBag.qnas = qnas;
                ViewBag.announcements = announcements;
                return View("Index.pc");
            }
        }

    }
}
