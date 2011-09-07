/**
 * taskcloud 客户端
 */

var taskcloud = {} 

/** 初始化, 成功后调用回调函数 */
taskcloud.init = function (callback) {
	// 获取登录状态
	var access_token = document.cookie;
	if (access_token == '') {
		taskcloud.isLogin = false;
		callback();
	}
	else {
		$.getJSON('/access_token/' + access_token, function (d) {
			if (d.status < 1)
				taskcloud.isLogin = false;
			else {
				taskcloud.isLogin = true;
				taskcloud.username = d.data.username;
			}
			callback();
		});
	}
}

/** 登录 */
taskcloud.login = function (username, password, callback) {
	$.getJSON('/home/api/login', {username: username, password: password}, function (d) {
		if (d.status < 1)
			taskcloud.isLogin = false;
		else {
			taskcloud.isLogin = true;
			taskcloud.username = username;
			document.cookie = d.data;
		}
		callback();
	});
}

/** 注销 */
taskcloud.logout = function () {
	document.cookie = '.';
}