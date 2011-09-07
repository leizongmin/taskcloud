/**
 * taskcloud Web 用户界面管理
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
 * @param {usermanager} usermanager usermanager模块
 */
module.exports = function (web, logger, usermanager) {
	logger('Loading web path: home');

	var getRouter = {
		
		/* 登录 */
		'/home/api/login':	function (req, res) {
			var username = req.qs.username;
			var password = req.qs.password;
			var ret = {}
			ret.data = usermanager.login(username, password);
			ret.status = ret.data ? 1 : 0;
			res.sendJSON(ret);
		} 
	}
	
	web.get(getRouter);
}




