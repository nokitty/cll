using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using DAL;
using Models;

namespace authority.Controllers
{
    public class xxcc89Controller : Controller
    {
        ChaLaoLaiContext db;
        public xxcc89Controller()
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
            return View();
        }

        #region 举报管理
        public ActionResult Report()
        {
            ViewBag.Title2 = "举报管理";
            var list = db.ReportedPersons.ToList();
            ViewBag.list = list;
            return View();
        }

        //修改（只能修改审核状态，其他信息不能修改）
        [HttpGet]
        public ActionResult ReportEdit(int id)
        {
            ViewBag.Title2 = "审核管理-审核验证";
            var ann = db.ReportedPersons.Find(id);            
            ViewBag.reportedperson = ann;
            return View("Check");
        }
        
        [HttpPost]
        public ActionResult ReportEdit(int id, ReportedPersonCheckStates state)
        {
            var ann = db.ReportedPersons.Find(id);

            ann.CheckState = state;
            db.Entry(ann).State = System.Data.Entity.EntityState.Modified;
            return Redirect("~/xxcc89/Report");
        }

        //删除
        public ActionResult ReportDelete(int id)
        {
            var ann = db.ReportedPersons.Find(id);
            db.Entry(ann).State = System.Data.Entity.EntityState.Deleted;
            return Redirect("~/xxcc89/Report");
        }
        #endregion

        #region 公告管理
        public ActionResult Announcement()
        {
            ViewBag.Title2 = "公告管理";
            var list = db.Announcements.ToList();
            ViewBag.list = list;
            return View();
        }

        //添加
        [HttpGet]
        public ActionResult AnnouncementAdd()
        {
            ViewBag.AnnouncementAdd = true;
            ViewBag.Title2 = "公告管理-添加公告";

            return View("antwrite");
        }
        [HttpPost]
        public ActionResult AnnouncementAdd(string title, string content)
        {
            var a = new Announcement();
            a.Title = title;
            a.Content = content;
            a.CreatedTime = DateTime.Now;

            db.Announcements.Add(a);

            return Redirect("~/xxcc89/Announcement");
        }

        //修改
        [HttpGet]
        public ActionResult AnnouncementEdit(int id)
        {
            ViewBag.AnnouncementAdd = true;
            ViewBag.Title2 = "公告管理-修改公告";

            var ann = db.Announcements.Find(id);
            ViewBag.announcement = ann;
            return View("antwrite");
        }
        [HttpPost]
        public ActionResult AnnouncementEdit(int id, string title, string content)
        {
            var ann = db.Announcements.Find(id);
            ann.Title = title;
            ann.Content = content;
            db.Entry(ann).State = System.Data.Entity.EntityState.Modified;
            db.SaveChanges();
            return Redirect("~/xxcc89/Announcement");
        }

        //删除
        public ActionResult AnnouncementDelete(int id)
        {
            var ann = db.Announcements.Find(id);
            db.Entry(ann).State = System.Data.Entity.EntityState.Deleted;
            db.SaveChanges();
            return Redirect("~/xxcc89/Announcement");
        }

        #endregion

        #region 文章管理
        public ActionResult Article()
        {
            ViewBag.Title2 = "文章管理";
            var list = db.Articles.ToList();
            ViewBag.list = list;
            return View();
        }
        //添加
        [HttpGet]
        public ActionResult ArticleAdd()
        {
            ViewBag.Article = true;
            ViewBag.Title2 = "文章管理-添加文章";
            return View("ArticleDetail");
        }
        [HttpPost]
        public ActionResult ArticleAdd(string title, string content, string keywords)
        {
            var a = new Article();
            a.Title = title;
            a.Content = Server.UrlDecode(content);
            a.Keywords = keywords;
            db.Articles.Add(a);
            db.SaveChanges();
            return Redirect("~/xxcc89/Article");
        }

        //修改
        [HttpGet]
        public ActionResult ArticleEdit(int id)
        {
            ViewBag.Title2 = "文章管理-修改文章";
            ViewBag.Article = true;
            var ann = db.Articles.Find(id);
            ViewBag.article = ann;
            return View("ArticleDetail");
        }
        [HttpPost]
        public ActionResult ArticleEdit(int id, string title, string content, string keywords)
        {
            content = Server.UrlDecode(content);
            var ann = db.Articles.Find(id);
            ann.Title = title;
            ann.Content = content;
            ann.Keywords = keywords;
            db.Entry(ann).State = System.Data.Entity.EntityState.Modified;
            db.SaveChanges();
            return Redirect("~/xxcc89/Article");
        }

        //删除
        public ActionResult ArticleDelete(int id)
        {
            var ann = db.Articles.Find(id);
            db.Entry(ann).State = System.Data.Entity.EntityState.Deleted;
            db.SaveChanges();
            return Redirect("~/xxcc89/article");
        }
        #endregion

        #region 常见问题管理
        public ActionResult QnA()
        {
            ViewBag.Title2 = "常见问题管理";
            var list = db.QnAs.ToList();
            ViewBag.list = list;
            return View();
        }

        //添加
        [HttpGet]
        public ActionResult QnAAdd()
        {
            ViewBag.QnA = true;
            ViewBag.Title2 = "常见问题管理-添加问题";
            return View("qnadetail");
        }
        [HttpPost]
        public ActionResult QnAAdd(string question, string answer)
        {
            var q = new QnA();
            q.Question = question;
            q.Answer = answer;
            db.QnAs.Add(q);
            db.SaveChanges();

            return Redirect("~/xxcc89/QnA");
        }

        //修改
        [HttpGet]
        public ActionResult QnAEdit(int id)
        {
            ViewBag.QnAAdd = true;
            ViewBag.Title2 = "公告管理-修改公告";

            var ann = db.QnAs.Find(id);
            ViewBag.qna = ann;
            return View("qnadetail");
        }
        [HttpPost]
        public ActionResult QnAEdit(int id, string question, string answer)
        {
            var ann = db.QnAs.Find(id);
            ann.Question = question;
            ann.Answer = answer;
            db.Entry(ann).State = System.Data.Entity.EntityState.Modified;
            db.SaveChanges();
            return Redirect("~/xxcc89/QnA");
        }

        //删除
        public ActionResult QnADelete(int id)
        {
            var ann = db.QnAs.Find(id);
            db.Entry(ann).State = System.Data.Entity.EntityState.Deleted;
            db.SaveChanges();
            return Redirect("~/xxcc89/QnA");
        }
        #endregion
    }
}
