var ModuleName = 'course/index';

define(ModuleName, ['base', 'jquery', 'laypage', 'arttemplate', 'layer'], function (Page, $, laypage, T, layer) {
	'use strict';
	Page.prototype[ModuleName] = function () {
		layer.config({
        path: '../../js/lib/layer/'
      });
		var layerLoading = layer.msg('加载中...', {icon: 16,shade: 0.6});
		var _this = this;
		//查询
		$('.course-nav-row').on('click', 'li', function () {
			if (!$(this).hasClass('disabled')) {
				$(this).addClass('active').siblings().removeClass('active')
			};
		});

		var filter = {
			course_type: 'all',
			structure_id: 'all',
			unit_type: 'all',
			level: 'all',
			name: '',
			limit:10,
			offset:0
		}

		function getCat() {
			var rander = function (_list) {
				var str = '';
				_list.forEach(function (elment, index) {
					str += '<li value="' + elment.id + '" type="structure_id" class="filter">'
						+ '<a href="javascript:void(0);">' + elment.name + '</a>'
						+ '</li>'
				});
				$("#clearfix_bd_list_2").html(
					'<li class="filter active" value="all" type="structure_id"><a href="javascript:void(0);">全部</a></li>'
				).append(str);
			}
			//本地缓存
			var list = localStorage.getItem('course_cat');
			if (list) {
				rander(JSON.parse(list));
			} else {
				//线上数据
				_this.fetch('/mjson/course/filter', {}, function (res) {
					if (res.code == 0) {
						localStorage.setItem('course_cat', JSON.stringify(res.data));
						rander(res.data);
					} else {}
				});
			}
		}

		function getCourse(page) {
			filter.offset = (page - 1) * filter.limit;
			_this.fetch('/mjson/course/list', filter, function (res) {
				console.log(res)
				if (res.code == 0) {
					var pages = Math.ceil(res.data.amount/filter.limit);
					filter.name = '';
					/**
					 * list template
					 */
					$('#all_text_list_warp_2').html(T('course-list', {list:res.data.items || []}))
					setTimeout(function(){
						layer.close(layerLoading)
					},1000);
					laypage({
						cont: 'biuuu_text_number_2',
						pages: pages,
						skin: 'yahei',
						curr: page || 1, //当前页
						jump: function (e, first) { //触发分页后的回调
							if(!first){
								getCourse(e.curr)
							}
						}
					});
				} else {}
			});
		}


		function trigger_filter(type, value) {
			if (filter[type] == value) {
				return;
			}
			filter[type] = value;
			if (type == 'name') {
				$('#course-search input[type="text"]').val(value);
			}
			getCourse(1);
		}

		$('body').on('click', 'li.filter', function () {
			var type = $(this).attr('type'), value = $(this).attr('value');
			trigger_filter(type, value);
		});
		$('#course-search').on('submit', function () {
			var value = $.trim($('#course-search input[type="text"]').val());
			trigger_filter('name', value);
			return false;
		});
		getCat();
		getCourse(1)

		return this;
	};
	return Page;
});
