var ModuleName = 'notice/detaill';

define(ModuleName, ['base', 'jquery', 'swiper','arttemplate', 'layer'], function (Page, $, Swiper, T,layer ) {
	'use strict';
	Page.prototype[ModuleName] = function () {
		layer.config({
        path: '../../js/lib/layer/'
      });
		var layerLoading = layer.msg('加载中...', {icon: 16,shade: 0.6});
		var _this = this;
		var id = _this.getQueryString('id');
		if (!id) {
			layer.msg('没有找到数据');
			return;
		}
		//请求公告详情数据
		_this.fetch('/require/mjson/index/announcement/detail', {announcement_id: parseInt(id)}, function (res) {
			if (res.code == 0) {
				$('.noticeDetaill-info').html(T('notice-detail', res.data));
				setTimeout(function(){
					layer.close(layerLoading)
				},1000);
			} else {}
		})

		//加载轮播数据
		_this.fetch('/require/mjson/index', {}, function (res) {
			var bannerData = res.data.banner;
			$('#swiper_wrapper').append(T('index-banner', {banners: bannerData}));
			var swiper = new Swiper('.swiper-container', {
				nextButton: '.swiper-button-next',
				prevButton: '.swiper-button-prev',
				slidesPerView: 1,
				loop: true
			});
		});

		return this;

	};

	return Page;
});
