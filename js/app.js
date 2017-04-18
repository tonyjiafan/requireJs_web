(function (win) {
	'use strict';

	var config = {
		version: 0.10,
		env: 'develop'
	};

	// require lib
	config.require = {
		paths: {
			jquery: 'lib/jquery-1.10.2.min',
			bootstrap: 'lib/bootstrap.min',
			swiper: 'lib/swiper.min',
			arttemplate: 'lib/arttemplate',
			lightbox: 'lib/lightbox/lightbox.min',
			laypage: 'lib/laypage/laypage',
			layer: 'lib/layer/layer'
		},
		shim: {
			'jquery': {exports: '$'},
			'bootstrap': ['jquery'],
			'swiper': ['jquery'],
			'lightbox': ['jquery'],
			'laypage': ['jquery'],
			'layer': ['jquery']
		},
		waitSeconds: 120
	};

	var moduleName = document.querySelector('html').getAttribute('module');

	// 开发环境
	if (config.env == 'develop' && moduleName) {
		config.require.paths['base'] = 'base.js?=' + config['version'];
		config.require.paths[moduleName] = 'pages/' + moduleName + '.js?=' + config['version'];
	}
	// require 配置
	require.config(config.require);

	require(config.env === 'develop' ? ['jquery'] : ['jquery', 'base.min'], function ($, Page) {
		if (moduleName) {
			require([moduleName, 'jquery', 'bootstrap'], function (Page, $, bootstrap) {
				main(Page);
			});
		} else {
			!Page && require(['base'], function (Page) {
				main(Page);
			});
			Page && main(Page);
		}
	});

	// error handler
	requirejs.onError = function (error) {
		throw error;
	};

	function main(Page) {
		var page = new Page({moduleName: moduleName});
		win.__page = page;

		// 登陆规则

		// 通用方法
		page.scrollNav();

		// 页面js
		if (page[moduleName]) {
			var p = page[moduleName]();
			if (!p.no_login && !page.cookie().get('logined')) {
				return location.href = '/pages/login.html'
			}
		}
	}
})(window);
