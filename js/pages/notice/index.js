var ModuleName = 'notice/index';

define(ModuleName, ['base', 'jquery', 'swiper', 'laypage', 'arttemplate', 'layer'], function (Page, $, Swiper, laypage, T, layer) {
	'use strict';
	Page.prototype[ModuleName] = function () {
		layer.config({
        path: '../../js/lib/layer/'
      });
		var layerLoading = layer.msg('加载中...', {icon: 16,shade: 0.6});
		var _this = this;
		//参数
		var data = {}, amount = '';
		data.limit = 10;
		data.offset = 0;

		//请求全部公告数据
		function getList(page) {
			data.offset = (page-1) * data.limit;
			_this.fetch('/mjson/index/announcement', data, function (res) {
				if (res.code == 0) {
					var amount = res.data.amount;
					var announcementData = res.data.announcement;
					var pages = Math.ceil(amount / data.limit); //得到总页数

					var sorting_1 = [], sorting_2 = [];
					for (var k = 0; k < announcementData.length; k++) {
						if (announcementData[k].is_top == true) {
							sorting_1.push(announcementData[k])
						} else {
							sorting_2.push(announcementData[k])
						}
					}
					var sortingData = sorting_1.concat(sorting_2)  //连接数组
					for (var i = 0; i < sortingData.length; i++) {
						if (sortingData[i].is_internal == true) {
							sortingData[i].text = '集团公告'
						} else {
							sortingData[i].text = '分公司公告'
						}
					}
					$('#all_text_list_warp').html(T('notice_list', {list: sortingData}));
					setTimeout(function(){
						layer.close(layerLoading)
					},1000);
					//显示分页
					laypage({
						cont: 'biuuu_text_number',
						pages: pages,
						skin: 'yahei',
						curr: page || 1, //当前页
						jump: function (e, first) { //触发分页后的回调
							if(!first){
								getList(e.curr)
							}
						}
					});
				} else {}
			});
		}

		getList(1);

		//加载轮播数据
		_this.fetch('/mjson/index', {}, function (res) {
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
