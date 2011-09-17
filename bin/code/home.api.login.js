/**
 * taskcloud web 登录
 *
 * @author leizongmin<leizongmin@gmail.com>
 * @version 0.1
 */

var g = require('./global.inc');
 
exports.paths = '/home/api/login';

exports.get = function (server, request, response) {
	server.sessionStart();
	
	var username = request.get.username || request.data.username || '';
	var password = request.get.password || request.post.password || '';
	
	// 登录
	g.auth.verify(username, password, function (access_token) {
		var ret = {}
		if (access_token) {
			server.session.username = username;
			// 设置cookie.access_token，以便于下次自动登录
			response.setCookie('access_token', access_token, {
				path: '/',
				maxAge: 3600 * 7
			});
		}
		ret.data = access_token;
		ret.status = access_token ? 1 : 0;
		response.sendJSON(ret);
	});
}