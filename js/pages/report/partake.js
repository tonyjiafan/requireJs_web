var ModuleName = 'report/partake';

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

		//请求Table数据
		function getList(page) {
			data.offset = (page-1) * data.limit;
			_this.fetch('/require/mjson/report/duration', data, function (res) {
				if (res.code == 0) {
          data.amount = res.data.amount;
					var pages = Math.ceil(res.data.amount / data.limit); //得到总页数

					$('#table_list_warp_3').html(T('table_list_3', {list: res.data.items}));
					setTimeout(function(){
						layer.close(layerLoading)
					},1000);
					//显示分页
					laypage({
						cont: 'pagination_box_number_3',
						pages: pages,
						skin: 'yahei',
						curr: page || 1, //当前页
						jump: function (e, first) { //触发分页后的回调
							if(_this.cookie().get('select_1') == 'true'){
								 $('.button_1').prop('checked',true).data('flag',false);
								 $('.hide-elment-1').show().css('background','rgb(219,215,178)');
							} else {
								$('.button_1').prop('checked',false).data('flag',true);
							}
							if(_this.cookie().get('select_2') == 'true'){
								$('.button_2').prop('checked',true).data('flag',false);
								$('.hide-elment-2').show().css('background','rgb(202, 231, 236)');
							} else {
								$('.button_2').prop('checked',false).data('flag',true);
							}
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

		$('.chang-btn').data('flag',true).on('click',function(e){
      if($(this).attr('number') == 'btn_1'){
        if($(this).data('flag')){
          $('.hide-elment-1').show().css('background','rgb(219,215,178)');
          $(this).data('flag',false);
					_this.cookie().set('select_1',true)
        } else {
          $('.hide-elment-1').hide();
          $(this).data('flag',true);
					_this.cookie().set('select_1',false)
        }
      } else if($(this).attr('number') == 'btn_2'){
        if($(this).data('flag')){
          $('.hide-elment-2').show().css('background','rgb(202,231,236)');
          $(this).data('flag',false);
					_this.cookie().set('select_2',true)
        } else {
            $('.hide-elment-2').hide();
          $(this).data('flag',true);
					_this.cookie().set('select_2',false)
        }
      }
    })

    function searchFn(){
      data.name = $('#search_input3').val();
      if($('#search_input3').val() ==  ''){
        layer.tips('请输入关键字搜索', '#search_input3', {time: 2000,tips: [3, '#4A5B65']});
      } else {
        getList(1);
      }
    }

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
