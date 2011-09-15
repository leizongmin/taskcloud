/**
 * taskcloud web 任务运行日志
 *
 * @author leizongmin<leizongmin@gmail.com>
 * @version 0.1
 */

var g = require('./global.inc');
 
exports.paths = '/log/:username/:id';

exports.get = function (server, request, response) {
	var access_token = request.cookie.access_token || request.get.access_token;
	var username = request.path.username;
	var id = request.path.id;
	
	var ret = {}
	if (username != g.user_get(access_token))
		ret.status = -1;
	else {
		ret.data = g.logcache.get(username, id);
		ret.status = 1;
	}
	
	response.sendJSON(ret);
}