$(function(){

	setDocTitle("曝光详情");

	var name = $.cookie("exposureLawName");

	var reportPeronTelNum = $.cookie("reportPeronTelNum");

	$("#name").val(name);

	$("#reportPeronTelNum").val(reportPeronTelNum);

	var accessId = $.cookie("creditAccessId");

	if(accessId == '' || accessId == null || accessId == undefined){

		doVerifyAppKey();

	}

	//从其他页面，返回修改表单

	var statusFlag = $("#flagId").val();

	if( statusFlag == 'h5fy6wrxuv4drlhy'){

		loadOriginallyData();

	}else{

		wrapInitUploadImg("","");

	}

	//表单合法性验证

	validaExposureForm();

	//选择性别

	$(".ico-check").click(function(){

		var value = $(this).attr("data-sexy-value");

		$("#sexyId").find(".ico-check").removeClass("ico-check-checked");

		$(this).addClass("ico-check-checked");

		$("#sexyValue").attr("data-sexy-value",value);

		$("#sexyValue").val(value);

		$("#sexyValue").attr("data-valida-input","true");

		

	});

	//点击

	$(".cselect-title").click(function(){

		if(!$(this).closest(".city-select-wrap").find(".city-wrap").is(":visible")){

			$(this).closest(".city-select-wrap").find(".city-wrap").slideDown();

		}else{

			$(this).closest(".city-select-wrap").find(".city-wrap").slideUp();

		}

	});

	//获取省

	loadProvinceList();

/*	$(document).on("click","#provinceList li",function(){

		var index = $(this).attr("data-province-value");

		var value = $(this).text();

		$("#province").attr("data-province-num",index);

		$("#province").attr("data-province-value",value);

		$("#province .city-name").empty().text(value);

		$("#provinceValue").attr("data-valida-input","true");

		$("#provinceValue").val(value);

		$("#city .city-name").empty().text("请选择");

		//加载市

		loadCityList(index);

		$("#provinceList").hide();

	});

	//获取市

	$(document).on("click","#cityList li",function(){

			var index = $(this).attr("data-city-value");

			var value = $(this).text();

			$("#city").attr("data-city-num",index);

			$("#city").attr("data-city-value",value);

			$("#city .city-name").empty().text(value);

			$("#cityValue").attr("data-valida-input","true");

			$("#cityValue").val(value);

			$(this).parent().hide();

	});*/

});



//错误提示信息弹窗口

function alertFormErrorMsg(errorMsg){

	$("#formErrorMsgWrap").fadeIn();

	$("#formErrorMsgWrap .mask-tips").empty().text(errorMsg);

	$("#formErrorMsgWrap .mask-tips").animate({opacity : 1 , top: 20},600);

	setTimeout(function(){

		$("#formErrorMsgWrap .mask-tips").animate({opacity : 0 , top: 0},600);

		$("#formErrorMsgWrap").fadeOut();

	},2000);

}



//获取省

function loadProvinceList(){

	var provinceHtml = '';

	for(var i = 0 ; i < TalkArea.length-1; i++){

		var list = TalkArea[i];

		provinceHtml += '<li class="city-items" data-province-value='+i+'>'+list.name+'</li>';

	}

	provinceHtml += '<li class="city-items border-none" data-province-value='+(TalkArea.length-1)+'>'+TalkArea[TalkArea.length-1].name+'</li>';

	$("#provinceList").empty().append(provinceHtml);

};

//加载市

function loadCityList(index){

	var cityHtml = '';

	var list = TalkArea[index].cities;

	for(var i = 0 ; i < list.length-1; i++){

		cityHtml += '<li class="city-items" data-city-value='+i+'>'+list[i]+'</li>';

	}

	cityHtml += '<li class="city-items border-none" data-city-value='+(list.length-1)+'>'+list[list.length-1]+'</li>';

	$("#cityList").empty().append(cityHtml);

}



//表单实时验证（input失去焦点进行验证）

function validaExposureForm(){

	//验证表单不能为空

	$("input[data-valida-type=other]").each(function(){

		$(this).blur(function(){

			var value = $(this).val();

			if(value == ''){

				var errorMsg = $(this).attr("data-valida-msg");

				alertFormErrorMsg(errorMsg);

				$(this).attr("data-valida-input","false");

				//$(this).val('').focus();

			}else{

				$(this).attr("data-valida-input","true");

			}

		});

	});

	//验证表单不能为空

	$("input[data-valida-type=data]").each(function(){

		$(this).blur(function(){

			var $_this = $(this);

			setTimeout(function(){

				var value = $_this.val();

				if(value == ''){

					var errorMsg = $_this.attr("data-valida-msg");

					alertFormErrorMsg(errorMsg);

					$_this.attr("data-valida-input","false");

				}else{

					$_this.attr("data-valida-input","true");

				}

			},200);

		});

	});

	//验证身份证号码

	$("input[data-valida-type=idcard]").each(function(){

		$(this).blur(function(){

			var idcard = $(this).val();

			var reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;

			if(idcard == ''){

				var errorMsg = $(this).attr("data-valida-msg");

				alertFormErrorMsg("请输入身份证号码!");

				$(this).attr("data-valida-input","false");

			//	$(this).val('').focus();

			}else if(idcard !='' && !reg.test(idcard)){

				alertFormErrorMsg("身份证号码格式不正确！");

				$(this).attr("data-valida-input","false");

				$(this).focus();

			}else{

				$(this).attr("data-valida-input","true");

			}

		});

	});

	//验证手机号码

	$("input[data-valida-type=telNum]").each(function(){

		$(this).blur(function(){

			var tel = $(this).val();

			var reg = /^(13[0-9]|15[0-9]|18[0-9]|14[0-9])\d{8}$/;

			if(tel == ''){

				var errorMsg = $(this).attr("data-valida-msg");

				alertFormErrorMsg("请输入手机号码！");

				$(this).attr("data-valida-input","false");

			//	$(this).val('').focus();

			}else if(tel !='' && !reg.test(tel)){

				alertFormErrorMsg("手机号码格式不正确！");

				$(this).attr("data-valida-input","false");

				$(this).focus();

			}else{

				$(this).attr("data-valida-input","true");

			}

		});

	});

}

//提交时，再次确认表单是否都有填写

function validaSubExposureForm(obj){

	$(obj).find("input[data-valida-input]").each(function(){

        $(this).trigger("blur");

        var flag = $(this).attr("data-valida-input");

        if(flag == 'false'){

        	var errorMsg = $(this).attr("data-valida-msg");

        	alertFormErrorMsg(errorMsg);

        	$(this).focus();

    	    return false;

        }

	});

	var length = $(obj).find("input[data-valida-input=false]").length;

	return length;

}

//表单数据分装

/*function wrapExposureFormData(){

	var name = $("#name").val();

	var reportedPersonName = $("#reportedPersonName").val();

	var sex = $("#sexyValue").attr("data-sexy-value");

	var cardNum = $("#cardNum").val();

	var province = $("#province").attr("data-province-value");

	var city = $("#city").attr("data-city-value");

	var telNum = $("#telNum").val();

	var borrowNum = $("#borrowNum").val()+"元";

	var totalDebt = $("#totalDebt").val()+"笔";

	var starData = $("#totalDebt").val();

	var endData = $("#totalDebt").val();

	var note = $("#note").val();

	var proofPicList = "";

}*/

//提交信息

var subFlag = true;//点击只提交一次标志位

function subExposureForm(){
    $("#exposureFormId").submit();
}

//

function loadOriginallyData(){

	var accessId = $.cookie("creditAccessId");

	//var reportedPersonId = $.cookie("reportedPersonId");

//	var reportPersonId = $.cookie("reportPersonId");

	var reportPersonAccessId = $("#reportPersonIdAccessId").val();

	var reportedPersonAccessId= $("#reportedPersonIdAccessId").val();

	if(reportPersonAccessId == '' || reportPersonAccessId == null || reportPersonAccessId == "null" || reportPersonAccessId == undefined){

        var reportedPersonId = $.cookie("reportedPersonId");

	    var reportPersonId = $.cookie("reportPersonId");

	}else{

		var reportedPersonId = reportedPersonAccessId;

		var reportPersonId = reportPersonAccessId;

	}

	if(accessId == '' || accessId == null || accessId == undefined){

		alertErrorMsg(accessIdError);

	}else{

		$.ajax({

			type : "GET",

			async : true,

			timeout : 30000,

			dataType : "json",

			url : "getReportedPersonDetail.action",

			data : {

				accessId : accessId,

				reportedPersonId : reportedPersonId,

				reportPersonId : reportPersonId

			},

			success : function(data){

				if(data.ErrorCode == 0){

					wrapOriginallyData(data.data.reportedPerson);

				}else{

					alertErrorMsg(data.ErrorMsg);

				}

			},

			error : function(){

				hideLoading();

				alertErrorMsg("服务器异常！");

			},

			complete : function(XMLHttpRequest,status){

				if(status=='timeout'){

					alertErrorMsg("请求超时！");

				}

			}

		});

	}

};

//封装表单历史记录

function wrapOriginallyData(data){

	$("#name").val(data.reportPerson.name);

	$("#reportedPersonName").val(data.name);

	//$("#sex").empty().text(data.sex);

	$("#cardNum").val(data.cardNum);

	//$("#province").empty().text(data.province);

	$("#province .city-name").empty().text(data.province);

	$("#provinceValue").val(data.province);

	$("#provinceValue").attr("data-valida-input","true");

	//$("#city").empty().text(data.city);

	$("#city .city-name").empty().text(data.city);

	$("#cityValue").val(data.city);

	$("#cityValue").attr("data-valida-input","true");

	$("#telNum").val(data.telNum);

	$("#totalDebt").val(data.totalDebt);

	$("#borrowNum").val(data.borrowNum);

	$("#starData").val(data.borrowDate);

	$("#starData").attr("data-valida-input","true");

	$("#endData").val(data.borrowExpireDate);

	$("#endData").attr("data-valida-input","true");

	$("#note").val(data.note);

	$("#reportedPersonId").val(data.reportedPersonId);

	//$("#proofPicList").empty().text('');

	if(data.sex == '男'){

		$("#woman").removeClass("ico-check-checked");

		$("#man").addClass("ico-check-checked");

		$("#sexyValue").val('男');

		$("#sexyValue").attr("data-sexy-value","男");

		$("#sexyValue").attr("data-valida-input","true");

	}

	if(data.sex == '女'){

		$("#woman").addClass("ico-check-checked");

		$("#man").removeClass("ico-check-checked");

		$("#sexyValue").val('女');

		$("#sexyValue").attr("data-sexy-value","女");

		$("#sexyValue").attr("data-valida-input","true");

	}

	var html = '';

	var url = '';

	for(var i = 0; i<data.reportedProofList.length; i++){

		var list = data.reportedProofList[i];

		html += '<div class="upload_append_list my-dea-wrap"><div class="file_bar_wrap"><div class="file_bar file_hover">'+

		        '<div style="padding-left:5px;"><p class="file_name">'+list.proofUrl+'</p><span class="my_del" data-valida-num="'+i+'" title="删除"></span></div></div></div>'+

		        '<div class="uploadImg"><img id="uploadImage_0" class="upload_image" src="other/.info:80/lawMobile/blackProofImgs/'+list.proofUrl+'"></div><div class="file_success_wrap"><p id="uploadSuccess_0" class="file_success" style="display: block;"></p></div></div>';

//	var url = '<p class="upLoadUrlItems" data-file-index="0">20150605155446059.png</p>';' 

		url += '<p class="upLoadUrlItems" data-valida-num="'+i+'">'+list.proofUrl+'</p>';

		//	'<li class="pro-items"><img src="other/.info:80/lawMobile/blackProofImgs/'+list.proofUrl+'" /></li>';

	}

	//图片插件初始化

	wrapInitUploadImg(html,url);

}

function loadProofPicList(data){

	$("#proofPicList").empty().append(html);

}

//解决ios不能用on的兼容性

/*;(function(){

    var isTouch = ('ontouchstart' in document.documentElement) ? 'touchstart' : 'click', _on = $.fn.on;

        $.fn.on = function(){

            arguments[0] = (arguments[0] === 'click') ? isTouch: arguments[0];

            return _on.apply(this, arguments); 

        };

})();*/