/**
 * taskcloud web 注销登录
 *
 * @author leizongmin<leizongmin@gmail.com>
 * @version 0.1
 */

exports.paths = '/home/api/logout';

exports.get = function (server, request, response) {
	server.clearSession();
	response.clearCookie('access_token', { path: '/'});
	
	response.sendJSON({status: 1});
}