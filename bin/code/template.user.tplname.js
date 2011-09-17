/**
 * taskcloud web 用户模板读取、修改
 *
 * @author leizongmin<leizongmin@gmail.com>
 * @version 0.1
 */

var g = require('./global.inc');
 
exports.paths = '/template/:username/:template';

/** 获取模板内容 */
exports.get = function (server, request, response) {
	server.sessionStart();
	// 获取当前用户名
	var username = server.session.username;
	
	var template = request.path.template;
	
	var ret = {}
	if (username != request.path.username) {
		ret.status = -1;
		response.sendJSON(ret);
	}
	else {
		ret.data = g.usertpl.get(username, template, function (data) {
			ret.data = data;
			ret.status = typeof ret.data == 'string' ? 1 : 0;
			response.sendJSON(ret);
		});
	}
}

/** 修改模板内容 */
exports.post = function (server, request, response) {
	server.sessionStart();
	// 获取当前用户名
	var username = server.session.username;
	
	var template = request.path.template;
	var code = request.post.code;
	
	var ret = {}
	if (username != request.path.username) {
		ret.status = -1;
		response.sendJSON(ret);
	}
	else {
		ret.data = g.usertpl.set(username, template, code, function (data) {
			ret.data = data;
			ret.status = ret.data ? 1 : 0;
			response.sendJSON(ret);
		});
	}
}