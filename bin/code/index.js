/**
 * taskcloud web 网站首页
 *
 * @author leizongmin<leizongmin@gmail.com>
 * @version 0.1
 */

var g = require('./global.inc');
 
exports.paths = '/';

exports.get = function (server, request, response) {
	var access_token = request.cookie.access_token || request.get.access_token;
	var username = g.user_get(access_token);
	if (!username)
		response.sendFile('login.html');
	else
		response.redirect('/home/index');
}