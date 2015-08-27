using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace chalaolai.Controllers
{
    public class AboutController : Controller
    {
        //
        // GET: /About/

        public ActionResult Index()
        {
            if (Session["isMobile"] != null)
                return View("Index.mobile");
            else
                return View("Index.pc");
        }

    }
}
