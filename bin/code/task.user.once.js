/**
 * taskcloud web 运行一次任务
 *
 * @author leizongmin<leizongmin@gmail.com>
 * @version 0.1
 */

var g = require('./global.inc');
 
exports.paths = '/task/:username/once';

exports.get = function (server, request, response) {
	server.sessionStart();
	// 获取当前用户名
	var username = server.session.username;
	
	var id = request.get.id || request.post.id;
	
	var ret = {}
	if (username != request.path.username)
		ret.status = -1;
	else {
		ret.data = g.taskvm.once(username, id);
		ret.status = ret.data > 0 ? 1 : 0;
	}
	
	response.sendJSON(ret);
}