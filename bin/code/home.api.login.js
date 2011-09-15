/**
 * taskcloud web 登录
 *
 * @author leizongmin<leizongmin@gmail.com>
 * @version 0.1
 */

var g = require('./global.inc');
 
exports.paths = '/home/api/login';

exports.get = function (server, request, response) {
	var ret = {}
	ret.data = g.user_login(request.get.username || request.data.username,
							request.get.password || request.post.password);
	if (ret.data)
		response.setCookie('access_token', ret.data, {
			path: '/',
			maxAge: 3600 * 7
		});
	ret.status = ret.data ? 1 : 0;
	response.sendJSON(ret);
}