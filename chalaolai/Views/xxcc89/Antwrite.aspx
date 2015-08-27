<%@ Page Title="" Language="C#" MasterPageFile="~/Views/shared/AdminFrame.Master" Inherits="System.Web.Mvc.ViewPage<dynamic>" %>

<asp:Content ID="Content1" ContentPlaceHolderID="body" runat="server">
    <%var ann = ViewBag.announcement as Models.Announcement; %> 
    <form method="post">
        <div class="form-group">
            <label>公告标题:</label>
            <input name="title" style="width: 100%;" type="text" value="<%=ann==null?"":ann.Title %>" />
        </div>
        <div class="form-group">
            <label>公告内容:</label>
            <input name="content" style="width: 100%; height: 250px;" type="text" value="<%=ann==null?"":ann.Content %>" />
        </div>
        <button class="btn btn-primary">提交</button>
    </form>
</asp:Content>
