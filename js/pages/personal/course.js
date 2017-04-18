

var ModuleName = 'personal/course';

define(ModuleName, ['base', 'jquery', 'laypage', 'arttemplate', 'layer'], function(Page, $, laypage, T, layer) {
    'use strict';
    Page.prototype[ModuleName] = function() {
      layer.config({
  				path: '../../js/lib/layer/'
  			});
  		var layerLoading = layer.msg('加载中...', {icon: 16,shade: 0.6});
      var _this = this;
      var data = {}, amount = '', info = {};
          data.limit = 2;
          data.offset = 0;
          data.course_type = 'compulsory';
          data.name = '';
        function getList(page) {
    			data.offset = (page-1) * data.limit;
    			_this.fetch('/mjson/personal/course', data, function (res) {
    				if (res.code == 0) {
    					var amount = res.data.amount;
    					var listData = res.data.items;

    					var pages = Math.ceil(amount / data.limit); //得到总页数
    					$('#substance_list_warp').html(T('substanc_list', {list: listData}));
              setTimeout(function(){
                layer.close(layerLoading)
              },500);
    					//显示分页
    					laypage({
    						cont: 'substance_list_number',
    						pages: pages,
    						skin: 'yahei',
    						curr: page || 1, //当前页
    						jump: function (e, first) { //触发分页后的回调
    							if(!first){
    								getList(e.curr)
    							}
    						}
    					});

              $('.open_location_url').on('click',function(e){
                var url = '"' + info.study_url + '/' + info.employee_id + '/' + $(e.target).attr('id') + '?username=' + info.employee_name + '&' + info.email + '"';
                window.open(url, "_blank", " top=100,left=300,top=100,width=1000,height=800,location=no,menubar=no,resizable=yes,scrollbars=yes,status=no,toolbar=no ");
              })
              $('.see_detaills').on('click',function(e){
                location.href = '/pages/course/detaill.html?id=' + $(e.target).attr('id');
              })

    				} else {}
    			});
    		}

      _this.fetch('/mjson/personal/info', {},function(res){
  			$('.user_info').html(T('person-info', res.data));
        info = res.data;
  		});

      //课程 选修 || 必修
      $('.left-tab li').on('click', function (e) {
        if (!$(this).hasClass('disabled')) {
          $(this).addClass('active').siblings().removeClass('active')
        };
        data.course_type = $(e.target).attr('name');
        getList(1)
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
