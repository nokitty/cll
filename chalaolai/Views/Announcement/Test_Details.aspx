<%@ Page Title="" Language="C#" MasterPageFile="~/Views/Shared/PC_Frame.Master" Inherits="System.Web.Mvc.ViewPage<dynamic>" %>

<asp:Content ID="Content1" ContentPlaceHolderID="body" runat="server">

<div class="content_con">

    
      <div class="inst-title">当前位置：<a href="/">首页</a>/公告列表</div>
        
        <div class="News-details">
        <div class="News-detailsL">
            <div class="News-detailsL-tittle">
                <%var announcement = ViewBag.announcement as Models.Announcement; %>
                    <h1><%=announcement.Title %></h1>
                    <p><span><%=announcement.CreatedTime.ToShortDateString() %></span> <span>来源： 浙江在线－浙江日报 </span><span>浙江日报记者 黄宏 通讯员 王华卫</span><span>责任编辑：周舸</span><p>
            </div>
            <div class="News-detailsL-content">
                <%=announcement.Content %>
            </div>
           <div class="News-detailsL-fanye">
                <span>下一篇：<a href="#" title="1、重拳出击治“老赖” 274人涉嫌拒执罪被移送公安">1、重拳出击治“老赖” 274人涉嫌拒执罪被移送公安</a></span>上一篇：<a  href="#" title="2、重拳出击治“老赖” 274人涉嫌拒执罪被移送公安">2、 重拳出击治“老赖” 274人涉嫌拒执罪被移送公安</a>
            </div>
         
        </div>
        
<div class="News-detailsR">
            <h4>同类文章排行</h4>
            <p><b>1</b>重拳出击治“老赖” 274人涉嫌拒执罪被移送公安</p>
            <p><b>2</b>重拳出击治“老赖” 274人涉嫌拒执罪被移送公安</p>
            <p><b>3</b>重拳出击治“老赖” 274人涉嫌拒执罪被移送公安</p>
            <p><span>4</span>重拳出击治“老赖” 274人涉嫌拒执罪被移送公安</p>
            <p><span>5</span>重拳出击治“老赖” 274人涉嫌拒执罪被移送公安</p>
             <p><span>6</span>重拳出击治“老赖” 274人涉嫌拒执罪被移送公安</p>
            
            <h4>最新资讯文章</h4>
            <p><b>1</b>重拳出击治“老赖” 274人涉嫌拒执罪被移送公安</p>
            <p><b>2</b>重拳出击治“老赖” 274人涉嫌拒执罪被移送公安</p>
            <p><b>3</b>重拳出击治“老赖” 274人涉嫌拒执罪被移送公安</p>
            <p><span>4</span>重拳出击治“老赖” 274人涉嫌拒执罪被移送公安</p>
            <p><span>5</span>重拳出击治“老赖” 274人涉嫌拒执罪被移送公安</p>
            </div>   
            </div>     
</div>

</asp:Content>

<asp:Content ID="Content2" ContentPlaceHolderID="title" runat="server">
    测试的详情页2
</asp:Content>


<asp:Content ID="Content3" ContentPlaceHolderID="script" runat="server">
</asp:Content>
