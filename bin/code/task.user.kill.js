/**
 * taskcloud web 删除任务
 *
 * @author leizongmin<leizongmin@gmail.com>
 * @version 0.1
 */

var g = require('./global.inc');
 
exports.paths = '/task/:username/kill';

exports.get = exports.delete = function (server, request, response) {
	var access_token = request.cookie.access_token || request.get.access_token;
	var username = request.path.username;
	var id = request.get.id || request.post.id;
	
	var ret = {}
	if (username != g.user_get(access_token))
		ret.status = -1;
	else {
		ret.data = g.taskvm.kill(username, id);
		ret.status = ret.data > 0 ? 1 : 0;
	}
	
	response.sendJSON(ret);
}