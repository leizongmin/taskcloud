/**
 * taskcloud web 运行任务
 *
 * @author leizongmin<leizongmin@gmail.com>
 * @version 0.1
 */

var g = require('./global.inc');
 
exports.paths = '/task/:username/exec';

exports.get = exports.post = function (server, request, response) {
	var access_token = request.cookie.access_token || request.get.access_token;
	var username = request.path.username;
	var code = request.get.code || request.post.code;
	
	var ret = {}
	if (username != g.user_get(access_token))
		ret.status = -1;
	else {
		var tid = g.taskvm.exec(username, code);
		ret.data = {id: tid}
		switch (tid) {
			case -1:	ret.data.info = '启动代码格式有误';	break;
			case -2:	ret.data.info = '没有指定模版名称';	break;
			case -3:	ret.data.info = '任务ID必须为数字';	break;
			case -4:	ret.data.info = '模板名称不能为空';	break;
			case -5:	ret.data.info = '指定模板不存在';	break;
			case -6:	ret.data.info = '编译模板时出错';	break;
			default:	ret.data.info = '未知错误';
		}
		ret.status = tid > 0 ? 1 : 0;
	}
	
	response.sendJSON(ret);
}