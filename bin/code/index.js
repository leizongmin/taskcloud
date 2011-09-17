/**
 * taskcloud web 网站首页
 *
 * @author leizongmin<leizongmin@gmail.com>
 * @version 0.1
 */

var g = require('./global.inc');
 
exports.paths = '/';

exports.get = function (server, request, response) {
	server.sessionStart();
	
	// 如果设置了session.username，则调整到/home/index
	if (server.session.username) {
		response.redirect('/home/index');
		return;
	}
	
	// 如果存在cookie.access_token，则尝试自动登录
	if (request.cookie.access_token) {
		g.auth.getUserName(request.cookie.access_token, function (username) {
			if (!username)
				response.sendFile('login.html');
			else
				response.redirect('/home/index');
		});
		return;
	}
	
	// 默认显示登录页面
	response.sendFile('login.html');
}