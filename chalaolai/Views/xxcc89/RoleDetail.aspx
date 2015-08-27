<%@ Page Title="" Language="C#" MasterPageFile="~/Views/shared/AdminFrame.Master" Inherits="System.Web.Mvc.ViewPage<dynamic>" %>

<asp:Content ID="Content1" ContentPlaceHolderID="body" runat="server">
    <%var role = ViewBag.role as Models.Role; %>
    <form method="post">
        <div class="form-group">
            <label>角色名称:</label>
            <input name="name" type="text" value="<%=role==null?"":role.Name%>"  />
        </div>
        <div class="form-group">
            <label>角色描述:</label>
            <input name="description" type="text" value="<%=role==null?"":role.Description%>"  />
        </div>
        <div>
            <div>权限列表</div>
            <table class="table">
                <tr>
                    <th>权限名</th>
                    <th>权限描述</th>
                    <th></th>
                </tr>
                <%foreach (Models.Authority item in ViewBag.athorityList)
                  {
                %>
                <tr>
                    <td><%=item.Name %></td>
                    <td><%=item.Description %></td>

                    <%if (role == null)
                      { %>
                    <td>
                        <input type="checkbox" name="<%=item.Code %>" /></td>
                    <%}
                      else
                      {
                    %>
                    <td>
                        <input type="checkbox" name="<%=item.Code %>" <%=AuthorityHelper.Check(role,item.Code)?"checked=\"checked\"":""%> /></td>
                    <%
                      }%>
                </tr>
                <%
                  } %>
            </table>
            <%if (ViewBag.RoleCreate != null)
              { %>
            <button class="btn btn-primary">创建</button>
            <%} %>
            <%if (ViewBag.RoleEdit != null)
              { %>
            <button class="btn btn-primary">修改</button>
            <%} %>
        </div>
    </form>
</asp:Content>
