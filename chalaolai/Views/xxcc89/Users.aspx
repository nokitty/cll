<%@ Page Title="" Language="C#" MasterPageFile="~/Views/shared/AdminFrame.Master" Inherits="System.Web.Mvc.ViewPage<dynamic>" %>

<asp:Content ID="Content1" ContentPlaceHolderID="body" runat="server">
    <table class="table">
        <tr>
            <th>手机号码</th>
            <th>所属角色</th>
            <th>操作</th>
        </tr>
        <%foreach (Models.User item in ViewBag.userList)
          {
        %>
        <tr>
            <td><%=item.Tel %></td>
            <td>
                <%
              var roles = item.GetRoles();
              if (roles.Count == 0)
              { 
                %>
              无
              <%
              }
              else
              {
                  var str = "";
                  foreach (var role in roles)
                  {
                      str += role.Name + " ";
                  }
              %>
                <%=str %>
                <%
              }
                %>
            </td>
            <td>
                <table>
                    <tr>
                        <td><a href="/xxcc89/usersedit?id=<%=item.ID %>">修改所属角色</a></td>
                    </tr>
                </table>
            </td>
        </tr>
        <%
          } %>
    </table>
</asp:Content>

<asp:Content ID="Content2" ContentPlaceHolderID="script" runat="server">
</asp:Content>
