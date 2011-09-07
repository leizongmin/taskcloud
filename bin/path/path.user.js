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
			var access_token = req.qs.access_token;
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
			var access_token = req.qs.access_token;
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
			var access_token = req.qs.access_token;
			if (user != getUserName(access_token)) {
				ret.status = -1;
			}
			else {
				ret.data = taskvm.exec(user, code);
				ret.status = ret.data > 0 ? 1 : 0;
			}
			res.sendJSON(ret);
		},
		
		/* 删除任务 */
		'/:user/kill':	function (req, res) {
			var user = req.path.user;
			var id = req.qs.id;
			var ret = {}
			// 验证权限
			var access_token = req.qs.access_token;
			if (user != getUserName(access_token)) {
				ret.status = -1;
			}
			else {
				ret.data = taskvm.kill(user, id);
				ret.status = ret.data ? 1 : 0;
			}
			res.sendJSON(ret);
		},
		
		/* 运行一次任务 */
		'/:user/once':	function (req, res) {
			var user = req.path.user;
			var id = req.qs.id;
			var ret = {}
			// 验证权限
			var access_token = req.qs.access_token;
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
			var access_token = req.qs.access_token;
			if (user != getUserName(access_token)) {
				ret.status = -1;
			}
			else {
				ret.data = taskvm.exec(user, code);
				ret.status = ret.data ? 1 : 0;
			}
			res.sendJSON(ret);
		}
	}

	web.get(getRouter);
	web.post(postRouter);
}