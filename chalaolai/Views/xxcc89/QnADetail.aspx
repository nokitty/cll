<%@ Page Title="" Language="C#" MasterPageFile="~/Views/shared/AdminFrame.Master" Inherits="System.Web.Mvc.ViewPage<dynamic>" %>

<asp:Content ID="Content1" ContentPlaceHolderID="body" runat="server">
    <%var ann = ViewBag.qna as Models.QnA; %> 
    <form method="post">
        <div class="form-group">
            <label>问题:</label>
            <input name="question" style="width: 100%;" type="text" value="<%=ann==null?"":ann.Question %>" />
        </div>
        <div class="form-group">
            <label>答复:</label>
            <input name="answer" style="width: 100%; height: 250px;" type="text" value="<%=ann==null?"":ann.Answer %>" />
        </div>
        <button class="btn btn-primary">提交</button>
    </form>
</asp:Content>
