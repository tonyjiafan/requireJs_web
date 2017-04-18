var ModuleName = 'login';

define(ModuleName, ['base', 'jquery', 'layer'], function (Page, $, layer) {
	'use strict';
	Page.prototype[ModuleName] = function () {
		var _this = this;
		this.no_login = true;
		_this.cookie().del('logined');
		_this.cookie().del('session_id');
		_this.cookie().del('select_1');
		_this.cookie().del('select_2');
		layer.config({
				path: '../../js/lib/layer/'
			});
		var verificationCodeText,
			login_form = $('.login_form'),
			retrieve_form = $('.retrieve_form'),
			retrieve_info = $('.retrieve_info');

		$('body').on('click', '.forget_pw', function () {
			login_form.hide();
			retrieve_form.show();
		})
		$('body').on('click', '.back_login', function () {
			login_form.show();
			retrieve_form.hide();
		})
		//获取验证码图片
		$('#mi_ma').on('click', function () {
			_this.fetch("/mjson/login/securitycode",{}, function(res){
				$('#validate_code').html('<img src="data:image/jpg;base64,' + res.data.image + ' ">');
			}, function () {
				layer.msg("找不到资源")
			});
		});
		$('#validate_code').on('click', function(){
			$('#mi_ma').trigger('click');
		});
		//找回密码
		$('body').on('click', '.retrieve_form .login_Btn', function () {
			var username = $('#retrieve_user_name').val(),
				password = $('#retrieve_user_password').val();
			if (username && password !== '') {
				if (password.toLocaleLowerCase() == verificationCodeText.toLocaleLowerCase()) {
					var data = {};
					data.login = username;
					// data.password = password;
					var jsonData = JSON.stringify(data)
					$.ajax({
						type: "GET",
						url: "/mjson/login/securitycode.json",
						dataType: "json",
						data: jsonData,
					}).done(function (res) {
						if (res.code == 0) {
							$('#retrieve_code_text').text('验证邮件已发送到您的邮箱：' + res.data.email)
							login_form.hide();
							retrieve_form.hide();
							retrieve_info.show();
						} else {

						}
					});
				} else {
					$('#retrieve_text_info').html('验证码错误').css({
						'visibility': 'inherit',
						'color': '#Fc5144'
					})
				}
			} else {
				$('#retrieve_text_info').html('用户名或验证码不能为空').css({
					'visibility': 'inherit',
					'color': '#Fc5144'
				})
			}
		})
		//返回登录界面
		$('body').on('click', '.retrieve_info .login_Btn', function () {
			location.reload()
		})
		//登录
		function loginFn(){
				var username = $('#user_name').val(),
						password = $('#user_password').val();
				if (username && password !== '') {
					var data = {};
					data.username = username;
					data.password = password;
					_this.fetch_login('/mjson/login', data, function (res) {
						if (res.code == 0) {
							var cookie = _this.cookie();
							cookie.set("session_id", res.data.session_id, 1000*30);
							cookie.set("logined", true, 1000*30);
							var layerLoading = layer.msg('跳转中...', {icon: 16,shade: 0.6});
							var redirectUrl = _this.getQueryString('redirect');  //获取登录过期时的页面url地址
							if(redirectUrl !== null){
								setTimeout(function(){
									location.href = redirectUrl;
								},1000)
							} else {
								setTimeout(function(){
									location.href = "./index.html";
								},1500)
							}
						} else {
							layer.msg('用户名或密码错误', {
								offset: 'c',
								anim: 6,
								icon: 2,
								shade: 0.5
								});
							$('#login_text_info').html('用户名或密码错误').css({
								'visibility': 'inherit',
								'color': '#Fc5144'
							})
						}
					});
				} else {
					layer.msg('用户名或密码不能为空', {
							offset: 'c',
							anim: 6,
							icon: 3,
							shade: 0.5
						});
					$('#login_text_info').html('用户名或密码不能为空').css({
						'visibility': 'inherit',
						'color': '#Fc5144'
					})
				}
			}

		$('body').on('click', '.login_form .login_Btn', function () {
			loginFn();
		})

		$(document).keydown(function(e){
			if(e.keyCode == 13){
				loginFn();
			}
		});

		return this;

	};
	return Page;
});
