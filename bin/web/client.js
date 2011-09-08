/**
 * taskcloud 客户端
 */

var taskcloud = {} 

/** 初始化, 成功后调用回调函数 */
taskcloud.init = function (callback) {
	taskcloud.isLogin = false;
	taskcloud.username = '';
	// 获取登录状态
	$.getJSON('/home/api/status', function (d) {
		if (d.status < 1)
			taskcloud.isLogin = false;
		else {
			taskcloud.isLogin = true;
			taskcloud.username = d.data.username;
		}
		callback();
	});
}

/** 登录 */
taskcloud.login = function (username, password, callback) {
	$.getJSON('/home/api/login', {username: username, password: password}, function (d) {
		if (d.status < 1)
			taskcloud.isLogin = false;
		else {
			taskcloud.isLogin = true;
			taskcloud.username = username;
		}
		callback();
	});
}

/** 注销 */
taskcloud.logout = function () {
	$.getJSON('/home/api/logout', function (d) {
		alert('注销成功！');
	});
}