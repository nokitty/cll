$(function () {
    validaHasName($("#name"));

    //查找条件

    $("#choiceConditionId").click(function () {

        if ($(this).hasClass("choice-condition-cur")) {

            $(this).removeClass("choice-condition-cur");

            $(this).find(".choice-text").empty().text("模糊条件");

            $("#idcardWrap").slideDown();

        } else {

            $(this).addClass("choice-condition-cur");

            $(this).find(".choice-text").empty().text("精确条件");

            $("#idcardWrap").slideUp();

        }

    });

    var flag = $("#flagId").val();

    if (flag == 'ttzchrf53ekqqbro') {

        var name = $.cookie("pLawName");

        $("#name").val(name);

    } else if (flag == 'h5fy6wrxuv4drlhy') {

        var name = $.cookie("wLawName");

        $("#name").val(name);

    } else {

        //  $("#name").focus();

    }

});

//查找

function toSearch() {

    var accessId = $.cookie("creditAccessId");

    var length = lawFormErrorLength($("#searchFormId"));

    if (length > 0) {

        return false;

    } else {

        var name = $("#name").val();
        var cardnum = $("#cardnum").val();
        location.href ='/credit/search?name='+encodeURIComponent(name)+'&cardnum='+encodeURIComponent(cardnum);

    }

}


/*	if($("#idcardWrap").is(":hidden")){//模糊条件

		var length = formErrorLength($("#nameWrap"));

		if(length > 0){

			return;

		}else{

			if(accessId == '' || accessId == null || accessId == undefined){

			     alertErrorMsg(accessIdError);	

			}else{

				var name = $("#name").val();

				$.cookie("wLawName",name,{path : '/'});

				var idcard = "";

				$.cookie("wLawIdcard",idcard,{path : '/'});

				location.href = basePath + "lawMobile/wholeLawList.jsp";

			}

		}

	}else{//精确条件

		var length = formErrorLength($("#searchFormId"));

		if(length > 0){

			return;

		}else{

			if(accessId == '' || accessId == null || accessId == undefined){

			     alertErrorMsg(accessIdError);	

			}else{

				var name = $("#name").val();

				$.cookie("pLawName",name,{path : '/'});

				var idcard = $("#idcard").val();

				$.cookie("pLawIdcard",idcard,{path : '/'});

				location.href = basePath + "lawMobile/lawList.jsp?f=ttzchrf53ekqqbro";

			}

		}

	}*/

//表单错误的长度

function lawFormErrorLength(obj) {

    $(obj).find("input[data-valida-input]").each(function () {

        $(this).trigger("blur");

        var flag = $(this).attr("data-valida-input");

        if (flag == 'false') {

            return false;

        }

    });

    var length = $(obj).find("input[data-valida-input=false]").length;

    return length;

}

//模糊查找姓名验证

function validaHasName(obj) {

    $(obj).blur(function () {

        var thisVal = $(obj).val();

        var flag = false;

        if (thisVal != '') {

            if (thisVal.length == 1) {

                flag = true;

            }

        }

        if (thisVal == '') {

            formTipsError($(obj), "请输入姓名！");

        } else if (flag) {

            formTipsError($(obj), "请输入正确的格式！");

        } else {

            formTipsCorrect($(obj));

        }

    });

};

//验证身份证号码（模糊查找、选填）

function validaIdcard(obj) {

    $(obj).blur(function () {

        var idcard = $(obj).val();

        var reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;

        if (idcard != '' && !reg.test(idcard)) {

            formTipsError($(obj), "身份证号码格式不正确！");

        } else {

            formTipsCorrect($(obj));

        }

    });

};

