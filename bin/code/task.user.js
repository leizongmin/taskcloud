/**
 * taskcloud web 任务列表
 *
 * @author leizongmin<leizongmin@gmail.com>
 * @version 0.1
 */

var g = require('./global.inc');
 
exports.paths = '/task/:username';

exports.get = exports.post = function (server, request, response) {
	var access_token = request.cookie.access_token || request.get.access_token;
	var username = request.path.username;
	
	var ret = {}
	if (username != g.user_get(access_token))
		ret.status = -1;
	else {
		ret.data = g.taskvm.list(username);
		ret.status = ret.data ? 1 : 0;
	}
	
	response.sendJSON(ret);
}