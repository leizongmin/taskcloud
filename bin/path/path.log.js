/**
 * taskcloud Web 用户日志管理
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
 * @param {logcache} logcache logcache实例
 * @param {function} getUserName 通过access_token获取用户名
 */
module.exports = function (web, logger, logcache, getUserName) {
	logger('Loading web path: log');
	
	var getRouter = {
	
		/* 获取指定用户的日志 */
		'/:user/loglist':	function (req, res) {
			var user = req.path.user;
			var ret = {}
			// 验证权限
			var access_token = req.qs.access_token || req.cookie.access_token;
			if (user != getUserName(access_token)) {
				ret.status = -1;
			}
			else {
				ret.data = logcache.get(user);
				ret.status = 1;
			}
			res.sendJSON(ret);
		},
		
		/* 获取指定任务的日志 */
		'/:user/log/:id':	function (req, res) {
			var user = req.path.user;
			var id = req.path.id;
			var ret = {}
			// 验证权限
			var access_token = req.qs.access_token || req.cookie.access_token;
			if (user != getUserName(access_token)) {
				ret.status = -1;
			}
			else {
				ret.data = logcache.get(user, id);
				ret.status = 1;
			}
			res.sendJSON(ret);
		}
	}
	
	web.get(getRouter);
}