/**
 * taskcloud虚拟机 模版缓存
 *
 * @author leizongmin<leizongmin@gmail.com>
 * @version 0.1
 */
 
/*
 * 依赖此模块：taskvm
 */ 
 
var cache = module.exports;


var path = require('path');
var fs = require('fs');
var vm = require('vm');

cache.logger = function () { console.log.apply(null, arguments); }
var debug = function () {
	if (cache.logger)
		cache.logger.apply(null, arguments);
}

/* 模版目录 */
cache.dirname = './task_templates';

/* script对象缓存 */
cache.cache = {};

/**
 * 初始化模版目录
 *
 * @param {string} dirname 绝对路径
 */
cache.init = function (dirname) {
	cache.dirname = dirname;
}

/**
 * 获取指定模版的script对象
 *
 * @param {string} name 模版名称
 * @return {vm.Script} 返回false表示读取模板出错，返回string 类型表示编译出错信息
 */
cache.get = function (name) {
	if (name in cache.cache)
		return cache.cache[name];
	// 如果不在缓存中，则先编译
	var code = readTemplate(name);
	if (!code)
		return false;
	var script = compile(code, name);
	if (typeof script == 'string')
		return script;
	cache.cache[name] = script;
	return script;
}

/**
 * 读入模版文件内容
 *
 * @param {string} name 模版名称
 * @return {string}
 */
var readTemplate = function (name) {
	debug('Read template [' + name + ']');
	var filename = path.resolve(cache.dirname, name + '.js');
	try {
		var code = fs.readFileSync(filename);
		// 当文件改变时，删除缓存
		fs.unwatchFile(filename);
		fs.watchFile(filename, function () {
			if (name in cache.cache) {
				delete cache.cache[name];
				debug('Remove template cache: ' + name); 
			}
		});
		return code;
	}
	catch (err) {
		debug('Read template error: ' + err);
		return false;
	}
}

/**
 * 编译模版代码
 *
 * @param {string} code 代码
 * @param {string} name 模版名称
 * @return {vm.Script} 返回string格式表示出错信息
 */
var compile = function (code, name) {
	debug('Compile template [' + name + ']');
	var code = wrap(code);
	try {
		var s = vm.createScript(code, 'template://' + name);
		return s;
	}
	catch (err) {
		debug('Compile template error: ' + err);
		return err.toString();
	}
}

/**
 * 保证代码
 *
 * @param {string} code 代码
 * @return {string}
 */
var wrap = function (code) {
	return	'try {\n task.start();\n var args = task.get("arguments");\n } catch (err) { task.end(); debug(\'运行任务出错：\' + err.stack);}' +
			code;
}