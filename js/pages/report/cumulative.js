var ModuleName = 'report/cumulative';

define(ModuleName, ['base', 'jquery', 'laypage', 'arttemplate', 'layer'], function (Page, $, laypage, T, layer) {
	'use strict';
	Page.prototype[ModuleName] = function () {
		layer.config({
        path: '../../js/lib/layer/'
      });
		var layerLoading = layer.msg('加载中...', {icon: 16,shade: 0.6});
		var _this = this;
		_this.cookie().del('select_1');
		_this.cookie().del('select_2');
		_this.cookie().del('selectType');
		//参数
		var data = {};
		data.limit = 10;
		data.offset = 0;
		data.name = '';
		data.amount = '';
    data.get_selection = true;
    data.type = '';
    data.selection = '';

		//请求Table数据
		function getList(page) {
			data.offset = (page-1) * data.limit;
			_this.fetch('/mjson/report/count', data, function (res) {
				if (res.code == 0) {
          data.amount = res.data.amount;
					var pages = Math.ceil(res.data.amount / data.limit); //得到总页数
					$('#table_list_warp_2').html(T('table_list_2', {list: res.data.items}));
					$('#fitter_list_warp').html(T('fitter_list', {fitterList: res.data.filters}));
          setTimeout(function(){
						layer.close(layerLoading)
					},1000);
					//显示分页
					laypage({
						cont: 'pagination_number_2',
						pages: pages,
						skin: 'yahei',
						curr: page || 1, //当前页
						jump: function (e, first) { //触发分页后的回调
              $('.selet_type').each(function(index,e){
                if($(e).attr('num') == _this.cookie().get('selectType')){
                  $(this).css({
                    'background':'#5490f7',
                    'color': '#fff'
                  }).siblings().css({
                    'background': '#fff',
                    'color': '#444'
                  });
                } else { }
              })
							if(!first){
								getList(e.curr)
							}
						}
					});
				} else {
					layer.msg("网络故障请求出错")
					setTimeout(function(){
						location.href="/pages/login.html";
					},2000)
				}

			});
		}
    $('.select_box').on('click',function(e){
        var selectionEl = e.target;
        data.selection = $(selectionEl).attr('userSlect');
        getList(1);
    })
    //查询切换
    $('#fitter_list_warp').on('click','li',function () {
      if(!data.selection == ''){
        data.type = $(this).text();
        _this.cookie().set('selectType',$(this).attr('num'))
        $(this).css({
          'background':'#5490f7',
          'color': '#fff'
        }).siblings().css({
          'background': '#fff',
          'color': '#444'
        });
        getList(1);
      } else {
        layer.msg('请先进行维度选择')
        setTimeout(function(){
          layer.tips('维度选择', '#weidu', {time: 2000,tips: [3, '#4A5B65']});
        },1000)
      }
    });

    function searchFn(){
      data.name = $('#search_input').val();
      if($('#search_input').val() ==  ''){
        layer.tips('请输入关键字搜索', '#search_input', {time: 2000,tips: [3, '#4A5B65']});
      } else {
        getList(1);
      }
    }
    //搜索框事件
    $('.searchBtn').on('click',function(){
      searchFn();
    })
    $(document).keydown(function(event){
      if(event.keyCode == 13){
        searchFn();
      }
    });

		getList(1);

		return this;
	};

	return Page;
});
