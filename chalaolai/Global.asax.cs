using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Web;
using System.Web.Http;
using System.Web.Mvc;
using System.Web.Routing;

namespace chalaolai
{
    // 注意: 有关启用 IIS6 或 IIS7 经典模式的说明，
    // 请访问 http://go.microsoft.com/?LinkId=9394801
    public class MvcApplication : System.Web.HttpApplication
    {
        protected void Application_Start()
        {
            AreaRegistration.RegisterAllAreas();

            WebApiConfig.Register(GlobalConfiguration.Configuration);
            FilterConfig.RegisterGlobalFilters(GlobalFilters.Filters);
            RouteConfig.RegisterRoutes(RouteTable.Routes);

            DbConfiguration.SetConfiguration(new MySql.Data.Entity.MySqlEFConfiguration());

        }

        protected void Session_Start()
        {
            //通过cookie检查是否已经登录
            var cookie = Request.Cookies["login"];
            if (cookie != null)
            {
                var val = cookie.Value;
                using (var db = new DAL.ChaLaoLaiContext())
                {
                    var record = db.UserLoginCookies.Where(r => r.Value == val).FirstOrDefault();
                    if (record != null)
                    {
                        Session["userid"] = record.UserID;
                    }
                }
            }

            //检查是移动端浏览还是pc浏览
            var userAgent = Request.UserAgent.ToLower();
            var mobileAgents = new string[] { "iphone", "android", "mobile" };
            foreach (var item in mobileAgents)
            {
                if (userAgent.Contains(item))
                {
                    Session["isMobile"] = true;
                    break;
                }
            }
        }
    }
}