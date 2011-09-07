/**
 * taskcloud Web 用户任务模板管理
 *
 * @author leizongmin<leizongmin@gmail.com>
 * @version 0.1
 */
 
/*
 * 依赖此模块：server
 */ 

var fs = require('fs'); 
var path = require('path');
 
/**
 * 注册监听器
 *
 * @param {Web.js} web Web.js实例
 * @param {function} logger 输出日志
 * @param {string} template_path 模板根目录
 */
module.exports = function (web, logger, template_path) {
	TEMPLATE_PATH = template_path ? template_path : TEMPLATE_PATH;
	logger('Loading web path: template');
	
	var getRouter = {
		/* 读取用户的模板列表 */
		'/:user/templatelist':	function (req, res) {
			var ret = {}
			ret.data = getTemplateList(req.path.user);
			ret.status = ret.data ? 1 : 0;
			res.sendJSON(ret);
		},
		
		/* 读取模板文件 */
		'/:user/template/:template':	function (req, res) {
			var ret = {}
			ret.data = getTemplateCode(req.path.user, req.path.template);
			ret.status = typeof ret.data == 'string' ? 1 : 0;
			res.sendJSON(ret);
		}
	}
	
	var postRouter = {
		/* 修改模版文件 */
		'/:user/template/:template':	function (req, res) {
			var ret = {}
			ret.data = saveTemplateCode(req.path.user, req.path.template, req.data.code);
			ret.status = ret.data ? 1 : 0;
			res.sendJSON(ret);
		}
	}
	
	web.get(getRouter);
	web.post(postRouter);
}

var TEMPLATE_PATH = '.';
var debug = function () {}

/**
 * 取模板列表
 */
var getTemplateList = function (user) {
	try {
		if (!user)
			user = '';
		var template_path = path.resolve(TEMPLATE_PATH, user);
		var files = fs.readdirSync(template_path);
		var ret = [];
		for (i in files) {
			var f = files[i];
			if (f.substr(-3) == '.js')
				ret.push(f.substr(0, f.length - 3));
		}
		return ret;
	}
	catch (err) {
		debug('Get template list fail: ' + err);
		return false;
	}
}

/**
 * 取模板内容
 */
var getTemplateCode = function (user, name) {
	try {
		var filename = path.resolve(TEMPLATE_PATH, user + '/' + name + '.js');
		var code = fs.readFileSync(filename);
		return code.toString();
	}
	catch (err) {
		debug('Get template code fail: ' + err);
		return false;
	}
}

/**
 * 保存模版内容
 */
var saveTemplateCode = function (user, name, code) {
	if (!code)
		return false;
	try {
		var filename = path.resolve(TEMPLATE_PATH, user + '/' + name + '.js');
		var ret = fs.writeFileSync(filename, code);
		return true;
	}
	catch (err) {
		debug('Save template code fail: ' + err);
		return false;
	}
}