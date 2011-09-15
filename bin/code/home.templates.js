/**
 * taskcloud web 模板管理首页
 *
 * @author leizongmin<leizongmin@gmail.com>
 * @version 0.1
 */

var g = require('./global.inc');
 
exports.paths = '/home/templates';

exports.get = function (server, request, response) {
	var access_token = request.cookie.access_token || request.get.access_token;
	var username = g.user_get(access_token);
	
	if (username) {
		var data = { username: username }
		response.renderFile('editor.html', data, 'text/html');
	}
	else
		response.redirect('/');
}