// JavaScript Document



var accessId = null;

var appKey = null;

var imageSrc = null;

var accessIdError = "访问受限，请重启浏览器！";

//错误码

var talkErrorCode = {

	errorCode : 0, //操作成功

	verifyCodeError : 6 , //验证码错误

	parameterError : 2 , //参数错误

	accountEmpty : 20 , //账号不允许为空

	serveError : 7 , //服务器异常

	passwordEmpty : 21 , //密码不允许为空

	verifyPwdError : 22 , //两次输入密码不一致

	registerCodeError : 23 , //注册码不一致

	safetyCodeError : 24 , //安全码错误

	hasNotLogin : 1004 , //未登录

	phoneCodeError : 1017, //手机动态码错误

	passwordError : 1002 ,//密码错误

	idcardNoRegister : 1009 ,//身份证号码未注册

	nameNotMachIdcard : 1015 , // 身份证和姓名不匹配

	accountHasExist : 1003 ,//用户已存在

	userNameError : 1001, //用户名错误

	idcardCodeError : 1026  ,//身份验证码错误

	idcardNotMachID : 1028 ,//身份证不匹配

	loginCreditServeFail : 1021 //征信中心登录失败

};



//错误提示信息弹窗口

function alertErrorMsg(errorMsg,url){

	$("#errorMsgWrap").fadeIn();

	$("#errorMsg").text(errorMsg);

	$("#errorMsg").animate({opacity : 1 , top: 20},600);

	setTimeout(function(){

		$("#errorMsg").animate({opacity : 0 , top: 0},600);

		$("#errorMsgWrap").fadeOut();

		if(url =='' || url ==null || url ==undefined){

			return;

		}else{

			location.href = basePath +url;

		}

	},2000);

}

//身份证号码保留后4位，其他都用星号代替

function toStarIdcard(obj,idCard){

	if(idCard == '' || idCard == null || idCard == undefined){

		$(obj).empty().text('');

	}else{

		var i = idCard.length;

		var num = idCard.substr(i-4);

		var newId ='';

		for(var j=0; j<i-4;j++){

			newId += '*';

		}

		newId +=num;

		$(obj).empty().text(newId);

	}

}

//手机号码显示前面3位后面2位，其他都用星号代替

function toStarPhoneNum(obj,PhoneNum){

	if(PhoneNum == '' || PhoneNum == null || PhoneNum == undefined){

		$(obj).empty().text('');

	}else{

		var i = PhoneNum.length;

		var starNum = PhoneNum.substr(0,3);

		var endNum = PhoneNum.substr(i-2);

		var star ='';

		for(var j=0; j<6;j++){

			star += '*';

		}

		var newNum = starNum + star + endNum;

		$(obj).empty().text(newNum);

	}

}

//只显示姓，其他都用星号代替

function toStarName(obj,name){

	if(name == '' || name == null || name == undefined){

		$(obj).empty().text('');

	}else{

		var i = name.length;

		var firstName = name.substr(0,1);

		var star ='';

		for(var j=0; j<i-1;j++){

			star += '*';

		}

		var newName = firstName + star;

		$(obj).empty().text(newName);

	}

}

//设置文档标题

function setDocTitle(docTitle){

	document.title = docTitle;

	$("#headerTitle").empty().text(docTitle);

}

//表单错误提示

function formTipsError(obj,errorMsg){

	$("#tipsFormError").find(".tips-error-msg").text(errorMsg);

	$("#tipsFormError").show();

	$(obj).attr("data-valida-input","false");

}

// 隐藏表单正确函数

function formTipsCorrect(obj){

	$(obj).closest(".cbody").find("#tipsFormError").hide();

	$(obj).attr("data-valida-input","true");

}

//验证身份证号码合法性

function validaIdcard(obj){

	$(obj).blur(function(){

		var idcard = $(obj).val();

		//var reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;

		var reg = /^(^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$)|(^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}[Xx])$)$/;

		if(idcard == ''){

			formTipsError($(obj),"请输入身份证号码！");

	       // $(obj).focus();

		}else if(checkIdcard(idcard)==false){

			formTipsError($(obj),"请输入有效的身份证号码！");

	       // $(obj).focus();

		}else{

			formTipsCorrect($(obj));

		}

	});

}

//验证密码

function validaPassword(obj){

	$(obj).blur(function(){

		var password = $(obj).val();

		if(password == ''){

			formTipsError($(obj),"请输入密码！");

	      //  $(obj).focus();

		}else if(password !='' && (password.length <6 || password.length >16)){

			formTipsError($(obj),"请输入6~16位的密码！");

	     //   $(obj).focus();

		}else{

			formTipsCorrect($(obj));

		}

	});

};

//验证二次密码

function validaTwoPassword(obj1,obj2){

	$(obj2).blur(function(){

		var onePwd = $(obj1).val();

		var twoPwd = $(obj2).val();

		if(twoPwd == ''){

			formTipsError($(obj2),"请再次输入密码！");

		}else if(twoPwd != onePwd){

			formTipsError($(obj2),"密码不一致，请重新输入！");

		}else{

			formTipsCorrect($(obj2));

		}

	});

};

//验证手机号码

function validaPhoneNum(obj){

	$(obj).blur(function(){

	    var reg = /^(13[0-9]|15[0-9]|18[0-9]|14[0-9]|17[0-9])\d{8}$/;

		var num = $(obj).val();

		if(num == ''){

			formTipsError($(obj),"请输入手机号码！");

	      //  $(obj).focus();

		}else if(num != '' && !reg.test(num)){

			formTipsError($(obj),"请输入有效的手机号码！");

	     //   $(obj).focus();

		}else{

			formTipsCorrect($(obj));

		}

	});

};

//检查手机号码
function CheckTelNum(num)
{
    var reg = /^(13[0-9]|15[0-9]|18[0-9]|14[0-9]|17[0-9])\d{8}$/;
    return reg.test(num);
}

//验证值不为空(姓名、注册码)

function validaHasVal(obj,tips){

	$(obj).blur(function(){

		var thisVal = $(obj).val();

		if(thisVal == ''){

			formTipsError($(obj),tips);

		}else{

			formTipsCorrect($(obj));

		}

	});

};

//获取验证码倒计时

function btnCountDown(obj,className,btnTex){

	var timer = null;

	var i = 59;

    $(obj).addClass(className);

    $(obj).text("60s");

	timer = setInterval(function(){

		$(obj).text(i+'s');

		i--;

		if(i==-1){

			$(obj).text(btnTex);

			$(obj).removeClass(className);

			clearInterval(timer);

		}

	},1000);

}

//更换验证码

function loadVerifyCode(obj,url){

//	var dateStr = new Date().toLocaleString();

	 $(obj).closest("#verifyCodeWrap").find("#verifyCodeImg").attr("src",url);

}

//返回征信中心验证码图片的imageRUL

function returnVerifyCodeImgUrl(imgURL){//我修改的

	var accessId = $.cookie("creditAccessId");

	var appKey = $.cookie("creditAppKey");

	if(accessId == '' || accessId == null || accessId == undefined){

		return;

	}else{

		$.ajax({

			type : "GET",

			async : false,

			url : imgURL,

			dataType : "json",

			data : {

				accessId : accessId,

				appKey : appKey//,

				//idcard : idcard//我修改的

			},

			success: function(data){

				if(data.ErrorCode == 0){

					imageSrc = data.data.imageSrc;

				}

			}

		});

	}

}

//获取设备（浏览器）ID

function getDeviceId(){

	var name = navigator.appName;

	var version = parseFloat(navigator.appVersion);

	return name + "-" +version;

	//return name[0] + "-" + version;

};

//app启动时，获取授权码

function doVerifyAppKey(){

	//var deviceId = getDeviceId();

	var appName = "OfficialWebsite";//包名

	var appKey = "sdfasdfsfwqerewqrweqWRWER";//固定的32位string

	//$.cookie("passFlag",'',{ path : '/'});

	$.ajax({

		type : "POST",

		async: false,

		dataType : "json",

		url : "doCreditVerifyAppKey.action",

		data : {

			appName : appName,

			appKey : appKey//,

			//deviceID : deviceId

		},

		success:function(data){

			//alert("success");

		}

	});

};

//表单错误的长度

function formErrorLength(obj){

	$(obj).find("input[data-valida-input]").each(function() {

        $(this).trigger("blur");

        var flag = $(this).attr("data-valida-input");

        if(flag == 'false'){

        	$(this).val('').focus();

    	    return false;

        }

    });

	var length = $(obj).find("input[data-valida-input=false]").length;

	return length;

}

//加载

function showLoading(){

	$("#loading").fadeIn();

}

//隐藏加载

function hideLoading(){

	$("#loading").fadeOut();

}

//验证身份证号码
function checkIdcard(num) {
    num = num.toUpperCase();
    //身份证号码为15位或者18位，15位时全为数字，18位前17位为数字，最后一位是校验位，可能为数字或字符X。
    if (!(/(^\d{15}$)|(^\d{17}([0-9]|X)$)/.test(num))) {
        //alert('输入的身份证号长度不对，或者号码不符合规定！\n15位号码应全为数字，18位号码末位可以为数字或X。');
        return false;
    }
    //校验位按照ISO 7064:1983.MOD 11-2的规定生成，X可以认为是数字10。
    //下面分别分析出生日期和校验位
    var len, re;
    len = num.length;
    if (len == 15) {
        re = new RegExp(/^(\d{6})(\d{2})(\d{2})(\d{2})(\d{3})$/);
        var arrSplit = num.match(re);

        //检查生日日期是否正确
        var dtmBirth = new Date('19' + arrSplit[2] + '/' + arrSplit[3] + '/' + arrSplit[4]);
        var bGoodDay;
        bGoodDay = (dtmBirth.getYear() == Number(arrSplit[2])) && ((dtmBirth.getMonth() + 1) == Number(arrSplit[3])) && (dtmBirth.getDate() == Number(arrSplit[4]));
        if (!bGoodDay) {
            //alert('输入的身份证号里出生日期不对！');
            return false;
        }
        else {
            //将15位身份证转成18位
            //校验位按照ISO 7064:1983.MOD 11-2的规定生成，X可以认为是数字10。
            var arrInt = new Array(7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2);
            var arrCh = new Array('1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2');
            var nTemp = 0, i;
            num = num.substr(0, 6) + '19' + num.substr(6, num.length - 6);
            for (i = 0; i < 17; i++) {
                nTemp += num.substr(i, 1) * arrInt[i];
            }
            num += arrCh[nTemp % 11];
            return true;
        }
    }
    if (len == 18) {
        re = new RegExp(/^(\d{6})(\d{4})(\d{2})(\d{2})(\d{3})([0-9]|X)$/);
        var arrSplit = num.match(re);

        //检查生日日期是否正确
        var dtmBirth = new Date(arrSplit[2] + "/" + arrSplit[3] + "/" + arrSplit[4]);
        var bGoodDay;
        bGoodDay = (dtmBirth.getFullYear() == Number(arrSplit[2])) && ((dtmBirth.getMonth() + 1) == Number(arrSplit[3])) && (dtmBirth.getDate() == Number(arrSplit[4]));
        if (!bGoodDay) {
            //alert('输入的身份证号里出生日期不对！');
            return false;
        }
        else {
            //检验18位身份证的校验码是否正确。
            //校验位按照ISO 7064:1983.MOD 11-2的规定生成，X可以认为是数字10。
            var valnum;
            var arrInt = new Array(7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2);
            var arrCh = new Array('1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2');
            var nTemp = 0, i;
            for (i = 0; i < 17; i++) {
                nTemp += num.substr(i, 1) * arrInt[i];
            }
            valnum = arrCh[nTemp % 11];
            if (valnum != num.substr(17, 1)) {
                //alert('18位身份证的校验码不正确！应该为：' + valnum);
                return false;
            }
            return true;
        }
    }
    return false;
}