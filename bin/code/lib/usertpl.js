/**
 * taskcloud Web 用户模板管理
 *
 * @author leizongmin<leizongmin@gmail.com>
 * @version 0.1
 */

var path = require('path');
var fs = require('fs');

var TEMPLATE_PATH = './task_templates';

var debug = function (msg) {
	console.log('[usertpl] ' + msg);
}

var usertpl = module.exports = {}

/**
 * 取模板列表
 *
 * @param {string} user 用户名
 * @param {function} callback 回调函数
 */
usertpl.getList = function (user, callback) {
	try {
		if (!user)
			user = '';
		var template_path = path.resolve(TEMPLATE_PATH, user);	debug(template_path);
		
		fs.readdir(template_path, function (err, files) {
			if (err) {
				debug('Get template list fail: ' + err);
				callback(false);
				return;
			}
			
			var ret = [];
			for (i in files) {
				var f = files[i];
				if (f.substr(-3) == '.js')
					ret.push(f.substr(0, f.length - 3));
			}
			callback(ret);
		});
	}
	catch (err) {
		debug('Get template list fail: ' + err);
		callback(false);
	}
}

/**
 * 取模板内容
 *
 * @param {string} user 用户名
 * @param {string} name 模板名称
 * @param {function} callback 回调函数
 */
usertpl.get = function (user, name, callback) {
	try {
		var filename = path.resolve(TEMPLATE_PATH, user + '/' + name + '.js');
		
		fs.readFile(filename, function (err, data) {
			if (err) {
				debug('Get template code fail: ' + err);
				callback(false);
			}
			else {
				callback(data.toString());
			}
		});
	}
	catch (err) {
		debug('Get template code fail: ' + err);
		callback(false);
	}
}

/**
 * 保存模版内容
 *
 * @param {string} user 用户名
 * @param {string} name 模板名称
 * @param {string} code 代码
 * @param {function} callback 回调函数
 */
usertpl.set = function (user, name, code, callback) {
	if (!code) {
		callback(false);
		return;
	}
	try {
		var filename = path.resolve(TEMPLATE_PATH, user + '/' + name + '.js');
		
		fs.writeFile(filename, code, function (err) {
			if (err) {
				debug('Save template code fail: ' + err);
				callback(false);
			}
			else {
				callback(true);
			}
		});
	}
	catch (err) {
		debug('Save template code fail: ' + err);
		callback(false);
	}
}