<%@ Page Language="C#" Inherits="System.Web.Mvc.ViewPage<dynamic>" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.idCard/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.idCard/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title>常见问题列表</title>
<link rel="stylesheet" type="text/css" href="/css/base.css" />

<link rel="stylesheet" type="text/css" href="/css/index.css" />

<link rel="stylesheet" type="text/css" href="/css/style.css" />

<link rel="stylesheet" type="text/css" href="/css/style1.css" />

<script type="text/javascript" src="/js/jquery.min.js"></script>

<script type="text/javascript" src="/js/jquery-1.10.2.min.js"></script>

<script type="text/javascript" src="/js/common.js"></script>

<script type="text/javascript" src="/js/jquery.cookie.js"></script>

<script type="text/javascript" src="/js/law.js"></script>

</head>

<body>

<div class="header_tittle">

    <div class="header_Nav">
    
        <img src="/images/logo2.png" />
        
        <ul>
        
            <li class="cur"><a href="/home/index">首页</a></li>
            
            <li><a>信用查询</a></li>
            
            <li><a>举报老赖</a></li>
            
            <li><a>悬赏查询</a></li>
            
            <li><a>关于我们</a></li>
            
        </ul>
        
        <div class="login">
            
                <a href="/login">登陆</a>/
                
                <a href="/signup">注册</a>
            
            </div>
    
    </div>

</div>
    
<!--header结束-->

<div class="content_con">

    <div class="news_listL">
    
        <div class="tit">查老赖常见问题</div>
    
        <div class="news_listL1">
        
            <h3><a href="#" title="新闻动态">新闻动态</a></h3>
            
            <ul class="proul">
            
                <li><a href="/news/list" title="行业资讯">行业资讯</a></li>
                
                <li><a href="/announcement/list"title="公司公告">公司公告</a></li>
                
                <li><a href="/qna/list" title="常见问题解答">常见问题解答</a></li>
                
            </ul>
            <div class="clear"></div>
            <h3><a href="#" title="最新黑名单">最新黑名单</a></h3>
            
            <ul class="proul">
            
                <li><a href="News.html" title="法院公布黑名单">法院公布黑名单</a></li>
                
                <li><a href="News.html"title="P2P网贷黑名单">P2P网贷黑名单</a></li>
                
                <li><a href="News.html" title="私人举报黑名单">私人举报黑名单</a></li>
                
            </ul>
            
        </div>
        
        <div class="clear"></div>
        
        <div class="news_listL2">
        
            <div class="tit">联系方式</div>
            
            <ul>
                <div class="phone">全国咨询热线：<br/><span>400-088-7296</span> </div>
                
                <p>手机：1839771283</p>
                
                <p>电话：0757-22287563</p>
                
                <p>联系人：王先生</p>
                
                <p>地址：佛山市顺德区大良镇创意产业园B座E区218</p>
            
            </ul>
        
        </div>
        
    </div>
    
    <div class="news_listM"><img src="/images/cp-middle.png" /></div>
    
     <div class="news_listR">
     
          <div class="news_listR1">
          
              <h4>查老赖常见问题<b>我的位置：<a href="/">首页</a>&gt;&gt;查老赖常见问题</b></h4>
              
              <div class="news_List_list">
                  <%foreach (Models.QnA item in ViewBag.qnalist)
                    {
                        %>
                    <dl>
                      <dt><a href="#" target="_blank" title=""><%=item.Question %></a><span>[<%=DateTime.Now.ToString("MM-dd")%>]</span></dt>
                      <dd><%=item.Answer %></dd>
                   </dl>
                        <%
                    } %>
                  <div class="clear"></div>
                  <div id="pagerMain" class="apage">
                      <span class="cust_txt">记录总数：85 | 页数：3</span>
                      <a href="javascript:void(0)" class="cur" >1</a>
                      <a href="#" >2</a>
                      <a href="#" >3</a>
                      <a class="oran_pg_np" href="#" >&nbsp;</a>
                      <a class="oran_pg_lp" href="#">&nbsp;</a>
                  </div>
              </div>
          </div>
          
</div>

</div>
<!--底部开始-->

<div class="footer-wrap">

  <div class="footer ">

         <ul class="footer-nav">

            <li class="footer-nav-items footer-nav-title">帮助中心</li>

            <li class="footer-nav-items"><a href="#">常见问题</a></li>

            <li class="footer-nav-items"><a href="#">删除信息</a></li>

         </ul>

         <ul class="footer-nav">

            <li class="footer-nav-items footer-nav-title">关于我们</li>

            <li class="footer-nav-items"><a href="#">提供的服务</a></li>

            <li class="footer-nav-items"><a href="">联系我们</a></li>

         </ul>
          <ul class="footer-nav">

            <li class="footer-nav-items footer-nav-title">黑名单列表</li>

            <li class="footer-nav-items"><a href="#">法院公布黑名单</a></li>

            <li class="footer-nav-items"><a href="">P2P网贷黑名单</a></li>
            
            <li class="footer-nav-items"><a href="">私人举报黑名单</a></li>

         </ul>

         <ul class="contact-nav">

            <li class="contact-nav-items contact-nav-title">联系方式</li>

            <li class="contact-nav-items">客服QQ群：<span>304539080</span></li>

            <li class="contact-nav-items" style="position:relative;">在线咨询QQ：<span>121979164</span>
            <a href="http://wpa.qq.com/msgrd?v=3&site=点击查询&menu=yes&uin=121979164" title="点击咨询">
            <span class="ico-qq" alt="在线QQ咨询" title="在线QQ咨询"></span></a>
            
            </li>

            <li class="contact-nav-items">客服热线：<span>400-088-7296</span></li>

            <li class="contact-nav-items">技术支持邮箱：<span>121979164@qq.com</span></li>

            <li class="contact-nav-items">商务合作邮箱：<span>390015600@qq.com</span></li>

         </ul>

         <div class="erweima"><img src="images/erweima.png" /></div>

     </div>
     
     <div class="clear"></div>
     
    <div class="copy-right-wap">
    
        <div class="cbody copy-right">
    
            <span style="padding-right:15px;">版权所有&copy;2012千久汇电子商务有限公司</span>
    
            <span>闽ICP备12018362号-3</span>
    
        </div>
    
    </div>
    
</div>

<!--回到顶部-->

<div class="gotoTOP"> <a href="#" onclick="gotoTop();return false;" class="totop"></a></div>


</body>
</html>