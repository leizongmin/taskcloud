/**
 * taskcloud web 公共代码
 *
 * @author leizongmin<leizongmin@gmail.com>
 * @version 0.1
 */

var config = require('./config.inc');

var g = module.exports = {}

/********************************************* taskvm ***************************************************/
g.taskvm = require('../../lib/taskvm');
g.logcache = require('../../lib/logcache');


/********************************************** 登录验证 ************************************************/
g.auth = require('./lib/auth');


/************************************************** 模板管理 **************************************/
var path = require('path');
var fs = require('fs');

var TEMPLATE_PATH = './task_templates';

var debug = function (msg) { console.log(msg); }

/**
 * 取模板列表
 *
 * @param {string} user 用户名
 * @return {array}
 */
g.tpl_list = function (user) {
	try {
		if (!user)
			user = '';
		var template_path = path.resolve(TEMPLATE_PATH, user);	debug(template_path);
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
 *
 * @param {string} user 用户名
 * @param {string} name 模板名称
 * @return {string}
 */
g.tpl_get = function (user, name) {
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
 *
 * @param {string} user 用户名
 * @param {string} name 模板名称
 * @param {string} code 代码
 * @return {bool}
 */
g.tpl_set = function (user, name, code) {
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