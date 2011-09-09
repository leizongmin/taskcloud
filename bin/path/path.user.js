/**
 * taskcloud Web 用户任务管理
 *
 * @author leizongmin<leizongmin@gmail.com>
 * @version 0.1
 */
 
/*
 * 依赖此模块：server
 */
 
/**
 * 注册监听器
 *
 * @param {Web.js} web Web.js实例
 * @param {function} logger 输出日志
 * @param {taskvm} taskvm taskvm实例
 * @param {function} getUserName 通过access_token获取用户名
 */
module.exports = function (web, logger, taskvm, getUserName) {
	logger('Loading web path: user');

	var getRouter = {
	
		/* 任务列表 */
		'/:user/tasklist':	function (req, res) {
			var user = req.path.user;
			var ret = {}
			// 验证权限
			var access_token = req.qs.access_token || req.cookie.access_token;
			if (user != getUserName(access_token)) {
				ret.status = -1;
			}
			else {
				ret.data = taskvm.list(user);
				ret.status = ret.data ? 1 : 0;
			}
			res.sendJSON(ret);
		},
		
		/* 任务信息 */
		'/:user/task/:id':	function (req, res) {
			var user = req.path.user;
			var id = req.path.id;
			var ret = {}
			// 验证权限
			var access_token = req.qs.access_token || req.cookie.access_token;
			if (user != getUserName(access_token)) {
				ret.status = -1;
			}
			else {
				if (user in taskvm.users)
					ret.data = taskvm.users[user].get(id);
				else
					ret.data = false;
				ret.status = ret.data ? 1 : 0;
			}
			res.sendJSON(ret);
		},
		
		/* 运行任务 */
		'/:user/exec':	function (req, res) {
			var user = req.path.user;
			var code = req.qs.code;
			var ret = {}
			// 验证权限
			var access_token = req.qs.access_token || req.cookie.access_token;
			if (user != getUserName(access_token)) {
				ret.status = -1;
			}
			else {
				tid = taskvm.exec(user, code);
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
			res.sendJSON(ret);
		},
		
		/* 删除任务 */
		'/:user/kill':	function (req, res) {
			var user = req.path.user;
			var id = req.qs.id;
			var ret = {}
			// 验证权限
			var access_token = req.qs.access_token || req.cookie.access_token;
			if (user != getUserName(access_token)) {
				ret.status = -1;
			}
			else {
				ret.data = taskvm.kill(user, id);
				ret.status = ret.data > 0 ? 1 : 0;
			}
			res.sendJSON(ret);
		},
		
		/* 运行一次任务 */
		'/:user/once':	function (req, res) {
			var user = req.path.user;
			var id = req.qs.id;
			var ret = {}
			// 验证权限
			var access_token = req.qs.access_token || req.cookie.access_token;
			if (user != getUserName(access_token)) {
				ret.status = -1;
			}
			else {
				ret.data = taskvm.once(user, id);
				ret.status = ret.data ? 1 : 0;
			}
			res.sendJSON(ret);
		}
	}
	
	var postRouter = {
		
		/* 运行任务 */
		'/:user/exec':	function (req, res) {
			var user = req.path.user;
			var code = req.data.code;
			var ret = {}
			// 验证权限
			var access_token = req.data.access_token || req.cookie.access_token;
			if (user != getUserName(access_token)) {
				ret.status = -1;
			}
			else {
				tid = taskvm.exec(user, code);
				ret.data = {id: tid}
				switch (tid) {
					case -1:	ret.data.info = '启动代码格式有误';	break;
					case -2:	ret.data.info = '没有指定模版名称';	break;
					case -3:	ret.data.info = '任务ID必须为数字';	break;
					case -4:	ret.data.info = '模板名称不能为空';	break;
					case -5:	ret.data.info = '指定模板不存在';	break;
					case -6:	ret.data.info = '编译模板时出错: ' + taskvm._compile_error_info;	break;
					default:	ret.data.info = '未知错误';
				}
				ret.status = tid > 0 ? 1 : 0;
			}
			res.sendJSON(ret);
		}
	}

	web.get(getRouter);
	web.post(postRouter);
}