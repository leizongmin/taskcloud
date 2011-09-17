/**
 * taskcloud web 后台首页
 *
 * @author leizongmin<leizongmin@gmail.com>
 * @version 0.1
 */

var g = require('./global.inc');
 
exports.paths = '/home/index';

exports.get = function (server, request, response) {
	server.sessionStart();
	
	// 如果没有登录，则转到首页登录界面
	if (!server.session.username) {
		response.redirect('/');
		return;
	}
	
	// 渲染页面
	var data = { username: server.session.username }
	response.renderFile('index.html', data, 'text/html');
}