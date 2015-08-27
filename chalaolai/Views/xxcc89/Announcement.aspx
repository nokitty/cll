<%@ Page Title="" Language="C#" MasterPageFile="~/Views/shared/AdminFrame.Master" Inherits="System.Web.Mvc.ViewPage<dynamic>" %>

<asp:Content ID="Content1" ContentPlaceHolderID="body" runat="server">
    <div class="clearfix">
        <a href="/xxcc89/announcementadd" class="btn btn-primary pull-right"><span class="glyphicon glyphicon-plus"></span><span>新公告</span></a>
    </div>
    <table class="table">
        <tr>
            <th>标题</th>
            <th>内容</th>
            <th>操作</th>
        </tr>
        <%foreach (Models.Announcement item in ViewBag.list)
          {
        %>
        <tr>
            <td><%=item.Title %></td>
            <td><%=item.Content %></td>
            <td>
                <table>
                    <tr>
                        <td><a href="/xxcc89/announcementdelete?id=<%=item.AnnouncementID %>">删除</a></td>
                        <td><a href="/xxcc89/announcementedit?id=<%=item.AnnouncementID %>">修改</a></td>
                    </tr>
                </table>
            </td>
        </tr>
        <%
          } %>
    </table>
</asp:Content>
