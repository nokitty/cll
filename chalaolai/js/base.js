var _hmt = _hmt || [];

var formValidator = function(options){
  this.config=$.extend({
		isIcon:true,
		errIcoCls:'icoErr16',
		succIcoCls:'icoCor16',
		nomalIcoCls:'icoPro16',
		errFontCls:'',
		okHide:false
	}, options || {});
	this.els = null;
	this.els=null;
	this.okhide=this.config.okHide;
}
formValidator.prototype ={
	cerror:function(self){
		if ($('#'+self.attr('name')+'-error').length > 0)
		{
			self = $('#'+self.attr('name')+'-error');
		}
		else
		{
			self = self.nextAll('em');
			if (!self || self.length==0)self = self.end().parent().nextAll('em').first();
		}
		return self;
	},
	tip:function(self, style,msg){
		self = this.cerror(self);
		var ymsg = self.attr('data-msg');
		if (!ymsg)
		{
			ymsg = self.text();
			self.attr('data-msg', ymsg);
		}
		self.show();
		if (msg)
		{
			ymsg = msg;
		}
		else
		{
			if (style == this.config.succIcoCls)ymsg='';
		}
		this.config.isIcon && ( ymsg  = '<i class="'+style+'"></i>'+ymsg);
		this.config.errFontCls && style == this.config.errIcoCls && self.addClass(this.config.errFontCls);
		this.config.errFontCls && style != this.config.errIcoCls && self.removeClass(this.config.errFontCls);
		self.html(ymsg);
	},
	errtip:function(self,msg,def){
		if (def === true)
			msg = languages[msg] || '';
		else
			msg = languages[msg] || msg;
		this.tip(self, this.config.errIcoCls, msg);
		return false;
	},
	hidetip:function(self){
		this.cerror(self).hide();
	},
	setels:function(id){
		this.els = document.getElementById(id).elements;
	},
	init:function(id){
		var $this  = this
			els = document.getElementById(id).elements,
			$this.els = els;
		if ($this.els)
		for(var i=0, max=els.length; i < max; i++)
		{
			var  el = els[i],
				self =$( el );
			if (!self.attr('data-rule'))continue;
			if (el.type == 'file')
			{
			   self.change(function(e){
				   $this.valid($(this));
			   });
			}
			else
			{
				self.blur(function(e){
					if ($(this).attr('name').substring(0,1)==='S')
					{
						$(this).val($(this).val().replace(/#/g,'').replace(/\|/g,''));
					}
					var flag = $this.valid($(this), true);
					if (flag && $(this).attr('name') == 'amount_interval_min')
					{
						var omax = $(this).nextAll('input');
						if (!omax.val())omax.val($(this).val());
					}
				}).focus(function(){
					$this.tip($(this), 'icoPro16');
				})
		   }
		}
		$this.placeholder();
	},
	placeholder:function()
	{
		try{
			if (window.T_Config && (window.T_Config.page == 'm_publish' || window.T_Config.page=='publish'))
			{
				var $this = this,val=$this.els['cat_id'].value;
				switch(val.substring(0,val.length-32))
				{
					case '1':
						$($this.els['i_overview']).each(function(){
							var _this = $(this);
							var holder = '项目背景+项目介绍+融资需求+详细用途';
							_this.attr('holder',holder);
							_this.focus(function(){
								if (holder == _this.val())_this.val('');
							}).blur(function(){
								if (!_this.val())_this.val(holder);
							});
							if (!_this.val())_this.val(holder);
						})
						break;
				}
			}
		}catch (e){}
	},
	valid:function(self, is_merge){
		if (!self.is(":visible"))return;
		var $this  = this,
			merge = '',
			_val = '';
		switch(self.attr('type'))
		{
			case 'select-one':
			case 'select':
			case 'raido':
			case 'hidden':
			case 'text':
			case 'password':
			case 'textarea':
			case 'file':
				if (is_merge)
				{
					merge = self.attr('data-merge');
					if(merge)
					{
						merge = merge.split(',');
						for(var i=0;i<merge.length;i++)
						{
						   if ( ! $this.valid(  $($this.els[merge[i]]), false  ) ) return false;
						}
					}
				}
				_val = self.val();
				if(self.attr('tip') && self.attr('tip')==_val)_val='';
				break;
			case 'checkbox':
				_val = $('input[name='+self.attr('name').replace('[','\\[').replace(']','\\]')+']').map(function(){
					if ($(this).attr('checked') == true)return $(this).val();
				}).get().join(',');
				break;
			default:
				return true;
				break;
		}
		_val = $.trim(_val);
		if (_val && _val == self.attr('holder')) _val = '';
		var $rules = self.attr('data-rule');
		if (!$rules)return true;
		var _rules = $rules.split('|');
		if (_rules[0] == 'required' && !_val)
		{
			$this.errtip(self);
			return false;
		}


		if (!_val)return true;
		var _ajaxcheck = false;
		for(var i=0;i<_rules.length;i++)
		{
			var _rule = _rules[i];
			if (_rule == 'required')continue;
			var _pos   = _rule.indexOf('[');
			var _type  = _rule.substring(0,_pos);
			var _dval  = _rule.substring(_pos+1, _rule.length-1) || '';
			switch(_type)
			{
				case 'regexp':
					if (_dval && !(new RegExp(eval("regexEnum." + _dval), 'i').test(_val)))
						return $this.errtip(self, _dval+'_error', true);
				break;
				case 'F':
					if (_dval)eval('var _fs ='+_dval+'("'+_val+'")');
					if (_dval && !_fs)
						return $this.errtip(self, _dval+'_error', true);
				break;
				case 'matches':
					if (_dval && $this.els[_dval].value != _val)
						return $this.errtip(self, _dval+'_matches', true);
				break;
				case 'min_length':
					var _len = parseFloat(_dval);
					if (_val.length < _len)
					   return $this.errtip(self, '该值长度必须大于 '+_len+' 个字符');
				break;
				case 'max_length':
					var _len = parseFloat(_dval);
					if (_val.length > _len)
					   return $this.errtip(self, '该值长度必须小于 '+_len+' 个字符');
				break;
				case 'greater':
					if (_dval == 'min_max')
					{
						var _name = self.attr('name');
						_name	= _name.substr(0,_name.length-4);
						var _min = parseFloat($this.els[_name+'_min'].value);
						var _max = parseFloat($this.els[_name+'_max'].value);
						//暂时额外处理一下
						try{
							switch(_name)
							{
								case 'amount_interval':
								_min *= parseInt($this.els[_name+'_min_unit'].value);
								_max *= parseInt($this.els[_name+'_max_unit'].value);
								if(_min && _max && new String(parseInt(_max)).length - new String(parseInt(_min)).length >2)
									return $this.errtip(self, '金额区间超出2个数量级，请重新填写');

								if ($this.els['amount'])$this.valid($($this.els['amount']), false);
								break;
							}
						}catch (e){}
						if (_name &&  _min> _max)
						  return $this.errtip(self, '起始值必须小于结束值');
					}
					else if (parseInt(_dval) != _dval)
					{
						try{
							var o = $($this.els[_dval]);
							var _dval = parseFloat(o.val())*parseInt($this.els[_dval+'_unit'].value);
							var _name = self.attr('name');
							var _max  =  parseFloat($this.els[_name].value)*parseInt($this.els[_name+'_unit'].value);
							if (_name && $this.els[_name].value.length>0 && _max < _dval && self.attr('iname') && o.attr('iname'))
							   return $this.errtip(self, self.attr('iname')+'不能小于'+o.attr('iname'));
						}catch (e){}
					}
					else
					{
						var _dval = parseInt(_dval);
						var _name = self.attr('name');
						var _max  =  parseFloat($this.els[_name].value);
						if (_name && $this.els[_name].value.length>0 && _max <= _dval)
						   return $this.errtip(self, '该值必须大于'+(_dval < 0 ? '等于'+(_dval+1) : _dval));
					}
				break;
				case 'valmin':
					var _min = parseFloat(_dval);
						_val = parseFloat(_val);
					if (_val < _min)
					{
						var msg = '该值必须大于'+_min;
						var re = new RegExp("valmin\\[(\\d+)\\]\\|valmax\\[(\\d+)\\]", "i" );
						var a = re.exec( $rules );
						if (a !==null)
							msg = '该值的取值范围为'+a[1]+'-'+a[2]+'之间';
						return $this.errtip(self, msg);
					}
				break;
				case 'valmax':
					var _max = parseFloat(_dval);
						_val = parseFloat(_val);
					if (_val > _max)
					{
						var msg = '该值必须小于'+_max;
						var re = new RegExp("valmin\\[(\\d+)\\]\\|valmax\\[(\\d+)\\]", "i" );
						var a = re.exec( $rules );
						if (a !==null)
							var msg = '该值的取值范围为'+a[1]+'-'+a[2]+'之间';
						return $this.errtip(self, msg);
					}
				break;
				case 'ajaxcheck':
					_ajaxcheck = true;
					var _other = '';
					var _field = _dval;
					if (_field.indexOf('-') > -1)
					{
					   var fields = _field.split('-');
					   _field = fields[0];
					   for(var i=1;i<fields.length;i++)
					   {
						   _other += '&'+fields[i]+'='+$this.els[fields[i]].value;
					   }
					}
					var param = _field+"="+_val+_other;
					var success = function(res){
						Trjcn.cache[param] = res;
						if (res.code == 200)
						{
							$this.okhide == true ? $this.hidetip(self) : $this.tip(self, $this.config.succIcoCls);
							return true;
						}
						else
						{
							return $this.errtip(self, res.data.error);
						}
					}
					if (Trjcn.cache[param])
					{
						return success(Trjcn.cache[param]);
					}
					Trjcn.Ajax.post("/api/reg/formcheck", "type="+_field+"&"+param, success);
				break;
			}

			switch(self.attr('name'))
			{
				case 'xmrz_revenue':
				case 'xmrz_asset':
				if($this.els['xmrz_revenue'].value > 0 && $this.els['xmrz_revenue'].value <10  && $this.els['xmrz_revenue'].value == $this.els['xmrz_asset'].value && $this.els['xmrz_revenue_unit'].value==1 && $this.els['xmrz_asset_unit'].value==1)
				{
					return $this.errtip(self, '请重新填写营业额和净资产');
				}
				break;
				case 'last_year_revenue':
				case 'net_asset':
				if($this.els['last_year_revenue'].value > 0 && $this.els['last_year_revenue'].value <10  && $this.els['last_year_revenue'].value == $this.els['net_asset'].value && $this.els['xmrz_revenue_unit'].value==1)
				{
					return $this.errtip(self, '请重新填写营业额和净资产');
				}
				break;
			}

		}
	   if (_ajaxcheck==false)$this.okhide == true ? $this.hidetip(self) : $this.tip(self, 'icoCor16');

	   return true;
	},
	isValid:function(id,callback){
		var $this  = this;
		if (id)$this.els = document.getElementById(id).elements;
		var callback = callback || function(){};
		var error = false;
		if($this.els)
		for(var i=0, max=$this.els.length; i < max; i++)
		{
			if ( $this.valid( $($this.els[i]), true ) == false )error = true;
		}

		if (error == false) callback();
		return error;
	},
	errors:function(error_messages){
		var $this  = this;
		for(var name in error_messages){
			if (!$this.els[name])continue;
		   $this.tip($(this.els[name]), $this.config.errIcoCls, error_messages[name]);
		}
	}
}

var regexEnum =
{
	intege:"^-?[1-9]\\d*$",					//整数
	intege1:"^[1-9]\\d*$",					//正整数
	intege2:"^-[1-9]\\d*$",					//负整数
	num:"^([+-]?)\\d*\\.?\\d+$",			//数字
	num1:"^[1-9]\\d*|0$",					//正数（正整数 + 0）
	num2:"^-[1-9]\\d*|0$",					//负数（负整数 + 0）
	num3:"^[0-9]\\d*$",					//数字
	decmal:"^([+-]?)\\d*\\.\\d+$",			//浮点数
	decmal1:"^[1-9]\\d*.\\d*|0.\\d*[1-9]\\d*$",	//正浮点数
	decmal2:"^-([1-9]\\d*.\\d*|0.\\d*[1-9]\\d*)$",//负浮点数
	decmal3:"^-?([1-9]\\d*.\\d*|0.\\d*[1-9]\\d*|0?.0+|0)$", //浮点数
	decmal4:"^[1-9]\\d*.\\d*|0.\\d*[1-9]\\d*|0?.0+|0$",//非负浮点数（正浮点数 + 0）
	decmal5:"^(-([1-9]\\d*.\\d*|0.\\d*[1-9]\\d*))|0?.0+|0$",//非正浮点数（负浮点数 + 0）

	email:"^\\w+((-\\w+)|(\\.\\w+))*\\@[A-Za-z0-9]+((\\.|-)[A-Za-z0-9]+)*\\.[A-Za-z0-9]+$", //邮件
	color:"^[a-fA-F0-9]{6}$",				//颜色
	url:"^http[s]?:\\/\\/([\\w-]+\\.)+[\\w-]+([\\w-./?%&=]*)?$",	//url
	chinese:"^[\\u4E00-\\u9FA5\\uF900-\\uFA2D]+$",					//仅中文
	ascii:"^[\\x00-\\xFF]+$",				//仅ACSII字符
	zipcode:"^\\d{6}$",						//邮编
	mobile:"^1(3[0-9]|4[0-9]|5[0-9]|7[0|6|7]|8[0-9])\\d{8}$",				//手机
	ip4:"^(25[0-5]|2[0-4]\\d|[0-1]\\d{2}|[1-9]?\\d)\\.(25[0-5]|2[0-4]\\d|[0-1]\\d{2}|[1-9]?\\d)\\.(25[0-5]|2[0-4]\\d|[0-1]\\d{2}|[1-9]?\\d)\\.(25[0-5]|2[0-4]\\d|[0-1]\\d{2}|[1-9]?\\d)$",	//ip地址
	notempty:"^\\S+$",						//非空
	picture:"(.*)\\.(jpg|bmp|gif|ico|pcx|jpeg|tif|png|raw|tga)$",	//图片
	rar:"(.*)\\.(rar|zip|7zip|tgz)$",								//压缩文件
	date:"^\\d{4}(\\-|\\/|\.)\\d{1,2}\\1\\d{1,2}$",					//日期
	qq:"^[1-9]*[1-9][0-9]*$",				//QQ号码
	tel:"^(([0\\+]\\d{2,3}-)?(0\\d{2,3})-)?(\\d{7,8})(-(\\d{3,}))?$",	//电话号码的函数(包括验证国内区号,国际区号,分机号)
	username:"^\\w+$",						//用来用户注册。匹配由数字、26个英文字母或者下划线组成的字符串
	letter:"^[A-Za-z]+$",					//字母
	letter_u:"^[A-Z]+$",					//大写字母
	letter_l:"^[a-z]+$",					//小写字母
	idcard:"^[1-9]([0-9]{14}|[0-9]{17})$",	//身份证
	passwd:"^[0-9|a-z|A-Z]{6,20}$",
	passwd2:"^[0-9|a-z|A-Z|!\\+=\\<\\>\\/@#\\$%^&\\*~\\(\\)_:;\\?\\.,]{6,20}$",
	ps_username:"^[\\u4E00-\\u9FA5\\uF900-\\uFA2D|a-zA-Z]+$" //中文、字母、数字 _
}

var languages ={
'mobile_error':'请输入正确的手机号码',
'chinese_error':'只允许输入中文',
'passwd_error':'请输入6-20位字符组成的密码',
'newpwd_matches':'确认新密码输入不一致',
'email_error':'请输入正确的邮箱地址',
'ps_username_error':'请输入您的真实姓名',
'password_error':'请输入6-20位字符组成的密码',
'password_matches':'确认密码输入不一致',

'mobile_code':'请输入您收到的手机验证码',
'mobile_code_ok':'验证码已发送，若未收到，请先到拦截信息中查找，仍未发现请联系客服',
'mobile_code_ok2':'验证码已发送，若未收到，请先到拦截信息中查找，如无法收到验证码请点击<a href="javascript:;" onclick="MobileVoice();" class="red" style="text-decoration:underline;">语音播报验证码</a>',
'mobile_btn':'免费获取验证码',
'codetime':'[s]秒后重新发送',
'codetime2':'验证码已发送，请在<font color="red">{$s}</font>秒后重新获取，若未收到，请在拦截信息中查找或直接<a href="http://chat.53kf.com/webCompany.php?arg=trjcn&style=1" target="_blank"><span style="text-decoration: underline;color:red;">联系客服</span></a>',
'neterror':'网络异常，请重试！',
'isIdCard_error':'身份证号码错误！'
}

if (!window.Trjcn) {
	window.Trjcn = new Object()
};
if (!window.T_Config) {
	window.T_Config = new Object()
};
function U(url)
{
	return '/'+url;
}

function DrawImage(ImgD, FitWidth, FitHeight) { var image = new Image(); image.src = ImgD.src; if (image.width >0 && image.height >0) { if (image.width / image.height >= FitWidth / FitHeight) { if (image.width >FitWidth) { ImgD.width = FitWidth; ImgD.height = (image.height * FitWidth) / image.width; } else { ImgD.width = image.width; ImgD.height = image.height; } } else { if (image.height >FitHeight) { ImgD.height = FitHeight; ImgD.width = (image.width * FitHeight) / image.height; } else { ImgD.width = image.width; ImgD.height = image.height; } } } }

Trjcn.cache={}
Trjcn.ui={}

Trjcn.ui.tips = function(content, time){
	if ($.dialog)
	{
		$.dialog({
			id: 'Tips',
			title: false,
			cancel: false,
			fixed: true,
			lock: true
		})
		.content('<div style="padding: 0 1em;">' + content + '</div>')
		.time(time || 1);
	}
	else
	{
	   alert(msg);
	}
}


Trjcn.ui.confirm = function(content, yes, no){
	if (false && $.dialog)
	{
		$.dialog({
			id: 'Confirm',
			icon: 'question',
			fixed: true,
			lock: true,
			  width:'300px',
			content: content,
			ok: function (here) {
				return yes.call(this, here);
			},
			cancel: function (here) {
				return no && no.call(this, here);
			}
		});
	}
	else
	{
	   if (confirm(content))
		   return yes && yes();
	   else
		  return no && no.call();
	}
}

Trjcn.ui.confirmb = function(content, yes, no){
	if ($.dialog)
	{
	$.dialog({
		id: 'Confirm',
		icon: 'question',
		fixed: true,
		lock: true,
		  width:'300px',
		content: content,
		ok: function (here) {
			return yes.call(this, here);
		},
		cancel: function (here) {
			return no && no.call(this, here);
		}
	});
	$('.aui_main').css({'text-align':'left'});
	}
}

Trjcn.ui.success = Trjcn.ui.error = Trjcn.ui.alert = Trjcn.ui.alertb = function(msg,yes){
	if($.dialog)
	{
	var html = '<div id="applyPrompt" class="hide p10" style="display: block;width:250px;">';
		html  += '<p class="pb10 ac">'+msg+'</p>';
		html  += '<p class="pt5 ac"><a href="javascript:;" onclick="Trjcn.cache.dialog.close();" class="gBtn22"><i class="gBtn22Inner">确 定</i></a></p>';
		html  += '</div>';
	  Trjcn.cache.dialog = $.dialog({
			title:'系统提示',
			lock:true,
			fixed:true,
			content: html,
			close:function (here) {
				Trjcn.cache.dialog = null;
				return yes && yes.call(this, here);
			}
		});
	  }else alert(msg)
}

Trjcn.ui.dialog = function(self){
	var self = $(self);
	var _url = self.attr('data-url');
	var _title = self.attr('title');
	Trjcn.cache.dialog = $.dialog({
		title: _title,
		lock:true,
		fixed:true,
		width:'250px',
		close:function(){
			Trjcn.cache.dialog = null;
		}
   });
   $.ajax({
   url: _url,
   cache:false,
   success: function (data) {
	Trjcn.cache.dialog.content(data);
	Trjcn.cache.dialog.reset();
   }
   });
}


jQuery.cookie = function(name, value, options) {
	if (typeof value != 'undefined') { // name and value given, set cookie
		options = options || {};
		if (value === null) {
			value = '';
			options.expires = -1;
		}
		var expires = '';
		if (options.expires && (typeof options.expires == 'number' || options.expires.toUTCString)) {
			var date;
			if (typeof options.expires == 'number') {
				date = new Date();
				date.setTime(date.getTime() + (options.expires * 24 * 60 * 60 * 1000));
			} else {
				date = options.expires;
			}
			expires = '; expires=' + date.toUTCString(); // use expires attribute, max-age is not supported by IE
		}
		// CAUTION: Needed to parenthesize options.path and options.domain
		// in the following expressions, otherwise they evaluate to undefined
		// in the packed version for some reason...
		var path = options.path ? '; path=' + (options.path) : '';
		var domain = options.domain ? '; domain=' + (options.domain) : '';
		var secure = options.secure ? '; secure' : '';
		document.cookie = [name, '=', encodeURIComponent(value), expires, path, domain, secure].join('');
	} else { // only name given, get cookie
		var cookieValue = null;
		if (document.cookie && document.cookie != '') {
			var cookies = document.cookie.split(';');
			for (var i = 0; i < cookies.length; i++) {
				var cookie = jQuery.trim(cookies[i]);
				// Does this cookie string begin with the name we want?
				if (cookie.substring(0, name.length + 1) == (name + '=')) {
					cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
					break;
				}
			}
		}
		return cookieValue;
	}
};

;(function($) {


	//全局下拉菜单
	$.fn.hoverClass=function(b){
		var a=this;
		a.each(function(c){
			a.eq(c).hover(function(){
				$(this).addClass(b)
			},function(){
				$(this).removeClass(b)
			})
		});
		return a
	};

	//top排行
	$.fn.Sonny = function(option, callback){
		if(typeof option == "function"){
			callback = option;
			option = {};
		};
		var s = $.extend({delay:50,index:0}, option || {});
		var _this = this;
		var timer = null;
		$.each(this, function(n){
			$(this).bind("mouseover", function(){
				if(timer != null)
					clearTimeout(timer);
				var obj = $(this);
				timer = setTimeout(function(){
					_this.eq(s.index).removeClass(s.current);
					s.index = n;
					_this.eq(s.index).addClass(s.current);
					if(callback){
						callback(obj);
					}
				}, s.delay);
			});
		});
	};

	//全局选项卡
	$.fn.Tabs = function(options){
		return this.each(function(){
			// 处理参数
			options = $.extend({
				event : 'mouseover',
				timeout : 0,
				auto : 0,
				callback : null,
				switchBtn : false
			}, options);

			var self = $(this),
				tabBox = self.children( '.tabBox' ).children( 'div' ),
				menu = self.children( '.tabMenu' ),
				items = menu.find( 'li' ),
				timer;

			var tabHandle = function( elem ){
					elem.siblings( 'li' )
						.removeClass( 'current' )
						.end()
						.addClass( 'current' );

					tabBox.siblings( 'div' )
						.addClass( 'hide' )
						.end()
						.eq( elem.index() )
						.removeClass( 'hide' );
				},

				delay = function( elem, time ){
					time ? setTimeout(function(){ tabHandle( elem ); }, time) : tabHandle( elem );
				},

				start = function(){
					if( !options.auto ) return;
					timer = setInterval( autoRun, options.auto );
				},

				autoRun = function( isPrev ){
					var current = menu.find( 'li.current' ),
						firstItem = items.eq(0),
						lastItem = items.eq(items.length - 1),
						len = items.length,
						index = current.index(),
						item, i;

					if( isPrev ){
						index -= 1;
						item = index === -1 ? lastItem : current.prev( 'li' );
					}
					else{
						index += 1;
						item = index === len ? firstItem : current.next( 'li' );
					}

					i = index === len ? 0 : index;

					current.removeClass( 'current' );
					item.addClass( 'current' );

					tabBox.siblings( 'div' )
						.addClass( 'hide' )
						.end()
						.eq(i)
						.removeClass( 'hide' );
					if( options.callback ){
						options.callback.call( self );
					}
				};

			items.bind( options.event, function(){
				delay( $(this), options.timeout );
				if( options.callback ){
					options.callback.call( self );
				}
			});

			if( options.auto ){
				start();
				self.hover(function(){
					clearInterval( timer );
					timer = undefined;
				},function(){
					start();
				});
			}

			if( options.switchBtn ){
				self.append( '<a href="#prev" class="tab_prev">previous</a><a href="#next" class="tab_next">next</a>' );
				var prevBtn = $( '.tab_prev', self ),
					nextBtn = $( '.tab_next', self );

				prevBtn.click(function( e ){
					autoRun( true );
					e.preventDefault();
				});

				nextBtn.click(function( e ){
					autoRun();
					e.preventDefault();
				});
			}

		});
	};

	//全局slide
	(function($){
		$.fn.Slide=function(options){
			var opts = $.extend({},$.fn.Slide.deflunt,options);
			var index=0;
			var targetLi = $("." + opts.claNav + " li", $(this));//目标对象
			var clickNext = $("." + opts.claNav + " .next", $(this));//点击下一个按钮
			var clickPrev = $("." + opts.claNav + " .prev", $(this));//点击上一个按钮
			var ContentBox = $("." + opts.claCon , $(this));//滚动的对象
			var ContentBoxNum=ContentBox.children().size();//滚动对象的子元素个数
			var slideH=ContentBox.children().first().height();//滚动对象的子元素个数高度，相当于滚动的高度
			var slideW=ContentBox.children().first().width();//滚动对象的子元素宽度，相当于滚动的宽度
			var autoPlay;
			var slideWH;
			var scrolling = false;
			if(opts.effect=="scroolY"||opts.effect=="scroolTxt"){
				slideWH=slideH;
			}else if(opts.effect=="scroolX"||opts.effect=="scroolLoop"){
				ContentBox.css("width",ContentBoxNum*slideW);
				slideWH=slideW;
			}else if(opts.effect=="fade"){
				ContentBox.children().first().css("z-index","1");
			}

			return this.each(function() {
				var $this=$(this);
				//滚动函数
				//window.console.log($.fn.Slide.effect)
				var doPlay=function(){
					scrolling = true;
					$.fn.Slide.effect[opts.effect](ContentBox, targetLi, index, slideWH, opts,function(){
					scrolling =false;
					});
					index++;
					if (index*opts.steps >= ContentBoxNum) {
						index = 0;
					}
				};
				clickNext.click(function(event){
					if (opts.autoPlay)
					{
						opts.sideFS = 'right';
						if(autoPlay){
						clearInterval(autoPlay);
						 }
						if (scrolling===false)
						{
							doPlay();
						}
						autoPlay = setInterval(doPlay, opts.timer);
						return;
					}
					if (scrolling===true)return;
					scrolling = true;
					$.fn.Slide.effectLoop.scroolLeft(ContentBox, targetLi, index, slideWH, opts,function(){
						for(var i=0;i<opts.steps;i++){
							ContentBox.find("li:first",$this).appendTo(ContentBox);
						}
						ContentBox.css({"left":"0"});
						scrolling = false;
					});
					event.preventDefault();
				});
				clickPrev.click(function(event){
					if (opts.autoPlay)
					{
						opts.sideFS = 'left';
						if(autoPlay){
						clearInterval(autoPlay);
						 }
						if (scrolling===false)
						{
							doPlay();
						}
						autoPlay = setInterval(doPlay, opts.timer);
						return;
					}
					if (scrolling===true)return;
					scrolling = true;
					for(var i=0;i<opts.steps;i++){
						ContentBox.find("li:last").prependTo(ContentBox);
					}
					ContentBox.css({"left":-index*opts.steps*slideW});
					$.fn.Slide.effectLoop.scroolRight(ContentBox, targetLi, index, slideWH, opts,function(){
					   scrolling = false;
					});
					event.preventDefault();
				});
				//自动播放
				if (opts.autoPlay) {
					autoPlay = setInterval(doPlay, opts.timer);
					ContentBox.hover(function(){
						if(autoPlay){
							clearInterval(autoPlay);
						}
					},function(){
						if(autoPlay){
							clearInterval(autoPlay);
						}
						autoPlay=setInterval(doPlay, opts.timer);
					});
				}

				//目标事件
				targetLi.hover(function(){
					if(autoPlay){
						clearInterval(autoPlay);
					}
					index=targetLi.index(this);
					window.setTimeout(function(){$.fn.Slide.effect[opts.effect](ContentBox, targetLi, index, slideWH, opts);},200);

				},function(){
					if(autoPlay){
						clearInterval(autoPlay);
					}
					autoPlay = setInterval(doPlay, opts.timer);
				});
			});
		};
		$.fn.Slide.deflunt={
			effect : "scroolY",
			autoPlay:true,
			speed : "normal",
			timer : 1000,
			defIndex : 0,
			claNav:"JQ-slide-nav",
			claCon:"JQ-slide-content",
			steps:1
		};
		$.fn.Slide.effectLoop={
			scroolLeft:function(contentObj,navObj,i,slideW,opts,callback){
				contentObj.animate({"left":-i*opts.steps*slideW},opts.speed,callback);
				if (navObj) {
					navObj.eq(i).addClass("on").siblings().removeClass("on");
				}
			},

			scroolRight:function(contentObj,navObj,i,slideW,opts,callback){
				contentObj.stop().animate({"left":0},opts.speed,callback);

			}
		}
		$.fn.Slide.effect={
			fade:function(contentObj,navObj,i,slideW,opts){
				contentObj.children().eq(i).stop().animate({opacity:1},opts.speed).css({"z-index": "1"}).siblings().animate({opacity: 0},opts.speed).css({"z-index":"0"});
				navObj.eq(i).addClass("on").siblings().removeClass("on");
			},
			scroolTxt:function(contentObj,undefined,i,slideH,opts){
				//alert(i*opts.steps*slideH);
				contentObj.animate({"margin-top":-opts.steps*slideH},opts.speed,function(){
					for( var j=0;j<opts.steps;j++){
						contentObj.find("li:first").appendTo(contentObj);
					}
					contentObj.css({"margin-top":"0"});
				});
			},
			scroolX:function(contentObj,navObj,i,slideW,opts,callback){
				contentObj.stop().animate({"left":-i*opts.steps*slideW},opts.speed,callback);
				if (navObj) {
					navObj.eq(i).addClass("on").siblings().removeClass("on");
				}
			},
			scroolY:function(contentObj,navObj,i,slideH,opts){
				contentObj.stop().animate({"top":-i*opts.steps*slideH},opts.speed);
				if (navObj) {
					navObj.eq(i).addClass("on").siblings().removeClass("on");
				}
			},
			scroolLoop:function(contentObj,navObj,i,slideW,opts,callback){

				if (opts.sideFS == 'left')
				{
				for(var i=0;i<opts.steps;i++){
						contentObj.find("li:last").prependTo(contentObj);
					}
					contentObj.css({"left":-i*opts.steps*slideW});
					$.fn.Slide.effectLoop.scroolRight(contentObj, navObj, i, slideW, opts,callback);
				}
				else{
				$.fn.Slide.effectLoop.scroolLeft(contentObj, navObj, opts.steps, slideW,opts,function(){
					for(var i=0;i<opts.steps;i++){
						contentObj.find("li:first").appendTo(contentObj);
					}
					contentObj.css({"left":"0"});
					callback();
				});
				}
			}
		};
	})(jQuery);

	$.fn.extend({

		doScroll:function(opt,callback){
			//参数初始化
			if(!opt) var opt={};
			var _btnUp = $("#"+ opt.up);//Shawphy:向上按钮
			var _btnDown = $("#"+ opt.down);//Shawphy:向下按钮
			var timerID;
			var _this=this.eq(0).find("ul:first");
			var	 lineH=_this.find("li:first").height(), //获取行高
					line=opt.line?parseInt(opt.line,10):parseInt(this.height()/lineH,10), //每次滚动的行数，默认为一屏，即父容器高度
					speed=opt.speed?parseInt(opt.speed,10):500; //卷动速度，数值越大，速度越慢（毫秒）
					timer=opt.timer //?parseInt(opt.timer,10):3000; //滚动的时间间隔（毫秒）
			if(line==0) line=1;
			var upHeight=0-line*lineH;
			//滚动函数
			var scrollUp=function(){
					_btnUp.unbind("click",scrollUp); //Shawphy:取消向上按钮的函数绑定
					_this.animate({
							marginTop:upHeight
					},speed,function(){
							for(i=1;i<=line;i++){
									_this.find("li:first").appendTo(_this);
							}
							_this.css({marginTop:0});
							_btnUp.bind("click",scrollUp); //Shawphy:绑定向上按钮的点击事件
					});

			}
			//Shawphy:向下翻页函数
			var scrollDown=function(){
					_btnDown.unbind("click",scrollDown);
					for(i=1;i<=line;i++){
							_this.find("li:last").show().prependTo(_this);
					}
					_this.css({marginTop:upHeight});
					_this.animate({
							marginTop:0
					},speed,function(){
							_btnDown.bind("click",scrollDown);
					});
			}
			//Shawphy:自动播放
			var autoPlay = function(){
					if(timer && opt.auto == true)timerID = window.setInterval(scrollUp,timer);
			};//如果把scrollUp换成scrollDown默认滚屏就会向下的！
			var autoStop = function(){
					if(timer)window.clearInterval(timerID);
			};
			 //鼠标事件绑定
			_this.hover(autoStop,autoPlay).mouseout();
			_btnUp.css("cursor","pointer").click( scrollUp ).hover(autoStop,autoPlay);//Shawphy:向上向下鼠标事件绑定
			_btnDown.css("cursor","pointer").click( scrollDown ).hover(autoStop,autoPlay);

		},
		setSelectValue:function(v){
			this.each(function(){if ($(this).val() == v){$(this).attr('selected', true);}});
		},
		getSelectedTxt:function(v){
			var v = '';
			this.each(function(){if ($(this).attr('selected') == true){v = $(this).html();}});
			return v;
		},
		setCheckBoxAll:function(val){
			if (typeof(val)!='boolean')val = true;
			this.each(function(){this.checked=val});
		},

		setCheckBoxValue:function(val, sp){
			if (!val)return false;
			sp = sp || '-';
			this.each(function(){if ((sp+val+sp).indexOf(sp+$(this).val()+sp) >-1)$(this).attr('checked', true)});
		},
		getCheckBoxValue:function(){
			return this.map(function(){	if ($(this).attr('checked')==true)return $(this).val();}).get().join(',');
		},
		getCheckBoxDataid:function(){
			return this.map(function(){	if ($(this).attr('checked')==true)return $(this).attr('data_id');}).get().join(',');
		},


		setRadioValue:function(v){
			this.each(function(){if ($(this).val() == v){$(this).attr('checked', true);}});
		}

	});



	/*
	<input type="text" data-rule="require|regexp[num3]" data-merge="">
	matches  require  regexp
	*/
	//后期要删除，不再使用
	$.formValidator={
		els:null,
		okhide:false,
		tip:function(self, style,msg){
			self = self.nextAll('em');
			if (!self || self.length==0)self = self.end().parent().nextAll('em');
			var ymsg = self.attr('data-msg');
			if (!ymsg)
			{
				ymsg = self.text();
				self.attr('data-msg', ymsg);
			}
			self.show();
			if (msg)
			{
				self.html('<i class="'+style+'"></i>'+msg);
			}
			else
			{
				if (style == 'icoCor16')ymsg='';
				self.html('<i class="'+style+'"></i>'+ymsg);
			}
		},
		hidetip:function(self){
			self = self.nextAll('em');
			if (!self || self.length==0)self = self.end().parent().nextAll('em');
			self.hide();
		},
		setels:function(id){
			this.els = document.getElementById(id).elements;
		},
		init:function(id){
			var $this  = this
				els = document.getElementById(id).elements,
				$this.els = els;
			if ($this.els)
			for(var i=0, max=els.length; i < max; i++)
			{
				var  el = els[i],
					self =$( el );
				if (!self.attr('data-rule'))continue;
				if (el.type == 'file')
			   {
				   self.change(function(e){
					   $this.valid($(this));
				   });
			   }
			   else
			   {
				  self.blur(function(e){
					   $this.valid($(this), true);
				   }).focus(function(){
					   $this.tip($(this), 'icoPro16');
				   })
			   }
			}
		},
		valid:function(self, is_merge){
			if (!self.is(":visible"))return;
			var $this  = this,
				_val = '',
				$rules = self.attr('data-rule');
			if (!$rules)return true;
			var _rules = $rules.split('|');
			switch(self.attr('type'))
			{
				case 'select-one':
				case 'select':
				case 'raido':
				case 'hidden':
				case 'text':
				case 'password':
				case 'textarea':
				case 'file':
					if (is_merge)
					{
						var merge = self.attr('data-merge');
						if(merge)
						{
							merge = merge.split(',');
							for(var i=0;i<merge.length;i++)
							{
							   if ( ! $this.valid(  $($this.els[merge[i]]), false  ) ) return false;
							}
						}
					}
					_val = self.val();
					break;
				case 'checkbox':
					_val = $('input[name='+self.attr('name').replace('[','\\[').replace(']','\\]')+']').map(function(){
						if ($(this).attr('checked') == true)return $(this).val();
					}).get().join(',');
					break;
			}

			if (_rules[0] == 'required' && !_val)
			{
				$this.tip(self, 'icoErr16');
				return false;
			}


			if (!_val)return true;
			var _ajaxcheck = false;
			for(var i=0;i<_rules.length;i++)
			{
			   var _rule = _rules[i];
			   if (_rule == 'required')continue;
			   if ( _rule.substring(0, 6) =='regexp' )
			   {
					var _regexp = _rule.substring(7, _rule.length-1) || '';
					if (_regexp)
					{
						if (!(new RegExp(eval("regexEnum." + _regexp), 'i').test(_val)))
						{
							var msg = eval('languages.'+_regexp+'_error');
							$this.tip(self, 'icoErr16', msg ? msg : '');
							return false;
						}
					}
				}
				else if ( _rule.substring(0, 7) =='matches' )
				{
					 var _field = _rule.substring(8, _rule.length-1) || '';
					 if (_field && $this.els[_field].value != _val)
					 {
						 var msg = eval('languages.'+_field+'_matches');
						 $this.tip(self, 'icoErr16', msg ? msg : '');
						return false;
					 }
				}
				else if ( _rule =='greater[min_max]' )
				{//起始小于结束
					 var _name = self.attr('name');
					 _name	= _name.substr(0,_name.length-4);
					 var _min =  parseFloat($this.els[_name+'_min'].value);
					 var _max = parseFloat($this.els[_name+'_max'].value);

					 if (_name &&  _min>= _max)
					 {
						 var msg = '起始值必须小于结束值';
						 $this.tip(self, 'icoErr16', msg ? msg : '');
						return false;
					 }
				}
				else if ( _rule.substring(0, 6) =='valmin' )
				{
					 var _min = parseFloat(_rule.substring(7, _rule.length-1));
					 if (_val < _min)
					 {
						var msg = '该值必须大于'+_min;
						var re = new RegExp("valmin\\[(\\d+)\\]\\|valmax\\[(\\d+)\\]", "i" );
						var a = re.exec( $rules );
						if (a !==null)
						{
							var msg = '该值的取值范围为'+a[1]+'-'+a[2]+'之间';
						}

						$this.tip(self, 'icoErr16', msg ? msg : '');
						return false;
					 }
				}else if ( _rule.substring(0, 6) =='valmax' )
				{
					 var _max = parseFloat(_rule.substring(7, _rule.length-1));
					 if (_val > _max)
					 {
						var msg = '该值必须小于'+_max;
						var re = new RegExp("valmin\\[(\\d+)\\]\\|valmax\\[(\\d+)\\]", "i" );
						var a = re.exec( $rules );
						if (a !==null)
						{
							var msg = '该值的取值范围为'+a[1]+'-'+a[2]+'之间';
						}

						$this.tip(self, 'icoErr16', msg ? msg : '');
						return false;
					 }
				}
				else if (_rule.substring(0, 9) == 'ajaxcheck')
				{
				   _ajaxcheck = true;
				   var _field = _rule.substring(10, _rule.length-1) || '';
				   var success = function(res){
						  Trjcn.cache[_val] = res;
						  if (res.code == 200)
						   {
								$this.okhide == true ? $this.hidetip(self) : $this.tip(self, 'icoCor16');
								return true;
						   }
						   else
						   {
							   $this.tip(self, 'icoErr16', res.data.error);
							   return false;
						   }
					}
					if (Trjcn.cache[_val])
					{
						return success(Trjcn.cache[_val]);
					}
					Trjcn.Ajax.post("/api/reg/formcheck", "type="+_field+"&"+_field+"="+_val, success);
				}
			}
		   if (_ajaxcheck==false)$this.okhide == true ? $this.hidetip(self) : $this.tip(self, 'icoCor16');

		   return true;
		},
		isValid:function(id,callback){
			var $this  = this;
			if (id)$this.els = document.getElementById(id).elements;
			var callback = callback || function(){};
			var error = false;
			if($this.els)
			for(var i=0, max=$this.els.length; i < max; i++)
			{
				if ( $this.valid( $($this.els[i]), true ) == false )error = true;
			}

			if (error == false) callback();
			return error;
		},
		errors:function(error_messages){
			for(var name in error_messages){
				if (!this.els[name])continue;
				this.tip($(this.els[name]), 'icoErr16', error_messages[name]);
			}
		}
	}
})(jQuery);

Trjcn.test = {}
function TrustOrder()
{
	var order = {
		prefix:'',
		type:'',
		url:'',
		callback:'',
		initBoxAfter:'',
		init:function(){
				var self = this;
				var GHS = $('#'+self.prefix+'-name,#'+self.prefix+'-mobile');
				GHS.focus(function(){
				if ($(this).attr('tip') == $(this).val())$(this).val('');
				}).blur(function(){
				if (!$(this).val())$(this).val($(this).attr('tip'));
				});
				$('#'+self.prefix+'-submit').click(function(){
				   if (Trjcn.cache.submit)return;
				   var taname = $('#'+self.prefix+'-name'),
						 tamobile=$('#'+self.prefix+'-mobile'),
						_name   = taname.val(),
						_mobile = tamobile.val();
					if (!_name || _name == taname.attr('tip') )
					{
						 Trjcn.ui.alertb('请输入您的真实姓名');
						 taname.focus();
						 return;
					}
					if ( !Trjcn.Util.isChinese(_name))
					{
						 Trjcn.ui.alertb('请输入您的中文姓名');
						 taname.focus();
						 return;
					}
					if (!_mobile || !Trjcn.Util.isMobile(_mobile) )
					{
						 Trjcn.ui.alertb('请输入您的真实手机号码');
						 tamobile.focus();
						 return;
					}
					var param = 'type='+self.type+'&name='+_name+'&mobile='+_mobile+'&url='+self.url;
						param += '&message=&fromurl='+document.location.href;
					Trjcn.cache.submit = true;
					var _this = $(this);
					_this.html('正在提交中……');
					Trjcn.Ajax.post( '/api/guest/submit', param,function(res){
					   _this.html('立即预约');
					   Trjcn.cache.submit = false;
					   res.type='dialog';
						if (res.code)
						{
							var html = '<div class="subscribeDialog" id="subscribeDialog2">';
								 html  += '<ul><li><i class="icoCor32"></i></li>';
								 html  += '<li class="clr6">您的购买预约申请已成功提交，稍候将由投融界<br>高级理财师为您提供一对一服务！</li>';
								 html  += '<li><a href="javascript:;" onclick="Trjcn.cache.dialog.close();" class="yyBtnRed">确定</a></li>';
								 html  += '</ul></div>';
							try{
							   Trjcn.cache.dialog.close();
							}catch (e){}

							Trjcn.cache.dialog = $.dialog({
								title: '预约成功',
								lock:true,
								fixed:true,
								content: html,
								close:function(){
									Trjcn.cache.dialog = null;
								}
							});

							 GHS.val('').trigger('blur');
						}else
						{
							res.type = 'dialog';
							Trjcn.QP.callback(res);
						}
					});
		   });
	   },
	  initBox:function(){
		var self = this;
		var html ='<div class="subscribeDialog" id="subscribeDialog">';
			html +='<ul>';
			html +='<li><input type="text" class="text" value="真实姓名" tip="真实姓名" id="'+self.prefix+'-name" maxlength="20" ></li>';
			html +='<li><input type="text" class="text" value="手机号码" tip="手机号码" id="'+self.prefix+'-mobile" maxlength="11"></li>';
			html +='<li><a href="###" id="'+self.prefix+'-submit"  class="yyBtnRed">立即预约</a></li>';
			html +='<li class="clr6">预约成功后，将由投融界高级理财师为您提供一对一服务！</li>';
			html +='</ul>';
			html +='</div>';
		   $('a.T-online-order').click(function () {
			   Trjcn.cache.dialog = $.dialog({
				title: '预约咨询',
				lock:true,
				fixed:true,
				content: html,
				close:function(){
					Trjcn.cache.dialog = null;
				}
				});
				self.url = window.T_Config.baseUrl+'/trust/detail_'+$(this).attr('data-id')+'.html';
				self.init();
				self.initBoxAfter && self.initBoxAfter();
			});

	  },
	  follow:function(item_id,callback){
			Trjcn.Ajax.post(U('service/click.trust'),'id='+item_id,function(res){
			if (res.code==200)
			{
				if ( typeof callback == 'function' )
				{
					callback(res);return;
				}
				Trjcn.ui.alertb('关注成功');

			}else
			{
				Trjcn.ui.alertb(res.data.message || '关注失败，请重试');
			}
		},function(){
			Trjcn.ui.error('网络异常，请重试');
		});

	  }

	}
	return order;
}

function TrjcnMobileCode()
{

var MobileCode = {
	mobile:null,
	mobileId:null,
	mobileHand:null,
	mobileInfoHand:null,
	process:false,
	smsid:0,
	time:60,
	interval:function(){
		 var self = this,hand,_timestr = languages.codetime;
		  var _interval = function () {
				self.time = self.time - 1;
				if (self.time > 0)self.btn.html( _timestr.replace('[s]', self.time)).show();
				else
				{
					if (hand)clearInterval(hand);
					self.time = 60;
					self.btn.html(languages.mobile_btn);
					self.mobileInfoHand.html('<i class="icoCor16"></i>'+languages.mobile_code_ok2).css({'display':'block'});
					self.mobileInfoHand.attr('data-code-msg', languages.mobile_code_ok2);
					$('#T-'+self.mobileId+'-voice-df').show();
					self.btn.removeClass('gBtn22No');
					self.mobileHand.removeAttr('readonly');
				}
			}
			if (hand)clearInterval(hand);
			self.btn.addClass('gBtn22No');
			_interval();
			 hand = setInterval(_interval, 1000);
	},
	voice:function(){
		 var self = this;
		 if(!self.mobile || self.mobile != self.mobileHand.val() || !self.smsid || Trjcn.cache.voice)return;
		 Trjcn.cache.voice = true;
		 Trjcn.Ajax.post('/api/mobile_regcode_voice','smsid='+self.smsid,function(res){
			 Trjcn.cache.voice = false;
			 if(res.code==200)
			 {
				  var msg = '请准备接听来自0571-56660432的自动语音呼入电话';
				  self.mobileInfoHand.html('<i class="icoCor16"></i>'+msg).css({'display':'block'});
				  self.mobileInfoHand.attr('data-code-msg', msg);
				  self.mobileHand.attr('readonly');
				  $('#T-'+self.mobileId+'-voice-df').hide();
				  if(self.time == 60)self.interval();
			  };

		 });
	},
	init:function(mobile){
		var self = this;
		self.mobileId = mobile || 'mobile';
		var _code_info=$('#u-'+self.mobileId+'code-okinfo'),_mobile = $('#u-'+self.mobileId);
		self.mobileHand = _mobile;
		self.mobileInfoHand = $('#u-'+self.mobileId+'-okinfo');
		self.process=false;
		self.time = 60;
		$('#T-reg-'+self.mobileId+'-code').click(function(){
			if (self.time != 60 || self.process)return;
			var _this = $(this),_mobile_val=_mobile.val();
			if (!_mobile_val || !Trjcn.Util.isMobile(_mobile_val))
			{
				return;
			}

			self.btn = self.btntxt =  _this;
			if (_this.find('i').length==1)
			{
				self.btntxt = _this.find('i');
				languages.mobile_btn = self.btntxt.attr('label');
			}
			self.process = true;
			var success = function(res){
				  self.process = false;
				  self.mobileInfoHand.hide();
				 if(res.code == 200)
				 {
					  self.smsid = res.data.smsid;
					  self.mobile = _mobile_val;
					  self.mobileHand.attr('readonly', true);
				 }
				 else if (res.code == 203)
				 {
					 self.smsid = res.data.smsid;
					 self.mobile = _mobile_val;
					 self.mobileHand.attr('readonly', true);
					 self.time = parseInt(res.data.time);
				 }
				 else
				 {
					 self.mobileInfoHand.html('<i class="icoErr16"></i>'+res.data.error).show();
					 $('#T-'+self.mobileId+'-voice-info').hide();
					 return;
				 }
				 if (!res.data.smsid) languages.mobile_code_ok2 = languages.mobile_code_ok;
				 $('#T-'+self.mobileId+'-voice-info').show();
				 if(_code_info.length>0)
					  _code_info.html('<i class="icoCor16"></i>'+languages.mobile_code_ok2).show();
				 else
					  self.mobileInfoHand.html('<i class="icoCor16"></i>'+languages.mobile_code_ok2).css({'display':'block'});

				 self.mobileInfoHand.attr('data-code-msg', languages.mobile_code_ok2);
				 self.interval();

			 }

			var error = function(){
				  self.process = false;
				  self.mobileInfoHand.html('<i class="icoErr16"></i>'+languages.mobile_error).css({'display':'block'});
			 }
			Trjcn.Ajax.post("/api/mobile_regcode_send", "mobile="+_mobile_val, success, error);
		});

	}

}
return MobileCode;

}

function TrjcnLogin()
{
var oLogin={
	state:false,
	error_num:0,
	is_ustore:true,
	is_tip:true,
	hinfo:false,
	jump:true,
	ver:'',
	form:null,
	test:function(){ alert(this.error_num)
	},
	d:function(id){
		return $('#'+id, this.form);
	},
	init:function(id){
		this.form= $('#'+id);
		var self = this;
		if (self.is_ustore &&  typeof (USTORE)!='undefined'){
			USTORE.init();
			var _login_username = USTORE.getValue('login_username') || '';
		}
		if (_login_username)self.d('login_username').val(_login_username);

		self.d('yzimg_refresh').click(function(){
			self.d('yzimg').trigger('click');
		});
		if (self.is_tip)
		self.d('login_username').focus(function(){
			if ($(this).attr('tip') == $(this).val())$(this).val('');
		}).blur(function(){
			if (!$(this).val())$(this).val($(this).attr('tip'));
		}).trigger('blur');

		$('#login_yzcode,#login_password', self.form).bind('keypress',function(evt){
			var k=window.event?evt.keyCode:evt.which;
			if(k == 13)self.login();
		});

		self.d('btn-login').click(function(){
			self.login();
		});

	},
	after:function(){
		return true;
	},
	login:function(){
		var self = this,
			 _this=self.d('btn-login'),
			login_username = self.d('login_username').val(),
			login_password = self.d('login_password').val(),
			login_yzcode = self.d('login_yzcode').val();
		if (!login_username || login_username == self.d('login_username').attr('tip'))
		{
			self.login_msg('请输入用户名！');
			self.d('login_username').focus();
			return ;
		}
		if (!login_password)
		{
			self.login_msg('请输入密码！');
			return ;
		}

		if (self.error_num>=3 && !login_yzcode)
		{
			self.login_msg('请输入验证码！');
			return ;
		}
		self.login_msg();
		if (self.state === true)return;
		var success = function(res){
			 self.error_num = res.error_num;
			 if (res.code == 110){
				 location.href=res.forward;
				 return;
			 }else if(res.code == 200){
				 if (!self.after())return false;
				 if (self.is_ustore &&  typeof (USTORE)!='undefined')USTORE.setValue('login_username', login_username);
				 if (self.hinfo)
				 {
					 self.hinfo.html(res.data.user_info);
				 }
				 else if (self.jump)
				 {
					 if (window.T_Config && window.T_Config.page=='publish')
					 {
					   Trjcn.cache.dialog.close();
					   var pid = $('#T-cat-pid').val().substr(0,4);
					   Trjcn.LoginID = res.data.login_user_id;
					   $('#T-userid').val(res.data.login_user_id);
					   $('#userform').html('');
						return;
					 }

					 var forword_url = self.d('forword_url').val() || '';
					 location.href=forword_url ? forword_url : "/m/index.html";
				 }
				 else
				 {
					location.reload();
				 }
				 return;
			 }else{
				 self.login_msg(res.data.error_messages.result);
			 }
			 if (self.error_num>=3){
				 var _eurl = _this.attr('data-error-url');
				 if(_eurl)
				 {
					 location.href=_eurl;
					 return;
				 }
				 else
				 {
					 self.d('yzimg').trigger('click');
					 self.form.find('.J-yzm').show();
				 }
			 }
			  self.state = false;
			 _this.find('i').html('登录');
		}
		var error = function(){
			  self.state = false;
			 _this.find('i').html('登录');
			  self.login_msg('网络异常，请重试！');
		 }
		var is_auto_login = 0;
		if (self.d('is_auto_login').length==1)is_auto_login = self.d('is_auto_login').attr('checked');
		_this.find('i').html('正在登录中');
		Trjcn.Ajax.post("/login/check", "_=&type=box&username="+login_username+'&password='+login_password+'&login_yzcode='+login_yzcode+'&is_auto_login='+is_auto_login+'&ver='+self.ver, success, error);

	},

	login_tip:function(msg)
	{
		var self = this;
		if (msg)
			self.d('login-msg').html('<i class="icoErr16"></i>'+msg).show();
		else
			self.d('login-msg').hide();
	},
	login_msg:function(msg){
		this.login_tip(msg);
	}
}
return oLogin;
}

//已弃用 20131119
Trjcn.Login={
	state:false,
	error_num:0,
	is_ustore:true,
	is_tip:true,
	hinfo:false,
	jump:true,
	ver:'',
	form:null,
	d:function(id){
		return $('#'+id, this.form);
	},
	init:function(id){
		this.form= $('#'+id);
		var self = this;
		if (self.is_ustore &&  typeof (USTORE)!='undefined'){
			USTORE.init();
			var _login_username = USTORE.getValue('login_username') || '';
		}
		if (_login_username)self.d('login_username').val(_login_username);

		self.d('yzimg_refresh').click(function(){
			self.d('yzimg').trigger('click');
		});
		if (self.is_tip)
		self.d('login_username').focus(function(){
			if ($(this).attr('tip') == $(this).val())$(this).val('');
		}).blur(function(){
			if (!$(this).val())$(this).val($(this).attr('tip'));
		}).trigger('blur');

		$('#login_yzcode,#login_password', self.form).bind('keypress',function(evt){
			var k=window.event?evt.keyCode:evt.which;
			if(k == 13)self.login();
		});

		self.d('btn-login').click(function(){
			self.login();
		});

	},
	after:function(){
		return true;
	},
	login:function(){
		var self = this,
			 _this=self.d('btn-login'),
			login_username = self.d('login_username').val(),
			login_password = self.d('login_password').val(),
			login_yzcode = self.d('login_yzcode').val();
		if (!login_username || login_username == self.d('login_username').attr('tip'))
		{
			self.login_msg('请输入用户名！');
			self.d('login_username').focus();
			return ;
		}
		if (!login_password)
		{
			self.login_msg('请输入密码！');
			return ;
		}

		if (self.error_num>=3 && !login_yzcode)
		{
			self.login_msg('请输入验证码！');
			return ;
		}
		self.login_msg();
		if (self.state === true)return;
		var success = function(res){
			 self.error_num = res.error_num;
			 if (res.code == 110){
				 location.href=res.forward;
				 return;
			 }else if(res.code == 200){
				 if (!self.after())return false;
				 if (self.is_ustore &&  typeof (USTORE)!='undefined')USTORE.setValue('login_username', login_username);
				 if (self.hinfo)
				 {
					 self.hinfo.html(res.data.user_info);
				 }
				 else if (self.jump)
				 {
					 if (window.T_Config && window.T_Config.page=='publish')
					 {
					   Trjcn.cache.dialog.close();
					   var pid = $('#T-cat-pid').val().substr(0,4);
					   Trjcn.LoginID = res.data.login_user_id;
					   $('#T-userid').val(res.data.login_user_id);
					   $('#userform').html('');
						return;
					 }

					 var forword_url = self.d('forword_url').val() || '';
					 location.href=forword_url ? forword_url : "/m/index.html";
				 }
				 else
				 {
					location.reload();
				 }
				 return;
			 }else{
				 self.login_msg(res.data.error_messages.result);
			 }
			 if (self.error_num>=3){
				 var _eurl = _this.attr('data-error-url');
				 if(_eurl)
				 {
					 location.href=_eurl;
					 return;
				 }
				 else
				 {
					 self.d('yzimg').trigger('click');
					 self.form.find('.J-yzm').show();
				 }
			 }
			  self.state = false;
			 _this.find('i').html('登录');
		}
		var error = function(){
			  self.state = false;
			 _this.find('i').html('登录');
			  self.login_msg('网络异常，请重试！');
		 }
		var is_auto_login = 0;
		if (self.d('is_auto_login').length==1)is_auto_login = self.d('is_auto_login').attr('checked');
		_this.find('i').html('正在登录中');
		Trjcn.Ajax.post("/login/check", "type=box&username="+login_username+'&password='+login_password+'&login_yzcode='+login_yzcode+'&is_auto_login='+is_auto_login+'&ver='+self.ver, success, error);

	},

	login_tip:function(msg)
	{
		var self = this;
		if (msg)
			self.d('login-msg').html('<i class="icoErr16"></i>'+msg).show();
		else
			self.d('login-msg').hide();
	},
	login_msg:function(msg){
		this.login_tip(msg);
	}
}

Trjcn.Login.dialog = function()
{
	Trjcn.cache.login_msg = Trjcn.Login.login_msg;
	Trjcn.Login.login_msg = Trjcn.Login.login_tip;
	Trjcn.cache.dialog = $.dialog({
		title: "请登录",
		lock:true,
		fixed:true,
		width:'480px',
		close: function(){
			Trjcn.Login.login_msg = Trjcn.cache.login_msg;
			Trjcn.Login.form = $('#TP-login');
			Trjcn.cache.dialog = null;
		}
	});

   $.ajax({
	url: '/service/common.loginDialog',
	type:'POST',
	cache:false,
	data:'_=',
	success: function (data) {
		Trjcn.cache.dialog.content(data);
		Trjcn.cache.dialog.reset();
	}
  });
}

Trjcn.Login.lform = function(method,callback)
{
	Trjcn.cache.login_msg = Trjcn.Login.login_msg;
	Trjcn.Login.login_msg = Trjcn.Login.login_tip;
	Trjcn.cache.dialog = $.dialog({
		title: "请登录",
		lock:true,
		fixed:true,
		title:false,
		close: function(){
			Trjcn.Login.login_msg = Trjcn.cache.login_msg;
			Trjcn.Login.form = $('#TP-login');
			Trjcn.cache.dialog = null;
		}
	});

   $.ajax({
		url: '/service/common.loginDialog',
		type:'POST',
		cache:false,
		data:'_=&method='+(method || ''),
		success: function (data) {
			Trjcn.cache.dialog.content(data);
			Trjcn.cache.dialog.reset();
			callback && callback();
		}
	});
}

Trjcn.Login.regform = function(method,callback)
{
	Trjcn.cache.dialog = $.dialog({
		lock:true,
		fixed:true,
		title:false,
		width:'400px',
		close: function(){
			Trjcn.cache.dialog = null;
		}
	});

   $.ajax({
		url: '/service/common.regDialog',
		type:'POST',
		cache:false,
		data:'_=&method='+(method || ''),
		success: function (data) {
			Trjcn.cache.dialog.content(data);
			Trjcn.cache.dialog.reset();
			callback && callback();
		}
	});
}

Trjcn.Util = {

	createEditor:function(id,settings)
	{
		defaultSettings = {
			resizeMode : 1,
			designMode:true,
			//allowImageUpload : false,
			items : [
				'fontname', 'fontsize', '|', 'forecolor', 'hilitecolor', 'bold', 'italic', 'underline',
			'removeformat', '|', 'table', 'justifyleft', 'justifycenter', 'justifyright', 'insertorderedlist',
			'insertunorderedlist', '|', 'emoticons', 'image', 'link','fullscreen','wordpaste','source']
		};
		if (settings) $.extend(defaultSettings, settings);
		return KindEditor.create('#'+id, defaultSettings);
	},
	isMobile:function(mobile){
		return /^1(3[0-9]|4[0-9]|5[0-9]|7[0|6|7|8]|8[0-9])\d{8}$/.test( mobile );
	},
	isChinese:function(val){
		return /^[\u4E00-\u9FA5\uF900-\uFA2D]+$/.test(val);
	},
	isEmail:function(email){
		 return /^\w+((-\w+)|(\.\w+))*\@\w+((\.|-)\w+)*\.\w+$/.test( email );
	},
	isEmpty:function(val){
			  switch (typeof(val))
			  {
				case 'string':
				  return $.trim(val).length == 0 ? true : false;
				  break;
				case 'number':
				  return val == 0;
				  break;
				case 'object':
				  return val == null;
				  break;
				case 'array':
				  return val.length == 0;
				  break;
				default:
				  return true;
			  }
	}
}


Trjcn.Ajax = {
	dataType:'json',
	type:'POST',
	post:function(url,param,callback_success,callback_error){
		Trjcn.Ajax.type = 'POST';
		Trjcn.Ajax.request(url,param,callback_success,callback_error);
	},
	get:function(url,param,callback_success,callback_error){
		Trjcn.Ajax.type = 'GET';
		Trjcn.Ajax.request(url,param,callback_success,callback_error);
	},
	jsonp:function(url,param,callback_success,callback_error){

		$.ajax({
				 type: 'POST',
				 url: url,
				 dataType:'jsonp',
				 jsonp:'callback',
				 data:param,
				 success: function(res){
					  if (typeof(callback_success)=='function')callback_success(res);
				 },
				 error:function(res){
					  if (typeof(callback_error)=='function')callback_error(res);
				 }
		});
	},
	request:function(url,param,callback_success,callback_error){

		$.ajax({
				 type: Trjcn.Ajax.type,
				 url: url,
				 dataType:Trjcn.Ajax.dataType,
				 data:param,
				 success: function(res){
					  if (res.code==500){
						 //Trjcn.ui.alert('请先登录');
						 return;
					  }
					  if (typeof(callback_success)=='function')callback_success(res);
				 },
				 error:function(res){
					  if (typeof(callback_error)=='function')callback_error(res);
				 }
		});
	}

}


//*********

Trjcn.Core = {facebox:null}
Trjcn.Core.isLogin = function(){
	if (!Trjcn.LoginID)
	{
		Trjcn.Login.dialog();
		return false;
	}
	return true;
}

Trjcn.Core.enableLimitText = function(){
	$('textarea.LimitText').bind('keyup',function(){
		var _this = $(this);
			_val = _this.val(),
			len  = _this.attr('length') || _this.attr('maxlength'),
			mtip = _this.attr('mtip');
			var _n = parseInt(len)-_val.length;
			if (_n<0){
				if (!mtip)alert('内容超出规定范围，系统自动截取前'+len+'个字！');
				$(this).val(_val.substr(0,len));
			}else if (mtip){
				$('#'+mtip).html(_n);
			}
	}).removeClass('LimitText');
}


Trjcn.Core.bindTip = function(id){
	$('#'+id).focus(function(){
		if ($(this).attr('tip') == $(this).val())$(this).val('');
	}).blur(function(){
		if (!$(this).val())$(this).val($(this).attr('tip'));
	})
}
//*********


/**
 * 赞
 * id
 * callback	回调函数
 */
Trjcn.Core.zjxmclick=function(id, callback){
Trjcn.Ajax.post(U('service/click.zjxmclick'),'id='+id,function(res){
		if (res.code==200)
		{
			if ( typeof callback == 'function' )
			{
				callback(res);return;
			}
			$('#click_num_'+id).text(parseInt($('#click_num_'+id).text())+1);
			Trjcn.ui.alertb('赞成功，感谢您的支持');
		}else
		{
			Trjcn.ui.alertb(res.data.message || '操作失败，请重试');
		}
	},function(){
		Trjcn.ui.error('网络异常，请重试');
	});
}


/**
 * 赞
 * id
 * callback	回调函数
 */
Trjcn.Core.newsclick=function(id, callback){

	Trjcn.Ajax.post(U('service/click.newsclick'),'_&id='+id,function(res){
		if (res.code==200)
		{
			if ( typeof callback == 'function' )
			{
				callback(res);return;
			}
			$('#click_num_'+id).text(parseInt($('#click_num_'+id).text())+1);
			Trjcn.ui.success('赞成功，感谢您的支持');
		}else
		{
			Trjcn.ui.alert(res.data.message || '操作失败，请重试');
		}
	},function(){
		Trjcn.ui.error('网络异常，请重试');
	});
}


Trjcn.Core.newscommentclick=function(id,type, callback){

	Trjcn.Ajax.post(U('service/click.newscommentclick'),'_=&id='+id+'&type='+type,function(res){
		if (res.code==200)
		{
			if ( typeof callback == 'function' )
			{
				callback(res);return;
			}
			$('#click_num_'+id).text(parseInt($('#click_num_'+id).text())+1);
			Trjcn.ui.success('赞成功，感谢您的支持');
		}else
		{
			Trjcn.ui.alert(res.data.message || '操作失败，请重试');
		}
	},function(){
		Trjcn.ui.error('网络异常，请重试');
	});
}

Trjcn.Core.activityclick=function(id, callback){

	Trjcn.Ajax.post(U('service/click.activityclick'),'id='+id,function(res){
		if (res.code==200)
		{
			if ( typeof callback == 'function' )
			{
				callback(res);return;
			}
			Trjcn.ui.success('赞成功，感谢您的支持');
		}else
		{
			Trjcn.ui.alert(res.data.message || '操作失败，请重试');
		}
	},function(){
		Trjcn.ui.error('网络异常，请重试');
	});
}
/**
 * 回答
 * id
 * callback	回调函数
 */
Trjcn.Core.answerclick=function(ask_id,content, callback){
	if ( ! Trjcn.Core.isLogin() )
	{
		return;
	}
	Trjcn.Ajax.post(U('service/common.answerclick'),'ask_id='+ask_id+'&content='+content,function(res){
		if (res.code==200)
		{
			if ( typeof callback == 'function' )
			{
				callback(res);return;
			}
			//$('#click_num_'+id).text(parseInt($('#click_num_'+id).text())+1);
			Trjcn.ui.success('回答成功，待审核后就会显示出来');
		}else
		{
			Trjcn.ui.alert(res.data.message || '操作失败，请重试');
		}
	},function(){
		Trjcn.ui.error('网络异常，请重试');
	});
}

Trjcn.Core.AddFavorite = function(){
	var url = 'http://www.trjcn.com';
	var title = "投融界";
	if (document.all) {
		window.external.AddFavorite( url, title);
	} else if (window.sidebar) {
		window.sidebar.addPanel(title, url,"");
	} else if (window.opera && window.print) {
		var mbm = document.createElement('a');
		mbm.setAttribute('rel','sidebar');
		mbm.setAttribute('href',url);
		mbm.setAttribute('title',title);
		mbm.click();
	} else {
		alert("浏览器不支持直接加入收藏夹，请使用Ctrl+D进行收藏");
	}
}
Trjcn.Core.AddFavorite1 = function(){
	var url = 'http://www.trjcn.com';
	var title = "投融界";
	try
	{
		window.external.addFavorite(url, title);
	}
	catch (e)
	{
		try
		{
			window.sidebar.addPanel(title, url, "");
		}
		catch (e)
		{
			alert("您的浏览器不支持此操作，请使用Ctrl+D进行添加！");
		}
	}
}
Trjcn.Core.onlineserver = function(){
	$('.J_online_server').attr('href','http://chat.53kf.com/webCompany.php?arg=trjcn&style=1' ).attr('target','_blank').removeClass('J_online_server');
}
Trjcn.Core.toplogin = function(){
	var tplogin = $('#TP-login');
	if (tplogin.length==0)return;
	tplogin = new TrjcnLogin();
	tplogin.init('TP-login');
	tplogin.jump = false;
	tplogin.login_msg = function(msg){if(msg)alert(msg);};
	return;
}


Trjcn.Core.topsearch = function(){
	var btn = $('#T-search'),bar=$('#T-search-bar');
	if (btn.length==0)return;

	$('#T-search-label').mouseover(function(){
		bar.show();
	}).mouseout(function(){
		bar.hide();
	});
	bar.find('li').click(function(){
		var self = $(this);
		self.parent().prev().html(self.text()+'<i></i>');
		btn.attr('data-id', self.attr('data-id'));
	});
	var hosts = (document.location.host).split('.');
	delete hosts[0];
	Trjcn.cache.domain = hosts.join('.');
	btn.click(function(){
			var self = $(this);
			var _url,_param='',
			 _type  = self.attr('data-id'),
			_keyword = $('#T-keyword').val();
		 if (_keyword == $('#T-keyword').attr('tip'))_keyword = '';
		_keyword  = _keyword.replace(/`/g,'').replace(/'/g,'').replace(/"/g,'');
		_keyword = encodeURIComponent(_keyword);
		if (_type)location.href='http://s' + Trjcn.cache.domain + '?act='+_type+'&k='+_keyword;
	});
	$('#T-keyword').bind('keypress',function(evt){
		var k=window.event?evt.keyCode:evt.which;
		if(k == 13)btn.trigger('click');
	});
}



/**
 * 信息刷新
 * toid 编号
 */
Trjcn.Core.zjxmrefresh = function(toid){
	if ( ! Trjcn.Core.isLogin() )return;
	Trjcn.cache.dialog = $.dialog({
		title: "信息更新确认",
		lock:true,
		fixed:true,
		width:'426px',
		close:function(){
			Trjcn.cache.dialog = null;
		}
	});
	$.ajax({
		url: '/service/common.zjxmrefresh',
		data:'toid='+ toid,
		success: function (data) {
			Trjcn.cache.dialog.content(data);
			Trjcn.cache.dialog.reset();
		}
	  });
}


Trjcn.Core.newhand = function(self,act){
	if ( ! Trjcn.Core.isLogin() )return;
	Trjcn.Ajax.post('/service/common.newhand','act='+ act, function (res) {
		   $(self).parent().addClass('complete');
	});
}

//用户评价
Trjcn.Evaluate={}
/**
 * 评价弹出框
 * infoid 被评信息编号
 * fromtype 来源类型 1:项目，2：用户 3:资金
 * source 来源  1:收件箱 2:发件箱 3:我看过谁 4:谁看过我
 * source_id 来源id
 */
Trjcn.Evaluate.sendBox = function(infoid, fromtype,source,source_id){
	if ( ! Trjcn.Core.isLogin() )return;
	Trjcn.cache.dialog = $.dialog({
		title: "提交评价",
		lock:true,
		fixed:true,
		width:'426px',
		close:function(){
			Trjcn.cache.dialog = null;
		}
	});
	$.ajax({
		url: '/service/evaluate.post',
		data:'infoid='+infoid+'&fromtype='+fromtype+'&source='+source+'&source_id='+source_id,
		success: function (data) {
			Trjcn.cache.dialog.content(data);
			Trjcn.cache.dialog.reset();
		},
		cache: false
	});
}
Trjcn.Auth={}
Trjcn.Auth.sendBox = function(type,title){
	if ( ! Trjcn.Core.isLogin() )return;
	Trjcn.cache.dialog = $.dialog({
			title: title,
			lock:true,
			fixed:true,
			width:'426px',
			close:function(){
				Trjcn.cache.dialog = null;
			}
		});
	   $.ajax({
		url: '/service/authbox.post',
		data:'type='+type,
		success: function (data) {
			Trjcn.cache.dialog.content(data);
			Trjcn.cache.dialog.reset();
		},
		cache: false
	  });

}


//用户评价
Trjcn.Feedback={}

/**
 * 回应弹出框
 * toid 编号
 */

Trjcn.Feedback.sendBox = function(toid){
	 if ( ! Trjcn.Core.isLogin() || Trjcn.cache.dialog)
	{
		return;
	}
	Trjcn.cache.dialog = $.dialog({
			title: "信息投递确认",
			lock:true,
			fixed:true,
			width:'480px',
			close:function(){
				Trjcn.cache.dialog = null;
			}
		});
	   $.ajax({
		url: '/service/feedback.postold',
		dataType:'json',
		data:'id='+ toid,
		success: function (res) {
			if (res.code ==200)Trjcn.cache.dialog.content(res.data);
			if (res.code==500)Trjcn.cache.dialog.content('您的登录已失效，请刷新重新登录');
		},
		cache: false
	  });
}

Trjcn.Feedback.sendBoxV2 = function(toid){
	if ( ! Trjcn.LoginID )
	{
		Trjcn.Feedback.publishBox(toid,1);
		return;
	}
	if(Trjcn.cache.dialog)return;
	Trjcn.cache.dialog = $.dialog({
		title: "信息投递确认",
		lock:true,
		fixed:true,
		width:'480px',
		close:function(){
			Trjcn.cache.dialog = null;
		}
	});
	$.ajax({
		url: '/service/feedback.fbox',
		type:'POST',
		dataType:'json',
		data:'id='+ toid+'&type=1',
		success: function (res) {
			if (res.code ==200)
			{
				Trjcn.cache.dialog.content(res.data);
				Trjcn.cache.dialog.reset();
			}else
			{
				Trjcn.cache.dialog.close();
				Trjcn.ui.alertb(res.data);
			}
			if (res.code==500)Trjcn.cache.dialog.content('您的登录已失效，请刷新重新登录');
		},
		cache: false
	  });
}


Trjcn.Feedback.publishBox = function(toid,type){
	if(Trjcn.cache.dialog)return;
	Trjcn.cache.dialog = $.dialog({
		title: "填写投递信息",
		lock:true,
		fixed:true,
		title:false,
		close:function(){
			Trjcn.cache.dialog = null;
		}
	});
	$.ajax({
		url: '/service/feedback.postbox',
		type:'POST',
		dataType:'json',
		data:'id='+ toid+'&type='+type,
		success: function (res) {
			if (res.code ==200)
			{
				Trjcn.cache.dialog.content(res.data);
				Trjcn.cache.dialog.reset();
			}
		}
	  });
}


Trjcn.Feedback.sendZjxm = function(toid){
	if(Trjcn.cache.dialog)return;
	Trjcn.cache.dialog = $.dialog({
		title: "信息投递确认",
		lock:true,
		title:false,
		fixed:true,
		width:'480px',
		close:function(){
			Trjcn.cache.dialog = null;
		}

	});
	Trjcn.Ajax.post('/service/deliveryZjxm/fbox', 'zjxm='+ toid+'&type=1',function (res) {
		if (res.code ==200)
		{
			Trjcn.cache.dialog.content(res.data);
			Trjcn.cache.dialog.reset();
		}else
		{
			Trjcn.cache.dialog.close();
			Trjcn.ui.alertb(res.data);
		}
		if (res.code==500)Trjcn.cache.dialog.content('您的登录已失效，请刷新重新登录');
	});
}

Trjcn.Feedback.sendCompany = function(toid){
	location.href='/company_'+toid.replace('U','')+'.html';return;
	if(Trjcn.cache.dialog)return;
	 Trjcn.cache.dialog = $.dialog({
			title: "信息投递确认",
			lock:true,
			fixed:true,
			title:false,
			width:'480px',
		close:function(){
			   Trjcn.cache.dialog = null;
			}
		});
	Trjcn.Ajax.post('/service/deliveryCompany/fbox', 'company='+ toid+'&type=1',function (res) {
		if (res.code ==200)
		{
			Trjcn.cache.dialog.content(res.data);
			Trjcn.cache.dialog.reset();
		}else
		{
			Trjcn.cache.dialog.close();
			Trjcn.ui.alertb(res.data);
		}
		if (res.code==500)Trjcn.cache.dialog.content('您的登录已失效，请刷新重新登录');
	});
}

function animatenTop(thisTop,thisLeft) {
	var CopyDiv = '<a class="addDeliverBtn" style="position: absolute;z-index:999999;top:' + thisTop + 'px;left:' + thisLeft + 'px;"  id="FlyInToCart" >加入投递箱</a>';
	var cartbox = $("#T-cartbox").offset();
	$("body").append(CopyDiv);
	$("#FlyInToCart").animate({width: "30px",height: "30px","top": cartbox.top, "left": cartbox.left, "opacity": .1  }, 900, function(){
	$(this).remove()
	});
}

//投递购物车
Trjcn.Carts={}
Trjcn.Carts.getCartNum = function(){
	$('#J_cartNum').text(jQuery.cookie('TRJ_cartNum')||0);
}
Trjcn.Carts.sendBox = function(item_id,type,self){

	  Trjcn.Ajax.post('/service/cart.post', 'item_id='+item_id, function(res){
		if (res.code == 200)
		{
			if(type == 1)
			{
				Trjcn.ui.alertb('添加成功！')
				location.reload();
			}else{
				Trjcn.Carts.getCartNum();
				if(self)
				{
					self = $(self);
					var thisTop = self.offset().top; //所在位置的高度
					var thisLeft = self.offset().left; //所在位置的宽度
					animatenTop(thisTop, thisLeft);
				   return;
				}
				else
				{
				   Trjcn.ui.alertb('成功加入投递箱，投递箱共'+res.data.count+'条数据');
				}
			}

		}else{
			if(type ==2)
			{
				$('#TA-toolbar').show();
			}
			Trjcn.ui.alertb(res.data.message);
		}
	})
}






//发私信
Trjcn.Message={}
/**
 * 发送私信弹出框
 * touid 接收编号
 */
Trjcn.Message.sendBox = function(touid,toname){
	 if ( ! Trjcn.Core.isLogin() )
	 {
		  return;
	 }
	Trjcn.cache.dialog = $.dialog({
			title: "发私信",
			lock:true,
			fixed:true,
			width:'426px'
		});
	   $.ajax({
		dataType:'json',
		url: '/service/message.post',
		data:'id='+ touid+'&name='+encodeURIComponent(toname),
		success: function (res) {
		  if (res.code ==200)Trjcn.cache.dialog.content(res.data);
		  if (res.code==500)Trjcn.cache.dialog.content('您的登录已失效，请刷新重新登录');
		},
		cache: false
	  });
}


/**
 * 发送私信
 * message_to 接收用户名
 * message_content 发送内容
 * callback	回调函数
 */
Trjcn.Message.send = function(message_to, message_content, callback){
	if ( ! Trjcn.Core.isLogin() )return;
	if(message_to == "") {
		Trjcn.ui.alert("收信人不能为空");
		return false;
	}
	if(message_content == "") {
		Trjcn.ui.alert("内容不可为空");
		return false;
	}
	if (Trjcn.cache.sendMsg)return false;
	Trjcn.cache.sendMsg = true;
	Trjcn.Ajax.post(U('service/message.post'),{message_to:message_to, message_content:message_content},function(res){
		Trjcn.cache.sendMsg = false;
		if (res.code==200)
		{
			if ( typeof callback == 'function' )
			{
				callback(res);return;
			}
			Trjcn.ui.success('发送成功');
		}else
		{
//			 if(res.code == -2){
//				  if(Trjcn.cache.dialog)Trjcn.cache.dialog.close();
//				  Trjcn.Auth.sendBox(3,'发私信');
//			 }else{
				var msg = '';
				for(var name in res.data.error_messages){
				msg += res.data.error_messages[name]+"\n";
				}
				if (Trjcn.cache.dialog)Trjcn.cache.dialog.close();
				Trjcn.ui.alert(msg);
//			}


		}
	},function(){
		Trjcn.cache.sendMsg = false;
		Trjcn.ui.error('发送失败');
	});

}

/**
 * 删除我的私信对话
 * id 单条对话编号
 * callback	回调函数
 */
Trjcn.Message.delMsg = function(id, callback){
	if(id == "") {
		Trjcn.ui.alert("请选择要删除的对话！");
		return false;
	}
	if ( ! Trjcn.Core.isLogin() )return;

	Trjcn.ui.confirm('确定要删除该条私信吗？', function () {
		 Trjcn.Ajax.post(U('service/message.delmsg'),{id:id},function(res){
			if (res.code==200)
			{
				if ( typeof callback == 'function' )
				{
					callback(res);return;
				}
				Trjcn.ui.success('删除成功');
			}else
			{
				Trjcn.ui.alert('删除失败');
			}
		},function(){
			Trjcn.ui.error('删除失败');
		});
   });



}

/**
 * 删除我的私信对话列表
 * list_id  对话列表编号
 * callback	回调函数
 */
Trjcn.Message.delList = function(list_id, callback){
	if(list_id == "") {
		Trjcn.ui.alert("请选择要删除的私信！");
		return false;
	}
	if ( ! Trjcn.Core.isLogin() )return;
	Trjcn.ui.confirm('确定要删除该条私信吗？', function () {
		 Trjcn.Ajax.post(U('service/message.dellist'),{list_id:list_id},function(res){
			if (res.code==200)
			{
				if ( typeof callback == 'function' )
				{
					callback(res);return;
				}
				Trjcn.ui.success('删除成功');
			}else
			{
				Trjcn.ui.alert('删除失败');
			}
		},function(){
			Trjcn.ui.error('删除失败');
		});
   });



}

//商友
Trjcn.businesscard = {}
/**
 * 我的商友列表
 * callback	回调函数
 */
Trjcn.businesscard.get=function(callback){
	if ( ! Trjcn.Core.isLogin() )return;
	Trjcn.Ajax.post(U('service/businesscard.get'),'',function(res){
		if (res.code==200)
		{
			if ( typeof callback == 'function' )callback(res);
		}else
		{
			Trjcn.ui.alert('人脉拉取失败');
		}
	},function(){
		Trjcn.ui.error('人脉拉取失败');
	});
}


/**
 * 申请交换名片
 * uid	会员编号
 * callback	回调函数
 */
Trjcn.businesscard.exchange=function(uid, callback){
	if ( ! Trjcn.Core.isLogin() )
	{
		return
	};
	Trjcn.Ajax.post(U('service/businesscard.exchange'),'uid='+uid,function(res){
		if (res.code==200)
		{
			try{Trjcn.QP.baidu();}catch(err){}
			if ( typeof callback == 'function' )
			{
			   if (res.data.message)alert(res.data.message);
			   callback(res);return;
			}
			Trjcn.ui.success('交换名片申请成功');
		}else{
			if(res.code == -2){
				Trjcn.Auth.sendBox(2,'交换名片');
			}else{
				Trjcn.ui.alert(res.data.message || '交换失败，请重试');
		   }
		}
	},function(){
		Trjcn.ui.error('网络异常，请重试');
	});
}

Trjcn.businesscard.bind = function(btn){
if (Trjcn.cache.businesscardbind)return;
Trjcn.cache.businesscardbind= true;
	 btn = btn || ".J-exchange";
	$(btn).live('click',function(){
		var _this   = $(this);
		Trjcn.businesscard.exchange( _this.attr('data-id'),function(res){
			if (res.data.status==1)
			{
				_this.unbind('click').addClass('swapBtn3').removeClass('btn').removeClass('swapBtn1').removeClass('swapBtn').html('相互关注');
				_this.parent().parent().parent().addClass('orangeBg');
			}
			else
			{
				_this.unbind('click').addClass('swapBtn2').removeClass('btn').removeClass('swapBtn1').removeClass('swapBtn').html('已关注');
				_this.parent().parent().parent().addClass('yellowBg');
			}
		} )
	})
}


/**
 * 取消关注商友
 * item_id	商友编号 多个,号分割
 * callback	回调函数
 */
Trjcn.businesscard.unfollow=function(uid, callback){
	 if ( ! Trjcn.Core.isLogin() )return;
	if (Trjcn.LoginID == uid)
	{
		alert('自己都不认识自己啦！');
		return;
	}
	 Trjcn.Ajax.post(U('service/businesscard.unfollow'),'uid='+uid,function(res){
		if (res.code==200)
		{
			if ( typeof callback == 'function' )
			{
				callback(res);return;
			}
			Trjcn.ui.success('关注取消成功');

		}else
		{
			Trjcn.ui.alert(res.data.message || '关注取消失败，请重试');
		}
	},function(){
		Trjcn.ui.error('网络异常，请重试');
	});
}


//各个评论接口
Trjcn.comment={}

/**
 * 资金项目评论
 * item_id	资金项目编号
 * content	评论内容
 * callback	回调函数
 */
Trjcn.comment.zjxm=function(info_id, content,email_remind, callback){

	this.post('zjxm', info_id, content,email_remind, callback);
}

Trjcn.comment.news=function(info_id, content,email_remind, callback){
	this.post('news', info_id, content,email_remind, callback);
}

Trjcn.comment.zhiku=function(info_id, content,email_remind, callback){

	this.post('zhiku', info_id, content,email_remind, callback);
}

Trjcn.comment.post=function(type,info_id, content,email_remind, callback){
	 if ( ! Trjcn.Core.isLogin() ){
		 return;
	 }
	 email_remind = email_remind || 0;
	 Trjcn.Ajax.post(U('rest/comment/'+type),'_=&type='+type+'&item_id='+info_id+'&content='+content+'&email_remind='+email_remind,function(res){
		if (res.code==200)
		{
			try{Trjcn.QP.baidu();}catch(err){}
			if ( typeof callback == 'function' )
			{
				callback(res);return;
			}
			Trjcn.ui.success('评论发表成功，等待审核！');
		}else
		{
			Trjcn.ui.alert(res.data.message || '评论失败，请重试');
		}
	},function(){
		Trjcn.ui.error('网络异常，请重试');
	});
}



//各个关注接口
Trjcn.follow={}



/**
 * 关注资金项目
 * item_id	资金项目编号
 * callback	回调函数
 */
Trjcn.follow.zjxm=function(item_id, callback){
	 if ( ! Trjcn.Core.isLogin() )
	 {
		  return;
	 }

	 Trjcn.Ajax.post(U('service/follow.zjxm'),'item_id='+item_id,function(res){
		if (res.code==200)
		{
			if ( typeof callback == 'function' )
			{
				callback(res);return;
			}
			Trjcn.ui.alertb('关注成功');

		}else
		{
			Trjcn.ui.alertb(res.data.message || '关注失败，请重试');
		}
	},function(){
		Trjcn.ui.error('网络异常，请重试');
	});
}


/**
 * 关注资金项目
 * item_id	资金项目编号
 * callback	回调函数
 */
Trjcn.follow.trust=function(item_id, callback){
	 if ( ! Trjcn.Core.isLogin() )
	 {
		  return;
	 }

	 Trjcn.Ajax.post(U('service/follow.trust'),'item_id='+item_id,function(res){
		if (res.code==200)
		{
			if ( typeof callback == 'function' )
			{
				callback(res);return;
			}
			Trjcn.ui.alertb('关注成功');

		}else
		{
			Trjcn.ui.alertb(res.data.message || '关注失败，请重试');
		}
	},function(){
		Trjcn.ui.error('网络异常，请重试');
	});
}



Trjcn.Reg = {
	mobileCode:function(mobile,method){
		var mobile = mobile || 'mobile';
		var _ok_info=$('#u-'+mobile+'-okinfo'),_code_info=$('#u-'+mobile+'code-okinfo'),_mobile = $('#u-'+mobile);
		var tt = 60,hand = '',process=false;
		$('#T-reg-'+mobile+'-code').click(function(){
			if (tt != 60 || process)return;
			var _this = $(this),_mobile_val=_mobile.val();
			if (!_mobile_val || !Trjcn.Util.isMobile(_mobile_val))
			{
				return;
			}

			var _timec =  _this;
			if (_this.find('i').length==1)
			{
				_timec = _this.find('i');
				languages.mobile_btn = _timec.attr('label');
			}
			var _timestr = languages.codetime;

			process = true;

			var success = function(res){
				  process = false;
				  _ok_info.hide();
				 if(res.code == 200)
				 {
					 //_ok_info.html('<i class="icoCor16"></i>'+languages.codetime2).show();
				 }
				 else if (res.code == 203)
				 {
					 tt = parseInt(res.data.time);
				 }
				 else
				 {

					 _ok_info.html('<i class="icoErr16"></i>'+res.data.error).show();
					 return;
				 }
				 if(_code_info.length>0)
					  _code_info.html('<i class="icoCor16"></i>'+languages.mobile_code_ok).show();
				 else
					  _ok_info.html('<i class="icoCor16"></i>'+languages.mobile_code_ok).show();
				 if (hand)clearInterval(hand);
				 var _interval = function () {
					tt = tt - 1;
					if (tt > 0)_timec.html( _timestr.replace('[s]', tt)).show();
					else
					{
						if (hand)clearInterval(hand);
						tt = 60;
						_timec.html(languages.mobile_btn);
						_this.removeClass('gBtn22No');
					}
				};
				_this.addClass('gBtn22No');
				_interval();
				hand = setInterval(_interval, 1000);
			 }

			var error = function(){
				process = false;
				_ok_info.html('<i class="icoErr16"></i>'+languages.mobile_error).show();
			}
			Trjcn.Ajax.post("/api/mobile_regcode_send", "mobile="+_mobile_val+'&method='+(method||''), success, error);
		});

	}

}


Trjcn.Core.quick_pulish = function(){
	var els = $('#QS-form .field');

	$('#QS-infotype,#QS-usertype').change(function(){
		if ($(this).val()==0)
			$(this).addClass('bdrError');
		else
			$(this).removeClass('bdrError');
	});
	var showerror = function(id,msg){
		if (!$('#'+id).next().is('.tips'))
		   $('#'+id).after('<div class="tips"><a href="javascript:;">×</a>'+msg+'</div>').next('.tips').find('a').click(function(){
			$(this).parent().remove();
		});
	}
	//发送验证码
	var _mobile = $('#QS-mobile');
	var tt = 60,hand = '',process=false,status = 'reg';
	$('#QS-getcode').click(function(){
		if (Trjcn.LoginID)
		{
			alert('您已登录，无需验证，请直接点击立即发布！');
			return;
		}
		if (tt != 60 || process)return;

		var _this = $(this),_mobile_val=_mobile.val();
		if (!(_mobile_val.length == 11 && Trjcn.Util.isMobile(_mobile_val)))
		{
			showerror('QS-mobile', '请输入真实的手机号码');
			return;
		}

			 var _timec = _this.find('i'),
			process = true,
			success = function(res){
			 process = false;
			if(res.code == 200)
			{
				alert('验证码已发送');
			}
			else if (res.code == 203)
			{
				tt = parseInt(res.data.time);
			}
			else if (res.code == 202)
			{
				alert('您的手机号码已注册，请直接输入密码登录！');
				$('#QS-passwd').show().focus().siblings().hide();
				Trjcn.cache.qsmobile = _mobile_val;
				status = 'login';
				return;
			}
			else
			{
				alert(res.data.error);
				if (res.code ==204)return;
			}

		if (hand)clearInterval(hand);
		var _interval = function () {
			tt = tt - 1;
			if (tt > 0)_timec.html(tt+'秒后重新发送');
			else
			{
				if (hand)clearInterval(hand);
				tt = 60;
				_timec.html('免费获取验证码');
				_this.removeClass('gBtn22No');
			}
		};
		_interval();
		_this.addClass('gBtn22No');
		hand = setInterval(_interval, 1000);
	}

		var error = function(){
		 process = false;
		 alert('网络异常，请重试');
	 }

		Trjcn.Ajax.post("/api/reg/mobilecode", "mobile="+_mobile_val+'&method=publishquick', success, error);

	});

	els.blur(function(){
		var self = $(this),
			_val = self.val();
			_id  = self.attr('id');
		if (Trjcn.LoginID)
		{
			if (_id == 'QS-mobilecode'){
				self.next('tips').hide();
			}
		}
		if(_id == 'QS-mobile' && status == 'login' && _val != Trjcn.cache.qsmobile)
		{
			$('#QS-passwd').hide().siblings().show().end().siblings('.tips').remove();
			status = 'reg';
		}
		if (!_val || _val == self.attr('tip'))
		{
			showerror(_id, '请输入'+self.attr('label'));
		}
		else if (self.attr('valid') == 'username' && !new RegExp(regexEnum.ps_username, 'i').test(_val))
		{
			showerror(_id,'请输入真实的姓名');
		}
		else if (self.attr('valid') == 'mobile' && !Trjcn.Util.isMobile(_val))
		{
			showerror(_id,'请输入真实的手机号码');
		}else
		{
			 self.next('.tips').hide();
		}
	});
	Trjcn.cache.qsloading = false;
	$('#QS-submit').click(function(){
		var param = '',msg = '';
		els.filter(':visible').each(function(){
			var _val = $(this).val();
				_id  = $(this).attr('id');
			if (Trjcn.LoginID)
			{
				if (_id == 'QS-mobilecode')return;
			}
			if (!_val || _val == $(this).attr('tip'))
			{
				msg += '1';
				showerror(_id, '请输入'+$(this).attr('label'));
			}
			else if ($(this).attr('valid') == 'username' && !new RegExp(regexEnum.ps_username, 'i').test(_val))
		   {
				msg += '1';
				 showerror(_id,'请输入真实的姓名');
		   }
			else if ($(this).attr('valid') == 'mobile' && !Trjcn.Util.isMobile(_val))
			{
				msg += '1';
				showerror(_id,'请输入真实的手机号码');
			}
			else
			{
				$(this).next('.tips').remove();
				param += _id.replace('QS-','')+'='+_val+'&';
			}
		});
		$('#QS-infotype,#QS-usertype').each(function(){
			var _val = $(this).val();
			if (_val==0)
			{
				msg += '1';
				$(this).addClass('bdrError');
				return;
			}
			param += $(this).attr('id').replace('QS-','')+'='+_val+'&';
		});

		if (msg)
		{
			return false;
		}
		var quick_save = function(){
			Trjcn.Ajax.post("/item_publish_quick/quick_save", param, function(res){
					 if(typeof res.data.error_messages!='undefined')
					{
						var msg = '';
						for(var name in res.data.error_messages){
							msg += res.data.error_messages[name]+'\r\n';
						}
						alert(msg);
						return;
					}
					if(res.code == 200)
					{
						alert('信息已发布成功');
						els.filter(':visible').each(function(){
							$(this).val('').trigger('blur');
						});
						$('#QS-form .tips').remove();
						Trjcn.cache.qsloading = false;
						try{Trjcn.QP.baidu();}catch(err){}
						return;
						location.href='/item_publish_quick/success.html?id='+res.data.id+'&type='+res.data.type;
					}

				 }, error);
		}
		if(Trjcn.cache.qsloading)return;
		Trjcn.cache.qsloading = true;

		quick_save();
		return;

		if (Trjcn.LoginID)
		{
			quick_save();
			return;
		}

		if (status == 'login')
		{

			var login_error_num = 0;
			var success = function(res){
				Trjcn.cache.qsloading = false;
				if (res.code == 200)
				{
					Trjcn.LoginID = res.data.login_user_id;
					quick_save();
					return;
				}

				login_error_num = res.error_num;
				if (login_error_num>=3)
				{
					alert('您连续三次密码错误！');
					location.href=window.T_Config.baseUrl+'/login.html';
				}
				alert(res.data.error_messages.result);
			}


			var _pwd = $('#QS-passwd').val();
			var _mobile_val = $('#QS-mobile').val();
			if (login_error_num>=3)
			{
				alert('您连续三次密码错误！');
				return ;
			}
			Trjcn.Ajax.post("/login/check", "username="+_mobile_val+'&password='+_pwd+'&login_yzcode=&is_auto_login=0&ver='+Trjcn.Login.ver, success, error);

			return;
		}
		if (!Trjcn.LoginID)
		{

			var _code = $('#QS-mobilecode').val();
			if (!_code)
			{
				alert('请输入您手机收到的验证码');
				return false;
			}
		}
		var error  = function(){
			 Trjcn.cache.qsloading = false;
			 alert('网络异常，请重试！');
		 }

		 var success  = function(res){
				Trjcn.cache.qsloading = false;
				if(res.code == 200)
				{
					Trjcn.LoginID = res.data.login_user_id;
					quick_save();
				}
				else
				{
					if(typeof res.data.error_messages!='undefined')
					{
						var msg = '';
						for(var name in res.data.error_messages){
							msg += res.data.error_messages[name]+'\r\n';
						}
						alert(msg);
						return;
					}
				}
		}
		param += '&method=publishquick';
		Trjcn.Ajax.post("/api/reg/submit", param, success, error);
});

}

Trjcn.Core.company_comment = function(){
  	if ( ! Trjcn.Core.isLogin() )return;
	$('#form').submit();
}

Trjcn.Core.quick_reg = function(){
	   var els = $('#MP-form .field');
	   $('input[name="MP-type"]').click(function(){
		   $('#MP-industryid option:first').html($(this).val()==1 ? '请选择所属行业' : '请选择投资行业')

	   });
	   $('#MP-industryid,#MP-jobid').change(function(){
			if ($(this).val()==0)
				$(this).addClass('bdrError');
			else
				$(this).removeClass('bdrError');
		});
	var showerror = function(id,msg){
		if (!$('#'+id).next().is('.tips'))
		   $('#'+id).after('<div class="tips"><a href="javascript:;">×</a>'+msg+'</div>').next('.tips').find('a').click(function(){
			$(this).parent().remove();
		});
	}
	//发送验证码
	var _mobile = $('#MP-mobile');
	var _name = $('#MP-name');
	var tt = 60,hand = '',process=false,status = 'reg';
	$('#MP-getcode').click(function(){
		if (Trjcn.LoginID)
		{
			alert('您的名片已发布');
			return;
		}
		if (tt != 60 || process)return;

		var _this = $(this),_mobile_val=_mobile.val();
		if (!(_mobile_val.length == 11 && Trjcn.Util.isMobile(_mobile_val)))
		{
			showerror('MP-mobile', '请输入真实的手机号码');
			return;
		}



			 var _timec = _this.find('i'),
			process = true,
			success = function(res){
			 process = false;
			if(res.code == 200)
			{
				alert('验证码已发送');
			}
			else if (res.code == 203)
			{
				tt = parseInt(res.data.time);
			}
			else if (res.code == 202)
			{
				alert('您的手机号码已被TA人使用');
				return;
			}
			else
			{
				alert(res.data.error);
				if (res.code == 204)return;
			}

		if (hand)clearInterval(hand);
		var _interval = function () {
			tt = tt - 1;
			if (tt > 0)_timec.html(tt+'秒后重新发送');
			else
			{
				if (hand)clearInterval(hand);
				tt = 60;
				_timec.html('验证手机号码');
				_this.removeClass('gBtn22No');
			}
		};
		_interval();
		_this.addClass('gBtn22No');
		hand = setInterval(_interval, 1000);
	}

		var error = function(){
		 process = false;
		 alert('网络异常，请重试');
	 }

		Trjcn.Ajax.post("/api/reg/mobilecode", "mobile="+_mobile_val+'&method=publishquick', success, error);

	});


	$('#MP-submit').click(function(){
		if (Trjcn.LoginID)
		{
			alert('您的名片已发布');
			return;
		}
		if (Trjcn.cache.mploading)return;
		var param = '',msg = '';
		els.filter(':visible').each(function(){
			var _val = $(this).val();
				_id  = $(this).attr('id');

			if (!_val || _val == $(this).attr('tip'))
			{
				msg += '1';
				showerror(_id, '请输入'+$(this).attr('label'));
			}
			else if ($(this).attr('valid') == 'mobile' && !Trjcn.Util.isMobile(_val))
			{
				msg += '1';
				showerror(_id,'请输入真实的手机号码');
			}
			else if ($(this).attr('valid') == 'chinese' && !Trjcn.Util.isChinese(_val))
			{
				msg += '1';
				showerror(_id,'请输入您的中文姓名');
			}
			else
			{
				$(this).next('.tips').remove();
				param += _id.replace('MP-','')+'='+_val+'&';
			}
		});
		$('#MP-industryid,#MP-jobid').each(function(){
			var _val = $(this).val();
			if (_val==0)
			{
				msg += '1';
				$(this).addClass('bdrError');
				return;
			}
			param += $(this).attr('id').replace('MP-','')+'='+_val+'&';
		});

		if (msg)
		{
			return false;
		}

		var _code = $('#MP-mobilecode').val();
		if (!_code)
		{
			alert('请输入您手机收到的验证码');
			return false;
		}
		var error  = function(){
			 Trjcn.cache.mploading=false;
			 alert('网络异常，请重试！');
		 }

		 var success  = function(res){
			   Trjcn.cache.mploading=false;
				if(res.code == 200)
				{
					location.href= window.T_Config.baseUrl+'/register/success.html';
				}
				else
				{
					if(typeof res.data.error_messages!='undefined')
					{
						var msg = '';
						for(var name in res.data.error_messages){
							msg += res.data.error_messages[name]+'\r\n';
						}
						alert(msg);
						return;
					}
				}
		}
		Trjcn.cache.mploading=true;
		param += '&jobname='+$('#MP-jobid option:selected').text()+'&type='+$('input[name="MP-type"]:checked').val()+'&method=regquick';
		Trjcn.Ajax.post("/api/reg/submit", param, success, error);
});

}






Trjcn.Core.zjxm_view_reg = function(){
	var regfrm = new formValidator();
	regfrm.init('ZD-frm');
	regfrm.okhide=true;
	var login_error_num = 0;

	//发送验证码
	var _mobile = $('#ZD-mobile');
	var _mobilecode = $('#ZD-mobilecode');
	var _yzcode = $('#ZD-yzcode');
	var tt = 60,hand = '',process=false,status = 'reg';
	var loginmsg=function(msg){
		 $('#ZD-msg').html(msg).show();
	}
		var loginbox = function(){
			if(typeof(isQuery)=="undefined"){
				Trjcn.cache.zdact = 'login';
				loginmsg('您的手机号码已注册，请直接输入密码登录！');
				$('#ZD-reg').hide();
				//$('#ZD-login').show();
				$('#ZD-mobile').next().hide();
				$('#ZD-submit').find('i').html('立即登录');
			}
			else{
				loginmsg('您的手机号码已注册，请直接登录查询！');
			}
		}

	_yzcode.blur(function(){
		 if (!_yzcode.val())
		{
			regfrm.tip(_yzcode, 'icoErr16', '请输入验证码');
			return;
		}
		regfrm.hidetip(_yzcode);
	});
	$('#ZD-pwd').focus(function(){
	   $(this).nextAll('.tipsText').hide();
	}).blur(function(){
	   if ($(this).val()=='')$(this).nextAll('.tipsText').show();
	}).nextAll('.tipsText').click(function(){
	   $(this).hide();
	   $(this).prevAll('input').focus();
	});


	_mobile.change(function(){
		 Trjcn.cache.action = 'zjxm_view_reg';
		 $('#ZD-msg').hide();
		 if(Trjcn.cache.zdact == 'login')
		 {
			 $('#ZD-reg').show();
			 //$('#ZD-login').hide();
			 Trjcn.cache.zdact = 'reg';
		$('#ZD-submit').find('i').html('立即提交');
		 }
	}).blur(function(){
	   if (!_mobile.val() || !Trjcn.Util.isMobile(_mobile.val() ) )
	   {
			regfrm.tip(_mobile, 'icoErr16', '手机号码格式不正确');
			return;
	   }
	   if (Trjcn.cache.zdact == 'login')return;
		var success = function(res)
		{
			Trjcn.cache.zdclick = true;
			if (res.code == 200)
			{
				regfrm.tip(_mobile, 'icoCor16');
			}
			else if (res.code == 202)
		{
			loginbox();
		}
		}
		Trjcn.Ajax.post("/api/reg/formcheck", "type=mobile&mobile="+_mobile.val(), success,function(){
			Trjcn.cache.zdclick = true;
		});
	});

	_mobilecode.blur(function(){
	   if (!_mobile.val() || _mobile.val() == _mobile.attr('tip'))
	   {
			regfrm.tip(_mobile, 'icoErr16', '请输入手机号码');
			return;
	   }
	   if (!_mobilecode.val() || _mobilecode.val() == _mobilecode.attr('tip'))
	   {
			regfrm.tip(_mobilecode, 'icoErr16', '请输入短信验证码');
			return;
	   }

		var success = function(res)
		{
			if (res.code == 200)
			{
				regfrm.tip(_mobilecode, 'icoCor16');
			}
			else
		{
			regfrm.tip(_mobilecode, 'icoErr16', res.data.error);
		}
		}
		Trjcn.Ajax.post("/api/reg/formcheck", "type=mobilecode&mobile="+_mobile.val()+'&mobilecode='+_mobilecode.val(), success);
	});

	$('#ZD-getcode').click(function(){
		if (Trjcn.LoginID)
		{
			location.reload();
			return;
		}
		if (tt != 60 || process || Trjcn.cache.zdclick!==true)return;

		var _this = $(this),_mobile_val=_mobile.val();
		if (!(_mobile_val.length == 11 && Trjcn.Util.isMobile(_mobile_val)))
		{
			_mobile.trigger('blur');
			return;
		}

			 var _timec = _this.find('i'),
			process = true,
			success = function(res){
			process = false;
			if(res.code == 200)
			{
				regfrm.tip(_mobile, 'icoCor16', '验证码已发送');
			}
			else if (res.code == 203)
			{
				tt = parseInt(res.data.time);
			}
			else if (res.code == 202)
			{
				loginbox();
				return;
			}
			else
			{
				loginmsg(res.data.error);
				if (res.code == 204)return;
			}

		if (hand)clearInterval(hand);
		var _interval = function () {
			tt = tt - 1;
			if (tt > 0)_timec.html(tt+'秒后重新发送');
			else
			{
				if (hand)clearInterval(hand);
				tt = 60;
				_timec.html('免费获取验证码');
				_this.removeClass('gBtn34No');
			}
		};
		_interval();
		_this.addClass('gBtn34No');
		hand = setInterval(_interval, 1000);
	}

		var error = function(){
		 process = false;
		 loginmsg('网络异常，请重试');
	 }

		Trjcn.Ajax.post("/api/reg/mobilecode", "mobile="+_mobile_val+'&from=zjxmdetail', success, error);

	});


	$('#ZD-submit').click(function(){
		if (Trjcn.LoginID)
		{
			location.reload();
			return;
		}
		var _mobile_val = _mobile.val();
		if (Trjcn.cache.zdloading)return;
		var param = '',msg = '';

		var error  = function(){
			 Trjcn.cache.zdloading=false;
			 loginmsg('网络异常，请重试！');
		 }
		 var success  = function(res){
			   Trjcn.cache.zdloading=false;
				if(res.code == 200)
				{
					location.reload();
					return;
				}
				else
				{
					regfrm.errors(res.data.error_messages);
				}
		}
		if (Trjcn.cache.zdact == 'login')
		{
			var success = function(res){
				Trjcn.cache.zdloading = false;
				if (res.code == 200)
				{
					location.reload();
					return;
				}

				login_error_num = res.error_num;
				if (login_error_num>=3)
				{
				   $('#ZD-code').show();
					$('#ZD-codeimg').trigger('click');
				}
				loginmsg(res.data.error_messages.result);
			}


			var _pwd_val = $('#ZD-pwd').val();

			if (!_mobile_val || !_pwd_val)return;

			var _yzcode_val= _yzcode.val();
			if (_yzcode.attr('tip') == _yzcode_val)
			{
			   _yzcode_val = '';
			}
			if (login_error_num>=3)
			{
				if (!_yzcode_val)
				{
					regfrm.tip(_yzcode, 'icoErr16', '请输入验证码');
					return;
				}
			}
			Trjcn.cache.zdloading=true;
			Trjcn.Ajax.post("/login/check", "username="+_mobile_val+'&password='+_pwd_val+'&login_yzcode='+_yzcode_val+'&is_auto_login=0&ver='+Trjcn.Login.ver, success, error);

			return;
		}

		//	return
		var _mobilecode_val  = _mobilecode.val();
		var password = $('#ZD-pwd').val();
		if (!_mobilecode_val || !_mobile_val || !password)
		{
			return;
		}
		Trjcn.cache.zdloading=true;
		param = 'mobile='+_mobile.val()+'&mobilecode='+_mobilecode_val+'&password='+password+'&method=zjxmdetail';
		if(typeof(isQuery)=="undefined"){
		Trjcn.Ajax.post("/api/reg/submit", param, success, error);
		}else{
			window.location.href='/order.html?mobile='+_mobile.val()
		}
});

}


Trjcn.QP = {}
Trjcn.QP.callback  = function(res){
if (res.type && $.dialog)
{
	 if (res.type == 'dialoga' && res.code==200)
	 {
		var hosts = (document.location.host).split('.');
		delete hosts[0];
		var domain = hosts.join('.');
		   var html = '<div id="applyPrompt" class="hide p10" style="display: block;">';
		html  += '<p class="p10 ac">您已成功申请交换联系方式，稍候我们会将对方合作意向告知您</p>';
		html  += '<p class="p10 ac"><a href="http://www'+domain+'/register.html" class="bBtn22"><i class="bBtn22Inner">立即注册</i></a>&nbsp;&nbsp;&nbsp;&nbsp;<a href="javascript:;" onclick="Trjcn.cache.dialog.close()" class="gBtn22"><i class="gBtn22Inner">取 消</i></a></p>';
		html  += '</div>';
		 Trjcn.cache.dialog = $.dialog({
			title:'申请提示',
			lock:true,
			fixed:true,
			content: html
		});

	 }else{
		 Trjcn.cache.dialog = $.dialog({
			title:'系统提示',
			lock:true,
			fixed:true,
			content: res.data.message
		});
	 }
}
else
{
	if(res.data.message){
		alert(res.data.message);
	}
}

}
Trjcn.QP.baidu=function(){
$('body').append('<iframe src="'+window.T_Config.baseUrl+'/h/bd.html" style="display:none;"></iframe>');
}
Trjcn.QP.GJguest = function(){
   var GHS = $('#GJ-name,#GJ-mobile,#C-content');
	GHS.focus(function(){
	if ($(this).attr('tip') == $(this).val())$(this).val('');
	}).blur(function(){
	if (!$(this).val())$(this).val($(this).attr('tip'));
	});

   $('#C-submit').click(function(){
   if (Trjcn.cache.submit)return;
   var taname = $('#GJ-name'),
		 tamobile=$('#GJ-mobile'),
		 tmessage=$('#C-content'),
		_name   = taname.val(),
		_mobile = tamobile.val(),
		_message = tmessage.val();
	if (!_name || _name == taname.attr('tip') )
	{
		 Trjcn.ui.alertb('请输入您的姓名');
		 taname.focus();
		 return;
	}
	if ( !Trjcn.Util.isChinese(_name))
	{
		 Trjcn.ui.alertb('请输入您的中文姓名');
		 taname.focus();
		 return;
	}
	if (!_mobile || !Trjcn.Util.isMobile(_mobile) )
	{
		 Trjcn.ui.alertb('请输入您的真实手机号码');
		 tamobile.focus();
		 return;
	}
	if (!_message )
	{
		 Trjcn.ui.alertb('请输入您的留言内容');
		 tmessage.focus();
		 return;
	}
	var param = 'type=umessage&name='+_name+'&mobile='+_mobile+'&url=';
		param += '&message='+_message+'&fromurl='+document.location.href;
	if(Trjcn.cache.imgcode)
	{
		param+= '&imgcode='+Trjcn.cache.imgcode;
	}
	Trjcn.cache.submit = true;
	Trjcn.Ajax.post( '/api/guest/submit', param,function(res){
	   Trjcn.cache.submit = false;

		Trjcn.QP.callback(res);
		if (res.code==200)
		{
			Trjcn.cache.imgcode = '';
			try{Trjcn.QP.baidu();}catch(err){}
			GHS.val('').trigger('blur');
		}else if(res.code == 100){
			Trjcn.contact.ui('C-submit',0);
		}else if(res.code == 101){
			Trjcn.contact.ui('C-submit',1);
			Trjcn.cache.imgcode = '';
		}
	});

   });
}
Trjcn.QP.GHchange = function(){
   var GHS = $('#GH-name,#GH-mobile');
	GHS.focus(function(){
	if ($(this).attr('tip') == $(this).val())$(this).val('');
	}).blur(function(){
	if (!$(this).val())$(this).val($(this).attr('tip'));
	});

   $('#GH-submit').click(function(){
   if (Trjcn.cache.submit)return;
   var taname = $('#GH-name'),
		 tamobile=$('#GH-mobile'),
		_name   = taname.val(),
		_mobile = tamobile.val();
	if (!_name || _name == taname.attr('tip') )
	{
		 Trjcn.ui.alertb('请输入您的姓名');
		 taname.focus();
		 return;
	}
	if ( !Trjcn.Util.isChinese(_name))
	{
		 Trjcn.ui.alertb('请输入您的中文姓名');
		 taname.focus();
		 return;
	}
	if (!_mobile || !Trjcn.Util.isMobile(_mobile) )
	{
		 Trjcn.ui.alertb('请输入您的真实手机号码');
		 tamobile.focus();
		 return;
	}
	var param = 'type=businesscard&name='+_name+'&mobile='+_mobile+'&url=';
		param += '&message=&fromurl='+document.location.href;
	if(Trjcn.cache.imgcode)
	{
		param+= '&imgcode='+Trjcn.cache.imgcode;
	}
	Trjcn.cache.submit = true;
	Trjcn.Ajax.post( '/api/guest/submit', param,function(res){
	   Trjcn.cache.submit = false;
		Trjcn.QP.callback(res);
		if (res.code==200)
		{
			Trjcn.cache.imgcode = '';
			try{Trjcn.QP.baidu();}catch(err){}
			GHS.val('').trigger('blur');
		}else if(res.code == 100){
			Trjcn.contact.ui('GH-submit',0);
		}else if(res.code == 101){
			Trjcn.contact.ui('GH-submit',1);
			Trjcn.cache.imgcode = '';
		}
	});

   });
}
Trjcn.QP.GGmessage = function(){
	var hosts = (document.location.host).split('.');
	delete hosts[0];
	var domain = hosts.join('.');
	var html ='<div id="messageDialog">';
		html +='<div class="publicForm">';
		html +='<dl><dt><i>*</i>您的姓名：</dt><dd><input type="text" class="text w230" value="" id="GG-name" maxlength="10"></dd></dl>';
		html +='<dl><dt><i>*</i>手机号码：</dt><dd><input type="text" class="text w230"  value="" maxlength="11" id="GG-mobile"></dd></dl>';
		html +='<dl><dt><i>*</i>留言内容：</dt><dd><textarea rows="4" class="textarea w260 LimitText" id="GG-message" maxlength="300"></textarea></dd></dl>';
		html +='<dl><dt>&nbsp;</dt><dd class="w270"><span class="fr mt5">已有账号<a href="http://www'+domain+'/login.html">请登录</a></span><a href="###" onclick="Trjcn.QP.GGsubmit()" class="bBtn34"><i class="bBtn34Inner">立即提交</i></a></dd></dl>';
		html +='</div>';
		html +='</div>';
	   $('a.message_dialog').live('click', function () {
		   Trjcn.cache.dialog = $.dialog({
			title: '给TA留言',
			lock:true,
			fixed:true,
			content: html
			});
			Trjcn.Core.enableLimitText();
			Trjcn.cache.touid = $(this).attr('data-id');
		});
}
Trjcn.QP.GGsubmit = function()
{
	if (Trjcn.cache.submit)return;
	var taname = $('#GG-name'),
		 tamobile=$('#GG-mobile'),
		 tmessage=$('#GG-message'),
		_name   = taname.val(),
		_mobile = tamobile.val(),
		_message = tmessage.val();
	if (!_name || _name == taname.attr('tip') )
	{
		 alert('请输入您的姓名');
		 taname.focus();
		 return;
	}
	if ( !Trjcn.Util.isChinese(_name))
	{
		 alert('请输入您的中文姓名');
		 taname.focus();
		 return;
	}
	if (!_mobile || !Trjcn.Util.isMobile(_mobile) )
	{
		 alert('请输入您的真实手机号码');
		 tamobile.focus();
		 return;
	}
	if (!_message )
	{
		 alert('请输入您的留言');
		 tmessage.focus();
		 return;
	}
	var param = 'type=businesscard.umessage&name='+_name+'&mobile='+_mobile+'&url=';
		param += '&message='+_message+'&fromurl='+document.location.href+'&uid='+Trjcn.cache.touid;
	Trjcn.cache.submit = true;
	Trjcn.Ajax.post( '/api/guest/submit', param,function(res){
	   Trjcn.cache.submit = false;
		Trjcn.cache.dialog.close();
		Trjcn.QP.callback(res);
		if (res.code==200)
		{
			try{Trjcn.QP.baidu();}catch(err){}
		}
	});
}

Trjcn.contact = {};
Trjcn.contact.ui=function(clickname,is_empty){
	var html = '';
	if(is_empty == 1){
		html = '<div id="exchangeCardDialog"><p class="pl10 pb5 clr6">您的网络申请过于频繁请输入验证码后再提交！</p><p class="p10"><input type="text" id="contact_code" value="" maxlength="4"><img onclick="this.src=\''+window.T_Config.baseUrl+'/util/captcha.html?\'+Math.random()" src="'+window.T_Config.baseUrl+'/util/captcha.html?0.8796358851250261" height="22"><a href="javascript:;" class="bBtn22" onclick="Trjcn.contact.submit(\''+clickname+'\');"><i class="bBtn22Inner">立即交换</i></a></p><p class="pl10 red" id="contact_code_error">验证码不正确</p></div>';
	}else{
		html = '<div id="exchangeCardDialog"><p class="pl10 pb5 clr6">您的网络申请过于频繁请输入验证码后再提交！</p><p class="p10"><input type="text" id="contact_code" value="" maxlength="4"><img onclick="this.src=\''+window.T_Config.baseUrl+'/util/captcha.html?\'+Math.random()" src="'+window.T_Config.baseUrl+'/util/captcha.html?0.8796358851250261" height="22"><a href="javascript:;" class="bBtn22" onclick="Trjcn.contact.submit(\''+clickname+'\');"><i class="bBtn22Inner">立即交换</i></a></p><p class="pl10 red hide" id="contact_code_error"></p></div>';
	}
	Trjcn.cache.dialog = $.dialog({
		title:'网络',
		lock:true,
		fixed:true,
		content: html
	});

}
Trjcn.contact.submit = function(clickname)
{
	Trjcn.cache.imgcode = $('#contact_code').val();
	if(Trjcn.cache.imgcode.length == 0){
		$('#contact_code_error').text('验证码格式不正确');
		$('#contact_code_error').show();
		return;
	}else{
		$('#contact_code_error').text('');
		$('#contact_code_error').hide();
		Trjcn.cache.dialog.close();
	}
	$('#'+clickname).trigger('click');
}

Trjcn.QP.TAtoolbar=function(){
$('.GTIP').focus(function(){
if ($(this).attr('tip') == $(this).val())$(this).val('');
}).blur(function(){
if (!$(this).val())$(this).val($(this).attr('tip'));
});
$('#TA-submit').click(function(){
var taname = $('#TA-name'),
	 tamobile=$('#TA-mobile'),
	_name   = taname.val(),
	_mobile = tamobile.val();
if (!_name || _name == taname.attr('tip') )
{
	 Trjcn.ui.alertb('请输入您的姓名');
	 taname.focus();
	 return;
}
if ( !Trjcn.Util.isChinese(_name))
{
	 Trjcn.ui.alertb('请输入您的中文姓名');
	 taname.focus();
	 return;
}
if (!_mobile || !Trjcn.Util.isMobile(_mobile) )
{
	 Trjcn.ui.alertb('请输入您的真实手机号码');
	 tamobile.focus();
	 return;
}
var param =  'type=toolbar&name='+_name+'&mobile='+_mobile+'&fromurl='+document.location.href;
if(Trjcn.cache.imgcode)
{
	param+= '&imgcode='+Trjcn.cache.imgcode;
}
Trjcn.Ajax.post( '/api/guest/submit', param,function(res){
	Trjcn.QP.callback(res);
	if (res.code ==200)
	{
		Trjcn.cache.imgcode = '';
		$('#TA-toolbar').remove();
		try{Trjcn.QP.baidu();}catch(err){}
	}else if(res.code == 100){
		Trjcn.contact.ui('TA-submit',0);
	}else if(res.code == 101){
		Trjcn.contact.ui('TA-submit',1);
		Trjcn.cache.imgcode = '';
	}
});
});

}


Trjcn.Core.QApublish = function(pre){
	var getid = function(id){
		return $('#'+pre+'-'+id);
	}
	var els = getid('form .field');
	var isreg = false;
	//发送验证码
	var _mobile = getid('mobile');
	var tt = 60,hand = '',process=false,status = 'reg';
	getid('getcode').click(function(){
		if (Trjcn.LoginID)
		{
			alert('您已登录，无需验证，请直接点击立即发布！');
			return;
		}
		if (tt != 60 || process)return;

		var _this = $(this),_mobile_val=_mobile.val();
		if (!(_mobile_val.length == 11 && Trjcn.Util.isMobile(_mobile_val)))
		{
			alert('请输入真实的手机号码');
			_mobile.focus();
			return;
		}

			 var _timec = _this;
			process = true,
			success = function(res){
			 process = false;
			if(res.code == 200)
			{
				alert('验证码已发送');
			}
			else if (res.code == 203)
			{
				tt = parseInt(res.data.time);
			}
			else if (res.code == 202)
			{
				alert('您的手机号码已注册，请直接输入密码登录！');
				getid('passwd').show().focus().siblings().hide();
				Trjcn.cache.qsmobile = _mobile_val;
				status = 'login';
				return;
			}
			else
			{
				alert(res.data.error);
				if (res.code ==204)return;
			}

		if (hand)clearInterval(hand);
		var _interval = function () {
			tt = tt - 1;
			if (tt > 0)_timec.html(tt+'秒');
			else
			{
				if (hand)clearInterval(hand);
				tt = 60;
				_timec.html('免费获取');
				_this.removeClass('btnYzmNo');
			}
		};
		_interval();
		_this.addClass('btnYzmNo');
		hand = setInterval(_interval, 1000);
	}

		var error = function(){
		 process = false;
		 alert('网络异常，请重试');
		}

		Trjcn.Ajax.post("/api/reg/mobilecode", "mobile="+_mobile_val+'&method=publishquick', success, error);

	});

	Trjcn.cache.qsloading = false;
	getid('submit').click(function(){
		var param = '',msg = new Array();
		els.filter(':visible').each(function(){
			var _val = $(this).val();
				_id  = $(this).attr('id');
			if (Trjcn.LoginID)
			{
				if (_id == pre+'-mobilecode')return;
			}
			if (!_val || _val == $(this).attr('tip'))
			{
				msg.push('请输入'+$(this).attr('label'));
			}
			else if ($(this).is(':visible') && $(this).attr('valid') == 'username' && !new RegExp(regexEnum.ps_username, 'i').test(_val))
		   {
				msg.push('请输入真实的姓名');
		   }
			else if ($(this).attr('valid') == 'mobile' && !Trjcn.Util.isMobile(_val))
			{
				msg.push('请输入真实的手机号码');
			}
			else
			{
				param += _id.replace(pre+'-','')+'='+_val+'&';
			}
		});

		if (msg.length>0)
		{
			alert(msg.join("\n"));
			return false;
		}
		var quick_save = function(){
			Trjcn.Ajax.post("/item_publish_quick/quick_save", param, function(res){
					 if(typeof res.data.error_messages!='undefined')
					{
						var msg = '';
						for(var name in res.data.error_messages){
							msg += res.data.error_messages[name]+'\r\n';
						}
						alert(msg);
						return;
					}
					if(res.code == 200)
					{
						var url ='/item_publish_quick/success.html?id='+res.data.id+'&type='+res.data.type;
						if(isreg)
						{
						   url += '&from=reg';
						}
						location.href= url;
					}

				 }, error);
		}
		if(Trjcn.cache.qsloading)return;
		Trjcn.cache.qsloading = true;


		if (Trjcn.LoginID)
		{
			quick_save();
			return;
		}

		if (status == 'login')
		{
			var login_error_num = 0;
			var success = function(res){
				Trjcn.cache.qsloading = false;
				if (res.code == 200)
				{
					Trjcn.LoginID = res.data.login_user_id;
					quick_save();
					return;
				}

				login_error_num = res.error_num;
				if (login_error_num>=3)
				{
					alert('您连续三次密码错误！');
					location.href=window.T_Config.baseUrl+'/login.html';
				}
				alert(res.data.error_messages.result);
			}


			var _pwd = getid('passwd').val();
			var _mobile_val = getid('mobile').val();
			if (login_error_num>=3)
			{
				alert('您连续三次密码错误！');
				return ;
			}
			Trjcn.Ajax.post("/login/check", "username="+_mobile_val+'&password='+_pwd+'&login_yzcode=&is_auto_login=0&ver='+Trjcn.Login.ver, success, error);

			return;
		}
		if (!Trjcn.LoginID)
		{

			var _code = getid('mobilecode').val();
			if (!_code)
			{
				alert('请输入您手机收到的验证码');
				return false;
			}
		}
		var error  = function(){
			 Trjcn.cache.qsloading = false;
			 alert('网络异常，请重试！');
		 }

		 var success  = function(res){
				Trjcn.cache.qsloading = false;
				if(res.code == 200)
				{
					Trjcn.LoginID = res.data.login_user_id;
					isreg = true;
					quick_save();
				}
				else
				{
					if(typeof res.data.error_messages!='undefined')
					{
						var msg = '';
						for(var name in res.data.error_messages){
							msg += res.data.error_messages[name]+'\r\n';
						}
						alert(msg);
						return;
					}
				}
		}
		param += '&method=zjxmview';
		Trjcn.Ajax.post("/api/reg/submit", param, success, error);
});

}




$(function(){
	if ($('#T-search-label').length==1)
	{
		Trjcn.Core.topsearch();//搜索框
		if(window.T_Config)
		{
			var page = window.T_Config.page;
			switch(page)
			{
				case 'businesscard':
					page = 'company';
					break;
			}
			$('#T-search-bar li[data-id="'+page+'"]').trigger('click');
		}
	}

	if ($('#TP-login').length>0)
	{
	   Trjcn.Core.toplogin();//头部登录
	}

	$(".trjbar .select").hoverClass("hover");
	$(".nav>li").hoverClass("hover");
	$(".searchSelect").hoverClass("hover");
	Trjcn.Core.onlineserver();


	$('#DY-submit').click(function(){
		var _email = $('#DY-email').val();
		if (_email && Trjcn.Util.isEmail(_email))
		{
			Trjcn.Ajax.post("/api/rss/email", 'email='+_email, function(res){
				if (res.code == 200)
				{
					alert('订阅成功！');
				}else if (res.code == 201)
				{
					alert('您输入的邮箱地址之前已订阅过投融信息！');
				}
				else
				{
					alert('订阅失败，请重试！');
				}
			}, function(){
			 alert('网络异常，请重试！');
			});

		}
		else
		{
			alert('请输入您正常使用电子邮箱！');
		}

	});

	$('.TIPS').focus(function(){
		var _this = $(this);
		if ( _this.val() == _this.attr('tip') )_this.val('').css({'color':'#333'});
	}).blur(function(){
	var _this = $(this);
	if ( _this.val() == '' )_this.val( _this.attr('tip') ).css({'color':'#999'});
	}).css({'color':'#999'});

	$('textarea.LimitText').bind('keyup',function(){
		var _val = $(this).val();
		var len  = $(this).attr('length') || $(this).attr('maxlength');
		var _n = parseInt(len)-_val.length;
		if (_n<0)
		{
			alert('内容超出规定范围，系统自动截取前'+len+'个字！');
			$(this).val(_val.substr(0,len));
		}
	});


	$('#T-publish-xiangmu,#T-publish-zijin,#T-publish-xiangmu-a,#T-publish-zijin-a').click(function(){
			 //if (Trjcn.LoginID)return true;
			 if (Trjcn.LoginID)
			 {
				  location.href = $(this).attr('vhref');
				  return true;
			 }
			 var _url = $(this).attr('url');
			 var _title = $(this).attr('title');

			Trjcn.cache.dialog = $.dialog({
				title: _title,
				lock:true,
				fixed:true,
				width:'250px'
			});
		   $.ajax({
			url: _url,
			cache:false,
			success: function (data) {
				Trjcn.cache.dialog.content(data);
				Trjcn.cache.dialog.reset();
			}
		  });
	});

})

/*在线客服*/
$(function(){
	var _this =$('#J-online-server'),
		_this_parent = $('#J-online-server_parent'),
		//_width = _this.width(),
		//_height= _this.height(),
		//_win_w = $(window).width(),
		//_win_h = $(window).height(),
		_in_url = window.location.href,
		_no_online = '/m/,/login,register,/order/success/,chinabank,/register/success,/user_cert/'
		_is = _no_online.split(',')
		;
		for(var i=0; i<_is.length;i++){
			if(_in_url.indexOf(_is[i]) > 0){
				_this_parent.html("");
			}
		}

	$('.onlineClose', _this).click(function(){
		_this.hide();
		_this = null;
	});
	//$(window).scroll(function(e){
		//if (_this)_this.animate({ left:_win_w-_width-10,top: (_win_h/2+$(document).scrollTop()-_height/2)+40},{queue:false,duration: 1000}, 5000);
	//});
	//$(window).resize(function(){
		//_win_w = $(window).width();
		//_win_h = $(window).height();
		//if (_this)_this.css({left: _win_w-_width-10,top: (_win_h/2+$(document).scrollTop()-_height/2)+40});
	//});
	//_this.css({ left:_win_w-_width-10,top: (_win_h/2+$(document).scrollTop()-_height/2)+40}).show();

	Trjcn.Core.QApublish('QA');
})

$.fn.bxCarousel = function(options) {
	var defaults = {
		move: 4,
		display_num: 4,
		speed: 500,
		margin: 0,
		auto: false,
		auto_interval: 3000,
		auto_dir: 'next',
		auto_hover: false,
		next_text: 'next',
		next_image: '',
		prev_text: 'prev',
		prev_image: '',
		controls: true
	};
	var options = $.extend(defaults, options);
	return this.each(function() {
		var $this = $(this);
		var li = $this.find('li');
		var first = 0;
		var fe = 0;
		var last = options.display_num - 1;
		var le = options.display_num - 1;
		var is_working = false;
		var j = '';
		var clicked = false;
		li.css({
			'float': 'left',
			'listStyle': 'none',
			'marginRight': options.margin
		});
		var ow = li.outerWidth(true);
		wrap_width = (ow * options.display_num) - options.margin;
		var seg = ow * options.move;
		$this.wrap('<div class="bx_container"></div>').width(999999);
		if (options.controls) {
			if (options.next_image != '' || options.prev_image != '') {
				var controls = '<a href="javascript:;" class="prev"><img src="' + options.prev_image + '"/></a><a href="javascript:;" class="next"><img src="' + options.next_image + '"/></a>'
			} else {
				var controls = '<a href="javascript:;" class="prev">' + options.prev_text + '</a><a href="javascript:;" class="next">' + options.next_text + '</a>'
			}
		}
		$this.parent('.bx_container').wrap('<div class="bx_wrap"></div>').before(controls);
		var w = li.slice(0, options.display_num).clone();
		var last_appended = (options.display_num + options.move) - 1;
		$this.empty().append(w);
		get_p();
		get_a();
		$this.css({
			'position': 'relative',
			'left': -(seg)
		});
		$this.parent().siblings('.next').click(function() {
			slide_next();
			clearInterval(j);
			clicked = true;
			return false
		}).mouseout(function(){
			auto_silde();
		});
		$this.parent().siblings('.prev').click(function() {
			slide_prev();
			clearInterval(j);
			clicked = true;
			return false
		}).mouseout(function(){
			auto_silde();
		});
		var auto_silde = function(){
			if (options.auto) {
				start_slide();
				if (options.auto_hover && clicked != true) {
					$this.find('li').live('mouseenter',
					function() {
						if (!clicked) {
							clearInterval(j)
						}
					});
					$this.find('li').live('mouseleave',
					function() {
						if (!clicked) {
							start_slide()
						}
					})
				}
			}
		}
		auto_silde();
		function start_slide() {
			if (options.auto_dir == 'next') {
				j = setInterval(function() {
					slide_next()
				},
				options.auto_interval)
			} else {
				j = setInterval(function() {
					slide_prev()
				},
				options.auto_interval)
			}
		}
		function slide_next() {
			if (!is_working) {
				is_working = true;
				set_pos('next');
				$this.animate({
					left: '-=' + seg
				},
				options.speed,
				function() {
					$this.find('li').slice(0, options.move).remove();
					$this.css('left', -(seg));
					get_a();
					is_working = false
				})
			}
		}
		function slide_prev() {
			if (!is_working) {
				is_working = true;
				set_pos('prev');
				$this.animate({
					left: '+=' + seg
				},
				options.speed,
				function() {
					$this.find('li').slice( - options.move).remove();
					$this.css('left', -(seg));
					get_p();
					is_working = false
				})
			}
		}
		function get_a() {
			var str = new Array();
			var lix = li.clone();
			le = last;
			for (i = 0; i < options.move; i++) {
				le++
				if (lix[le] != undefined) {
					str[i] = $(lix[le])
				} else {
					le = 0;
					str[i] = $(lix[le])
				}
			}
			$.each(str,
			function(index) {
				$this.append(str[index][0])
			})
		}
		function get_p() {
			var str = new Array();
			var lix = li.clone();
			fe = first;
			for (i = 0; i < options.move; i++) {
				fe--
				if (lix[fe] != undefined) {
					str[i] = $(lix[fe])
				} else {
					fe = li.length - 1;
					str[i] = $(lix[fe])
				}
			}
			$.each(str,
			function(index) {
				$this.prepend(str[index][0])
			})
		}
		function set_pos(dir) {
			if (dir == 'next') {
				first += options.move;
				if (first >= li.length) {
					first = first % li.length
				}
				last += options.move;
				if (last >= li.length) {
					last = last % li.length
				}
			} else if (dir == 'prev') {
				first -= options.move;
				if (first < 0) {
					first = li.length + first
				}
				last -= options.move;
				if (last < 0) {
					last = li.length + last
				}
			}
		}
	})

}


$(function(){
	Trjcn.Carts.getCartNum();
	$("#go-top").each(function(){
		var top = $(this);
		$(window).scroll(function () {
	        if($(window).scrollTop() >= 300)//距离顶部多少高度显示按钮
	        {
	            top.css('display','block')
	        }else
	        {
	            top.css('display','none');
	        }
	    });

		top.click(function(){
	        $('body,html').animate({scrollTop:0},500);
	        return false;
	    });
	});
	

//	$('img.TAA').each(function(){
//	var self=$(this),pos = self.offset();
//	var code = $(this).attr('data-code');
//	var html= $('<a class="trjcnAa" href="'+window.T_Config.baseUrl+'/advert/place/index.html?code='+code+'" target=_blank></a>');
//	$("body").append(html);
//	var init = function(){
//		html.css({'top':(pos.top+self.height()-html.height()),'left':(pos.left+self.width()-html.width()-20)});
//	}
//	init();
//	$(window).resize(function(){
//		pos = self.offset();
//		init();
//	});
//	$('#top-banner .topClose').click(function(){
//		pos = self.offset();
//		init();
//	});
//	html.show()
//		.mouseover(function(){
//			$(this).html('我也要出现在这里');
//			init();
//		}).mouseout(function(){
//			$(this).html('');
//			init();
//		});
//	});

})

