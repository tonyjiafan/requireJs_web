var ModuleName = 'personal/index';

define(ModuleName, ['base', 'jquery', 'arttemplate', 'layer'], function (Page, $, T, layer) {
	'use strict';
	Page.prototype[ModuleName] = function () {
		layer.config({
				path: '../../js/lib/layer/'
			});
		var layerLoading = layer.msg('加载中...', {icon: 16,shade: 0.6});
		var _this = this;
		_this.fetch('/require/mjson/personal/info', {},function(res){
			if (res.code == 0) {
				$('.user_info').html(T('person-info', res.data));
			} else {}
		});
		_this.fetch('/require/mjson/personal/dynamic', {},function(res){
			if (res.code == 0) {
				$('.trends-content').html(T('person-summary', {data: res}));
				setTimeout(function(){
					layer.close(layerLoading)
				},1000);
			} else {}
		});

		return this;
	};
	return Page;
});
