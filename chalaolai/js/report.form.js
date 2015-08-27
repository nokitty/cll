/// <reference path="tools.ts" />
$(function () {
    var provincelist = $("#provincelist");
    for (var i = 0, n = Tools.provinceList.length; i < n; i++) {
        var province = Tools.provinceList[i];
        var item = $('<li class="provinceitem" data-id="' + i + '" data-name="' + province.name + '"><a href="javascript:;">' + province.name + '</a></li>');
        provincelist.append(item);
    }
    $(document).on('click', '.provinceitem', function () {
        var t = $(this);
        var name = t.attr("data-name");
        var id = parseInt(t.attr("data-id"));
        $("#provincebotton").text(name);
        $("#province").val(name);
        var citylist = $("#citylist");
        citylist.empty();
        $("#citybotton").text("请选择城市");
        $("#city").val("");
        if (Tools.provinceList[id].cityList[0].name == name) {
            for (var i = 1, n = Tools.provinceList[id].cityList.length; i < n; i++) {
                var areas = Tools.provinceList[id].cityList[i].areaList;
                for (var j = 0, m = areas.length; j < m; j++) {
                    var area = areas[j];
                    var item = $('<li class="cityitem" data-name="' + area + '"><a href="javascript:;">' + area + '</a></li>');
                    citylist.append(item);
                }
            }
        }
        else {
            for (var i = 0, n = Tools.provinceList[id].cityList.length; i < n; i++) {
                var city = Tools.provinceList[id].cityList[i];
                var item = $('<li class="cityitem" data-name="' + city.name + '"><a href="javascript:;">' + city.name + '</a></li>');
                citylist.append(item);
            }
        }
    });
    $(document).on('click', '.cityitem', function () {
        var t = $(this);
        var name = t.attr("data-name");
        $("#citybotton").text(name);
        $("#city").val(name);
    });
    $("#submit").click(function () {
        $(".check-valid").each(function (i, elem) {
            var t = $(elem);
            var checkType = t.attr("data-check-type");
            CheckValid[checkType](t);
        });
        var errorList = $(".has-error");
        if (errorList.length > 0) {
            var pos = errorList.eq(0).offset();
            $(window).scrollTop(pos.top - 20);
        }
        else {
            $.post('/report/result', $("#form").serialize())
                .done(function (msg) {
                if (msg.code != 0) {
                    alert(msg.msg);
                    location.href = '/';
                    return;
                }
            })
                .fail(function () {
                alert("请求失败");
            });
        }
    });
});
