var ModuleName = 'course/detaill';

define(ModuleName, ['base', 'jquery', 'arttemplate', 'layer'], function (Page, $, T, layer) {
	'use strict';
	Page.prototype[ModuleName] = function () {
		layer.config({
        path: '../../js/lib/layer/'  //layer.js所在的目录，可以是绝对目录，也可以是相对目录
      })
		var layerLoading = layer.msg('加载中...', {icon: 16,shade: 0.6});
		var _this = this, info = {}, detail = {};
		var id = _this.getQueryString('id');
		var is_overdue = '';
		if (!id) {
			layer.msg('未找到内容');
			history.go(-1);
			return;
		}

		id = parseInt(id);

		//报名
		function sign(state, callback) {
			_this.fetch('/mjson/course/sign', {sign: state, course_id: id}, function (res) {
				if (res.code == 0) {
					if(state == false){
						layer.tips('已取消报名', '#enrollBtn', {time: 2000,tips: [1, '#4A5B65']});
						callback(state);
					} else {
						layer.tips('报名成功', '#enrollBtn', {time: 2000,tips: [1, '#479D5C']});
						callback(state);
					}
				} else {}
			});
		}

		//收藏
		function collect(state, callback) {
			_this.fetch('/mjson/course/collection', {collection: state, course_id: id}, function (res) {
				if (res.code == 0) {
					if(state == false){
						layer.tips('已取消收藏', '#collectBtn', {time: 2000,tips: [2, '#4A5B65']});
						callback(state);
					} else {
						layer.tips('收藏成功', '#collectBtn', {time: 2000,tips: [2, '#479D5C']});
						callback(state);
					}
				} else {}
			});
		}

		$('.page_content').on('click', '.enrollBtn', function () {
			//报名
			var _this = this;
			var states = {
				"sign": true,
				"cancel": false
			}

			var state = states[$(this).attr('state')];
			if (typeof state == "undefined" || state === undefined) {
				return;
			}
			sign(state, function (_state) {
				if (_state) {
					if (detail.is_compulsory) {
						$(_this).removeAttr('state').html('已报名');
					} else {
						$(_this).attr('state', 'cancel').html('取消报名');
					}
					$('.studyBtn').show();
				} else {
					$(_this).attr('state', 'sign').html('立即报名');
					$('.studyBtn').hide();
				}
			});
		}).on('click', '.collectBtn', function () {
			var _this = this,
				state = $(this).attr('state') == "true" ? true : false;
			collect(state, function (_state) {
				if (_state) {
					$(_this).attr('state', false).find('span').html('已收藏');
				} else {
					$(_this).attr('state', true).find('span').html('点击收藏');
				}
			});
		});

		_this.fetch('/mjson/course/detail', {course_id: id}, function (res) {
			detail = res.data;
			is_overdue = res.data.is_overdue;
			$('.page_content').html(T('course-detail', detail));
			setTimeout(function(){
			  layer.close(layerLoading)
			},1000);
			//学习窗口
			$('.main_location_url').on('click',function(e){
				var url = info.study_url + '/' + info.employee_id + '/' + id + '?username=' + info.employee_name + '&' + info.email;
          window.open(url, "_blank", "top=100,left=300,top=100,width=1000,height=800,location=no,menubar=no,resizable=yes,scrollbars=yes,status=no,toolbar=no ");
        })

			$('.courseDetaill_info').on('click','.moreBtn',function(){
				var btnVal = $(this).html();
				if (btnVal=='收起') {
					$(this).html('展开')
					$(this).parent().siblings('#text_infor').css('height','151px')
				}else{
					$(this).html('收起')
					$(this).parent().siblings('#text_infor').css('height','auto')
				}
			})
		});

		_this.fetch('/mjson/personal/info', {},function(res){
			res.data.course_id = id;
			info = res.data;
		});

		return this;
	};
	return Page;
});
