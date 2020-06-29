// 路由配置
var menuArray = [
	{
		name: '统计分析',
		id: 0,
		pid: -1,
		url: '#/home.html',
		icon: '&#xe670;',
		activeClass: 'layui-this'
	},{
		name: '通知通报',
		id: 1,
		pid: -1,
		url: '#/noticeTable.html',
		icon: '&#xe662;',
		activeClass: 'layui-this',
		children: [
			{
				name: '',
				id: 1001,
				pid: 1,
				url: '',
				icon: ''
			}
		]
	},{
		name: '点位信息',
		id: 2,
		pid: -1,
		url: '#/storesTable.html',
		icon: '&#xe604;',
		activeClass: 'layui-this',
		children: [
			{
				name: '',
				id: 1001,
				pid: 1,
				url: '',
				icon: ''
			}
		]
	},{
		name: '故障维护',
		id: 3,
		pid: -1,
		url: '#/faultTable.html',
		icon: '&#xe617;',
		activeClass: 'layui-this',
		children: [
			{
				name: '',
				id: 1001,
				pid: 1,
				url: '',
				icon: ''
			}
		]
	},{
		name: '警情信息',
		id: 4,
		pid: -1,
		url: '#/alarmInfoTable.html',
		icon: '&#xe6a1;',
		activeClass: 'layui-this',
		children: [
			{
				name: '',
				id: 1001,
				pid: 1,
				url: '',
				icon: ''
			}
		]
	},{
		name: '设备管理',
		id: 5,
		pid: -1,
		url: '#/deviceManageTable.html',
		icon: '&#xe66c;',
		activeClass: 'layui-this',
		children: [
			{
				name: '',
				id: 1001,
				pid: 1,
				url: '',
				icon: ''
			}
		]
	},{
		name: '用户管理',
		id: 6,
		pid: -1,
		url: '#/userManagement.html',
		icon: '&#xe615;',
		activeClass: 'layui-this',
		children: [
			{
				name: '',
				id: 1001,
				pid: 1,
				url: '',
				icon: ''
			}
		]
	},
]

// 路由设置
function initRouter () {
	var url = window.location.href;
	// console.log(url)
	var router;
	if (url.indexOf('#/') > -1) {
		router = url.substring(url.indexOf('#/') + 2);
		// console.log(router)
		if (router === '') {
			// router = 'index.html';
			$('#iframeParent').attr('src', 'pages/home.html');
		} else {
			$('#iframeParent').attr('src', 'pages/' + router);
		}
	} else {
		$('#iframeParent').attr('src', 'pages/home.html');
		history.replaceState(null, null, '#/');
	}
	// 地址栏修改不刷新的解决方案
	$('a').click(function () {
		if ($(this).attr('href')) {
			window.location.href = $(this).attr('href');
			window.location.reload();
		}
	});
};

// function initRouter () {
// 	$('#iframeParent').attr('src', 'pages/home.html');
// 	menuArray.forEach(function(item, index) {
// 		$('#layui-nav-item' + item.id).find('a').click(function() {
// 			var dataId = $(this).data("id")
// 			if (dataId == item.id) {
// 				$('#iframeParent').attr('src', 'pages' + item.url);
// 			}
// 		})
// 	})
// };

// 加载左侧菜单
function showMenus (id) {
	menuArray.forEach(function (item, index) {
		// console.log(item)
		if (item.pid == id) {
			// $('.leftMenu ul.layui-nav').append('<li id="layui-nav-item' + item.id + '" class="layui-nav-item"><a href="javascript:;" data-id="' + item.id +'" data-url="'+ item.url +'"><i class="iconfont">' + item.icon + '</i><span>' + item.name +'</span></a></li>')
			
			$('.leftMenu ul.layui-nav').append('<li id="layui-nav-item' + item.id + '" class="layui-nav-item"><a href="' + item.url + '" data-id="' + item.id +'" data-url="'+ item.url +'"><i class="iconfont">' + item.icon + '</i><span>' + item.name +'</span></a></li>')
			// $('.leftMenu ul.layui-nav').find('li').eq(0).addClass('layui-this')
		}
		// console.log(window.location.href.split('#/')[1])
		if (item.url.split('#/')[1] == window.location.href.split('#/')[1]) {
			$('.leftMenu ul.layui-nav').find('li').eq(index).addClass('layui-this')
		} else if (!window.location.href.split('#/')[1]) {
			$('.leftMenu ul.layui-nav').find('li').eq(0).addClass('layui-this')
		}
	})
};