<%@ Page Title="" Language="C#" MasterPageFile="~/Views/shared/AdminFrame.Master" Inherits="System.Web.Mvc.ViewPage<dynamic>" %>

<asp:Content ID="Content1" ContentPlaceHolderID="body" runat="server">
<div class="clearfix">
        <a href="/xxcc89/articleadd" class="btn btn-primary pull-right"><span class="glyphicon glyphicon-plus"></span><span>新文章</span></a>
    </div>
    <table class="table">
        <tr>
            <th>标　题</th>
            <th>内　容</th>
            <th>关键字</th>
            <th>操作</th>
        </tr>
        <%foreach (Models.Article item in ViewBag.list)
          {
        %>
        <tr>
            <td><%=item.Title %></td>
            <td><%=item.Content %></td>
            <td><%=item.Keywords %></td>
            <td>
                <table>
                    <tr>
                        <td><a href="/xxcc89/articledelete?id=<%=item.ArticleID %>">删除</a></td>
                        <td><a href="/xxcc89/articleedit?id=<%=item.ArticleID %>">修改</a></td>
                    </tr>
                </table>
            </td>
        </tr>
        <%
          } %>
    </table>
</asp:Content>
