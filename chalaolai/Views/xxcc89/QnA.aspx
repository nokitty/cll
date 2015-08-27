<%@ Page Title="" Language="C#" MasterPageFile="~/Views/shared/AdminFrame.Master" Inherits="System.Web.Mvc.ViewPage<dynamic>" %>

<asp:Content ID="Content1" ContentPlaceHolderID="body" runat="server">
    <div class="clearfix">
        <a href="/xxcc89/qnaadd" class="btn btn-primary pull-right"><span class="glyphicon glyphicon-plus"></span><span>新问题</span></a>
    </div>
     <table class="table">
        <tr>
            <th>问题</th>
            <th>答复</th>
            <th>操作</th>
        </tr>
        <%foreach (Models.QnA item in ViewBag.list)
          {
        %>
        <tr>
            <td><%=item.Question %></td>
            <td><%=item.Answer %></td>
            <td>
                <table>
                    <tr>
                        <td><a href="/xxcc89/qnadelete?id=<%=item.QnAID %>">删除</a></td>
                        <td><a href="/xxcc89/qnaedit?id=<%=item.QnAID %>">修改</a></td>
                    </tr>
                </table>
            </td>
        </tr>
        <%
          } %>
    </table>


</asp:Content>
