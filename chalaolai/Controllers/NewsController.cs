using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using DAL;
using Models;

namespace authority.Controllers
{
    public class NewsController : Controller
    {
        //
        // GET: /News/
        ChaLaoLaiContext db;
        public NewsController()
        {
            db = new ChaLaoLaiContext();
        }

        protected override void Dispose(bool disposing)
        {
            db.Dispose();
            base.Dispose(disposing);
        }

        public ActionResult Index(int id)
        {
            var news = db.Articles.Find(id);
            ViewBag.news = news;
            return View("index.pc");
        }
        public ActionResult List()
        {
            var list = db.Articles.OrderByDescending(i => i.CreatedTime).Take(5).ToList();
            ViewBag.list = list;
            return View("list.pc");
        }
    }
}
