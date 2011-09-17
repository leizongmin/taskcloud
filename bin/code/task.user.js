/**
 * taskcloud web 任务列表
 *
 * @author leizongmin<leizongmin@gmail.com>
 * @version 0.1
 */

var g = require('./global.inc');
 
exports.paths = '/task/:username';

exports.get = exports.post = function (server, request, response) {
	server.sessionStart();
	// 获取当前用户名
	var username = server.session.username;
	
	var ret = {}
	if (username != request.path.username)
		ret.status = -1;
	else {
		ret.data = g.taskvm.list(username);
		ret.status = ret.data ? 1 : 0;
	}
	
	response.sendJSON(ret);
}