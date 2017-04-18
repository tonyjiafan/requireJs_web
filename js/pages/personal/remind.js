

var ModuleName = 'personal/remind';

define(ModuleName, ['base', 'jquery', 'laypage', 'arttemplate', 'layer'], function(Page, $, laypage, T, layer) {
    'use strict';
    Page.prototype[ModuleName] = function() {
      layer.config({
          path: '../../js/lib/layer/'
        });
  		var layerLoading = layer.msg('加载中...', {icon: 16,shade: 0.6});
      var _this = this;
      var data = {}, amount = '';
          data.limit = 10;
          data.offset = 0;
          data.name = '';
        function getList(page) {
    			data.offset = (page-1) * data.limit;
    			_this.fetch('/require/mjson/personal/message', data, function (res) {
    				if (res.code == 0) {
    					var amount = res.data.amount;
    					var listData = res.data;
    					var pages = Math.ceil(amount / data.limit); //得到总页数
    					$('#remind_list_warp').html(T('remind_list', {list: listData}));
              setTimeout(function(){
                layer.close(layerLoading)
              },500);
    					//显示分页
    					laypage({
    						cont: 'remind_list_number',
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

      _this.fetch('/require/mjson/personal/info', {},function(res){
  			$('.user_info').html(T('person-info', res.data));
  		});

      var searchFn = function(val){
        if(val !== ''){
          data.name = $('.searchInput').val();
          getList(1)
        } else {
          layer.tips('请输入关键字', '.searchInput', {time: 2000,tips: [3, '#4A5B65']});
        }
      }
      //查询
      $('.searchBtn').on('click',function(){
        var val1 = $('.searchInput').val();
        searchFn(val1)
      })

      $(document).keydown(function(e){
        if(e.keyCode == 13){
          var val2 = $('.searchInput').val();
          searchFn(val2)
        }
      });


      getList(1)
      return this;
    };
    return Page;
});
