/**
 * taskcloud Web 用户界面管理
 *
 * @author leizongmin<leizongmin@gmail.com>
 * @version 0.1
 */
 
/*
 * 依赖此模块：server
 */
 
var path = require('path');
 
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
			if (ret.data) {
				res.cookie('access_token', ret.data, {
					path:	'/',
					maxAge:	3600 * 7 * 1000
				});
			}
			ret.status = ret.data ? 1 : 0;
			res.sendJSON(ret);
			
		},
		
		/* 注销 */
		'/home/api/logout':	function (req, res) {
			var ret = {}
			var access_token = req.cookie.access_token;
			res.clearCookie('access_token', {path:'/'});
			if (access_token)
				delete usermanager.access_tokens[access_token];
			ret.status = 1;
			res.sendJSON(ret);
		},
		
		/* 获取当前用户名 */
		'/home/api/status':	function (req, res) {
			var ret = {}
			var access_token = req.cookie.access_token;
			var username = usermanager.getUserName(access_token);
			var info = usermanager.users[username];
			ret.status = info ? 1 : 0;
			ret.data = info ? {username: info.username} : false;
			res.sendJSON(ret);
		},
		
		/* 网站首页 */
		'/':	function (req, res) {
			var ret = {}
			var access_token = req.cookie.access_token;
			// 检查是否已登录
			var username = usermanager.getUserName(access_token);
			if (username) {
				res.redirect('/home/index');
			}
			else {
				res.sendFile('./bin/web/login.html');
			}
		},
		
		/* 管理首页 */
		'/home/index':	function (req, res) {
			var access_token = req.cookie.access_token;
			// 检查是否已登录
			var username = usermanager.getUserName(access_token);
			if (username) {
				var data = {
					username: username
				}
				res.send(web.render('index', data));
			}
			else {
				res.redirect('/');
			}
		},
		
		/* 模板管理 */
		'/home/templates':	function (req, res) {
			var access_token = req.cookie.access_token;
			// 检查是否已登录
			var username = usermanager.getUserName(access_token);
			if (username) {
				var data = {
					username: username
				}
				res.send(web.render('editor', data));
			}
			else {
				res.redirect('/');
			}
		}
	}
	
	web.get(getRouter);
}




