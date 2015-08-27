<%@ Page Title="" Language="C#" MasterPageFile="~/Views/Shared/PC_Frame.Master" Inherits="System.Web.Mvc.ViewPage<dynamic>" %>

<asp:Content ID="Content1" ContentPlaceHolderID="body" runat="server">

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

</asp:Content>

<asp:Content ID="Content2" ContentPlaceHolderID="title" runat="server">
    qna测试
</asp:Content>

<asp:Content ID="Content3" ContentPlaceHolderID="script" runat="server">
</asp:Content>
