using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Web;
using System.Web.Mvc;
using DAL;
using Models;
using System.Security.Cryptography;
using System.Text;

namespace chalaolai.Controllers
{
    public class ReportController : Controller
    {
        ChaLaoLaiContext db;

        public ReportController()
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

        public ActionResult GetCaptchas(string tel, string picverify)
        {
            var v = (string)Session["picVerify"];
            if (v != picverify)
            {
                Session.Remove("picVerify");
                return Content("验证码错误");
            }
                        
            var rand = new Random();
            var captcha=rand.Next(1000000).ToString();
            Session["captcha"] = captcha;

            var text = string.Format("欢迎使用查老赖平台,您的手机验证码是：{0}，请在10分钟内填写【查老赖】", captcha);
            var url = string.Format("http://sh2.ipyy.com/sms.aspx?action=send&userid=&account=600011&password=20255218&mobile={0}&content={1}&sendTime=&extno=", tel, Server.UrlEncode(text));

            WebClient wc = new WebClient();
            var res = wc.DownloadString(url);
            return Content("ok");
        }

        public ActionResult GetPicCaptchas()
        {
            var codeMaker = new VerifyCode();
            codeMaker.SetPageNoCache(Response);
            Session["picVerify"] = codeMaker.Paint(Response.OutputStream);
            return null;
        }

        public ActionResult Detail(string captchas)
        {
            var old = (string)Session["captcha"];
            Session.Remove("captcha");
            if (old != captchas)
            {
                return Content("验证码错误");
            }

            if (Session["isMobile"] != null)
                return View("Detail.mobile");
            else
                return View("Detail.pc");
        }

        public ActionResult Result(string name,string cardnum,string province,string city,string tel,decimal arrears,int count,DateTime loandate,DateTime repaydate,string remark)
        {
            var rp = new ReportedPerson();
            var p = db.Persons.Where(i => i.Name == name && i.CardNum == cardnum).FirstOrDefault();
            if(p==null)
            {
                p = new Person();
                p.Name = name;
                p.CardNum = cardnum; 
                db.Persons.Add(p);
                db.SaveChanges();
            }

            var pics = "";
            for (int i = 0, n = Request.Files.Count; i < n; i++)
            {
                var file = Request.Files[i];

                var buffer = MD5.Create().ComputeHash(file.InputStream);
                var md5 = new StringBuilder();
                foreach (var b in buffer)
                {
                    md5.Append(b.ToString("x2"));
                }

                var ext = System.IO.Path.GetExtension(file.FileName);
                var filename = md5.ToString() + ext;

                pics += filename + "|";

                file.SaveAs(Server.MapPath("~/upload/" + md5.ToString() + ext));
            }

            rp.Arrears = arrears;
            rp.City = city;
            rp.Count = count;
            rp.LoanDate = loandate;
            rp.PersonID = p.PersonID;
            rp.Province = province;
            rp.Remark = remark;
            rp.RepayDate = repaydate;
            rp.ReportDate = DateTime.Now;
            rp.Tel = tel;
            rp.Pics = pics;

            db.ReportedPersons.Add(rp);
            db.SaveChanges();

            return Json(new { code = 0, msg = "信息提交成功，后台审核完成后将会公开展示" });
        }

        public ActionResult List()
        {
            return View("List.mobile");
        }
    }
}
