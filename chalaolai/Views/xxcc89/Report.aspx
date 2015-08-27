<%@ Page Title="" Language="C#" MasterPageFile="~/Views/shared/AdminFrame.Master" Inherits="System.Web.Mvc.ViewPage<dynamic>" %>

<asp:Content ID="Content1" ContentPlaceHolderID="body" runat="server">
    <table class="table">
        <tr>
            <th>被举报人</th>
            <th>欠款金额</th>
            <th>审核状况</th>
            <th>操作</th>
        </tr>
        <%foreach (Models.ReportedPerson item in ViewBag.list)
          {
        %>
        <tr>
            <td><%=item.Person.Name%></td>
            <td><%=item.Arrears %></td>
            <td>
                <%switch (item.CheckState)
                  {
                      case Models.ReportedPersonCheckStates.NotCheck:
                          Response.Write("未审核");
                          break;
                      case Models.ReportedPersonCheckStates.NotPass:
                          Response.Write("审核不通过");
                          break;
                      case Models.ReportedPersonCheckStates.Pass:
                          Response.Write("审核通过");
                          break;
                      default:
                          break;
                  } %>
            </td>
            <td>
                <table>
                    <tr>
                        <td><a href="/Admin/reportdelete?id=<%=item.ReportedPersonID %>">删除</a></td>
                        <td><a href="/Admin/reportedit?id=<%=item.ReportedPersonID %>">修改</a></td>
                    </tr>
                </table>
            </td>
        </tr>
        <%
          } %>
    </table>

</asp:Content>


