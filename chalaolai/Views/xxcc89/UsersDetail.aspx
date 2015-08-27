<%@ Page Title="" Language="C#" MasterPageFile="~/Views/shared/AdminFrame.Master" Inherits="System.Web.Mvc.ViewPage<dynamic>" %>

<asp:Content ID="Content1" ContentPlaceHolderID="body" runat="server">
    <%
        var user = ViewBag.user as Models.User;
        var userRoles = user.GetRoles();
    %>
    <h4>用户名：<%=user.Tel %></h4>
    <hr />

    <form method="post">
        <div class="row">
            <%foreach (var role in AuthorityHelper.RoleList)
              {
                  var isCheck = userRoles.Find(x => role.ID == x.ID) == null ? false : true;
            %>
            <div class="col-lg-4">
                <input type="checkbox" name="role_<%=role.ID %>"  <%=isCheck?"checked=\"checked\"":"" %> /><label><%=role.Name %></label>
            </div>
            <%
              } %>
        </div>
        <button class="btn btn-primary">保存</button>
    </form>
</asp:Content>

<asp:Content ID="Content2" ContentPlaceHolderID="script" runat="server">
</asp:Content>
