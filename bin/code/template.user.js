/**
 * taskcloud web 获取用户模板列表
 *
 * @author leizongmin<leizongmin@gmail.com>
 * @version 0.1
 */

var g = require('./global.inc');
 
exports.paths = '/template/:username';

exports.get = function (server, request, response) {
	server.sessionStart();
	// 获取当前用户名
	var username = server.session.username;
	
	var ret = {}
	if (username != request.path.username) {
		ret.status = -1;
		response.sendJSON(ret);
	}
	else {
		g.usertpl.getList(username, function (data) {
			ret.data = data;
			ret.status = ret.data ? 1 : 0;
			response.sendJSON(ret);
		});
	}
}