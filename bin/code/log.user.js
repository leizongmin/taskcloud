/**
 * taskcloud web 任务运行日志
 *
 * @author leizongmin<leizongmin@gmail.com>
 * @version 0.1
 */

var g = require('./global.inc');
 
exports.paths = '/log/:username';

exports.get = function (server, request, response) {
	server.sessionStart();
	// 获取当前用户名
	var username = server.session.username;
	
	var ret = {}
	if (username != request.path.username)
		ret.status = -1;
	else {
		ret.data = g.logcache.get(username);
		ret.status = 1;
	}
	
	response.sendJSON(ret);
}