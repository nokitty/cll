<%@ Page Title="" Language="C#" MasterPageFile="~/Views/shared/AdminFrame.Master" Inherits="System.Web.Mvc.ViewPage<dynamic>" %>

<asp:Content ID="Content1" ContentPlaceHolderID="body" runat="server">
 <%var ann = ViewBag.ReportedPerson as Models.ReportedPerson; 
   var p=new Models.Person(ann.PersonId);
   %> 
    <form method="post">
        <div class="form-group">
            <label>被举报人:</label>
            <div><%=p.Name %></div>
        </div>
        <div class="form-group">
            <label>欠款金额:</label>
            <div><%=ann.Arrears %></div>
        </div>
        <div class="form-group">
            <label>通过:</label>
            <input name="state" type="radio" value="<%=ReportedPersonCheckStates.Pass %>" />
            <label>不通过:</label>
            <input name="state" type="radio" value="<%=ReportedPersonCheckStates.NotPass %>" />
        </div>
        <button class="btn btn-primary">提交</button>
    </form>
</asp:Content>


