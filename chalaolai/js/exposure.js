var getTelCodeFlag = false;

$(function () {

    setDocTitle("曝光老赖");

    validaHasVal($("#name"), "请输入曝光人姓名！");

    validaIdcard($("#idcard"));

    validaPhoneNum($("#tel"));

    validaHasVal($("#verify"), "请输入验证码！");


    //服务条款

    $("#checkBoxId").click(function () {

        if (!$(this).hasClass("check-box-checked")) {

            $(this).addClass("check-box-checked");

        } else {

            $(this).removeClass("check-box-checked");

        }

    });

    //短信验证码
    var cllcount = 60;
    var cllCanSend = true;
    var cllTimer;
    $("#getTelCodeId").click(function () { 
        if (cllCanSend == false)
            return;

        var tel = $("#tel").val();
        if (CheckTelNum(tel)==false)
            return;

        var t = $(this);
        $.get('/report/getcaptchas', { tel: tel, picverify: $("#picverify").val() }, function (data) {
            if (data == "ok") {
                cllTimer = setInterval(function () {
                    if (cllcount == 0) {
                        t.text("重新发送");
                        t.css({ "background-color": "#af072b", "color": "white" });
                        cllCanSend = true;
                        cllcount = 60;
                        clearInterval(cllTimer);
                    }
                    else {
                        cllcount--;
                        cllCanSend = false;
                        t.text("已发送(" + cllcount + "s)");
                        t.css({ "background-color": "#ddd", "color": "black" });
                    }
                }, 1000);
            }
            else {
                alert("验证码错误，请重新输入");
                $(".picCaptchaReflesh").click();
                return;
            }
        })
    });

});



//马上曝光

function toExposure() {

    var name = $("#name").val();

    var idcard = $("#idcard").val();

    var verifyCode = $("#verify").val();

    var tel = $("#tel").val();

    var length = formErrorLength($("#exposureId"));

    if (length > 0) {

        return;

    } else {

        if (!$("#checkBoxId").hasClass("check-box-checked")) {

            alertErrorMsg("请先同意服务条款！");

        } else {
            location.href = '/report/detail?name=' + encodeURIComponent($('#name').val()) + '&captchas=' + encodeURIComponent($('#verify').val());
        }

    }

    //身份验证接口

    function toValidaPersonID(accessId, name, idcard, verifyCode, tel) {

        $.ajax({

            type: "POST",

            async: true,

            timeout: 30000,

            dataType: "json",

            url: "vertifyIdentity.action",

            data: {

                accessId: accessId,

                name: name,

                cardNum: idcard,

                validateCode: verifyCode,

                telNo: tel

            },

            beforeSend: function () {

                showLoading();

            },

            success: function (data) {

                hideLoading();

                if (data.ErrorCode == 0) {

                    if (data.data.success == 1) {

                        var name = $("#exposureId #name").val();

                        var reportPeronTelNum = $("#exposureId #tel").val();

                        $.cookie("exposureLawName", name, { path: '/' })

                        $.cookie("reportPeronTelNum", reportPeronTelNum, { path: '/' });

                        $.cookie("reportPersonId", data.data.reportPerson.reportPersonId, { path: '/' });

                        location.href = basePath + "lawMobile/exposureForm.jsp";

                    } else {

                        alertErrorMsg("您输入的姓名或者身份证有误！");

                        $("#validaPersonID").attr("data-valida-personID", "false");

                        $("#personNameId").val(name);

                        $("#personIdcardId").val(idcard);

                    }

                } else if (data.ErrorCode == 1054) {//验证码错误

                    alertErrorMsg(data.ErrorMsg);

                    $("#verify").val('').focus();

                } else {

                    alertErrorMsg(data.ErrorMsg);

                }

            },

            error: function () {

                hideLoading();

                alertErrorMsg("服务器异常！");

            },

            complete: function (XMLHttpRequest, status) {

                if (status == 'timeout') {
                    alertErrorMsg("请求超时！");
                }

            }

        });

    }

}