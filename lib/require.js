/**
 * taskcloud虚拟机 加载用户自定义模块
 *
 * @author leizongmin<leizongmin@gmail.com>
 * @version 0.1
 */
 
/*
 * 依赖此模块：session
 */
 
var logcache = require('./logcache');

var vm = require('vm');
var fs = require('fs');

/** 缓存 */
var CACHE = {}

var debug = function (msg) { console.log('require: ' + msg); }


/**
 * 加载用户模块
 *
 * @param {string} filename 文件完整路径
 * @param {object} sandbox 当前任务session的沙箱
 * @return {object} 失败返回string类型描述信息
 */
module.exports = function (filename, sandbox) {
	if (!sandbox)
		sandbox = {}
	sandbox.module = {exports: {}}
	
	// 如果在缓存中，则直接返回
	if (filename in CACHE) {
		CACHE[filename].runInNewContext(sandbox);
		debug('require ' + filename + ' from cache.');
		return sandbox.module.exports;
	}
	
	// 否则，载入并编译代码
	try {
		debug('compile ' + filename);
		var code = fs.readFileSync(filename);
		code = warp(code);
		var s = vm.createScript(code, filename);
		
		CACHE[filename] = s;
		fs.unwatchFile(filename);
		fs.watchFile(filename, function () {
			debug('remove ' + filename + ' from cache.');
			delete CACHE[filename];
		});
		
		return module.exports(filename, sandbox);
	}
	catch (err) {
		// 记录日志
		sandbox.task.log('编译模块\'' + filename + '\'时出错：\n' + err);
		return err.stack;
	}
}

/**
 * 保证代码
 *
 * @param {string} code 代码
 * @return {string}
 */
var warp = function (code) {
	return 	'(function () {\n' + code + '\n})();';
}