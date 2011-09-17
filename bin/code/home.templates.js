/**
 * taskcloud web 模板管理首页
 *
 * @author leizongmin<leizongmin@gmail.com>
 * @version 0.1
 */

var g = require('./global.inc');
 
exports.paths = '/home/templates';

exports.get = function (server, request, response) {
	server.sessionStart();
	// 获取当前用户名
	var username = server.session.username;
	
	if (username) {
		var data = { username: username }
		response.renderFile('editor.html', data, 'text/html');
	}
	else
		response.redirect('/');
}