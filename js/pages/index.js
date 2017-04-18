var ModuleName = 'index';

define(ModuleName, ['base', 'jquery', 'swiper', 'arttemplate', 'layer'], function (Page, $, Swiper, T, layer) {
	'use strict';
	Page.prototype[ModuleName] = function () {
		layer.config({
		        path: '../../js/lib/layer/'
		      });
		var layerLoading = layer.msg('加载中...', {icon: 16,shade: 0.6});
		var _this = this;
		$('body').on('click', '.sidebar_btn', function () {
			$('.sidebar_content').toggle();
			$(this).toggleClass('on');
			var sidebarWidth = $('.sidebar').width();
			if (sidebarWidth > 22) {
				$('.sidebar').css('width', '22px');
			} else {
				$('.sidebar').css('width', '280px');
			}
		})

		//加载数据
		_this.fetch('/require/mjson/index', {}, function (res) {
			if(res.code == 0){
				var bannerData = res.data.banner,
						announcementData = res.data.announcement;
				$('#swiper_wrapper').append(T('index-banner', {banners:bannerData}));
				var swiper = new Swiper('.swiper-container', {
					nextButton: '.swiper-button-next',
					prevButton: '.swiper-button-prev',
					slidesPerView: 1,
					loop: true
				});
				/*公告
				 置顶功能的实现，是拆分数组当中is_top为true 和 false的元素
				 然后连接数组实现排序的
				 */
				var sorting_1 = [], sorting_2 = [];
				for (var k = 0; k < announcementData.length; k++) {
					if (announcementData[k].is_top == true) {
						sorting_1.push(announcementData[k])
					} else {
						sorting_2.push(announcementData[k])
					}
				}
				var sorting = sorting_1.concat(sorting_2)
				for (var i = 0; i < sorting.length; i++) {
					if (sorting[i].is_internal == true) {
						sorting[i].text = '集团公告'
					} else {
						sorting[i].text = '分公司公告'
					}
				}
				$('#text_list_warp').append(T('index-announcement', {announcements:sorting}));
				setTimeout(function(){
					  layer.close(layerLoading)
					},1000);
			} else {

			}
		});

		return this;
	};
	return Page;
});
