<%@ Page Title="" Language="C#" MasterPageFile="~/Views/shared/AdminFrame.Master" Inherits="System.Web.Mvc.ViewPage<dynamic>" %>

<asp:Content ID="Content1" ContentPlaceHolderID="body" runat="server">
    <%var ann = ViewBag.article as Models.Article; %>
    <form method="post" id="form">
        <div class="form-group">
            <label>文章标题:</label>
            <input name="title" style="width: 100%;" type="text" value="<%=ann==null?"":ann.Title %>" />
        </div>
        <div class="form-group">
            <label>文章内容:</label>
            <input id="content" name="content"  type="hidden"/>
            <script id="editor" type="text/plain" style="width: 100%; height: 500px;">
                <%=ann==null?"":ann.Content %>
            </script>
        </div>
        <div class="form-group">
            <label>关键字:</label>
            <input name="keywords" style="width: 30%;" type="text" value="<%=ann==null?"":ann.Keywords %>" />
        </div>
        <button class="btn btn-primary">提交</button>
    </form>
</asp:Content>

<asp:Content runat="server" ContentPlaceHolderID="script">
    <script type="text/javascript" charset="utf-8" src="/ueditor/ueditor.config.js"></script>
    <script type="text/javascript" charset="utf-8" src="/ueditor/ueditor.all.min.js"> </script>
    <script type="text/javascript" charset="utf-8" src="/ueditor/lang/zh-cn/zh-cn.js"></script>
        <script>
            $(function () {
                var ue = UE.getEditor('editor');

                $("#form").submit(function () {
                    $("#content").val(encodeURIComponent( UE.getEditor('editor').getContent()));
                    return true;
                });
            })
    </script>
</asp:Content>
