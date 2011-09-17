/**
 * taskcloud web 当前登录的用户信息
 *
 * @author leizongmin<leizongmin@gmail.com>
 * @version 0.1
 */

exports.paths = '/home/api/status';

exports.get = function (server, request, response) {
	server.sessionStart();
	
	var ret = {}
	ret.username = server.session.username;
	ret.status = ret.username ? 1 : -1;
	response.sendJSON(ret);
}