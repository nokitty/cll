using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using DAL;
using Models;

namespace authority.Controllers
{
    public class QnAController : Controller
    {

        ChaLaoLaiContext db;
        public QnAController()
        {
            db = new ChaLaoLaiContext();
        }

        protected override void Dispose(bool disposing)
        {
            db.Dispose();
            base.Dispose(disposing);
        }
        //
        // GET: /QnA/

        public ActionResult Index(int id)
        {
            var qna = db.QnAs.Find(id);
            ViewBag.qna = qna;
            return View("index.pc");
        }

        public ActionResult list()
        {
            var list = db.QnAs.OrderByDescending(i => i.CreatedTime).Take(5).ToList();
            ViewBag.list = list;
            return View("list.pc");
        }
    }
}
