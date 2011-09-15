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
	var access_token = request.cookie.access_token || request.get.access_token;
	var username = request.path.username;
	var template = request.path.template;
	
	var ret = {}
	if (username != g.user_get(access_token))
		ret.status = -1
	else {
		ret.data = g.tpl_get(username, template);
		ret.status = typeof ret.data == 'string' ? 1 : 0;
	}
	
	response.sendJSON(ret);
}

/** 修改模板内容 */
exports.post = function (server, request, response) {
	var access_token = request.cookie.access_token || request.get.access_token;
	var username = request.path.username;
	var template = request.path.template;
	var code = request.post.code;
	
	var ret = {}
	if (username != g.user_get(access_token))
		ret.status = -1
	else {
		ret.data = g.tpl_set(username, template, code);
		ret.status = ret.data ? 1 : 0;
	}
	
	response.sendJSON(ret);
}