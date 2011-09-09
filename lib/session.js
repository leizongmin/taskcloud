/**
 * taskcloud虚拟机 任务执行环境
 *
 * @author leizongmin<leizongmin@gmail.com>
 * @version 0.1
 */
 
/*
 * 依赖此模块：taskvm
 */

var session = module.exports;

session.logger = function () { console.log.apply(null, arguments); }
var debug = function () {
	if (session.logger)
		session.logger.apply(null, arguments);
}


var Jscex = require('Jscex');
// 屏蔽Jscex的编译输出
Jscex.config.logger = undefined;

var Mustache = require('mustache');

var rest = require('./rest');
var datacache = require('./datacache');
var taskvm = require('./taskvm');
var logcache = require('./logcache');
var require_usermodule = require('./require');

var path = require('path');
var fs = require('fs');
var vm = require('vm');

/**
 * 创建任务执行环境，作为vm的沙箱
 *
 * @param {string} username 用户名
 * @param {int} id 任务ID
 * @param {string} access_token 授权码
 * @param {string} user_path 用户目录
 * @return {TaskSession}
 */
session.create = function (username, id, access_token, user_path) {
	var sandbox = {}
	
	// require函数
	sandbox.require = function (name) {
		return session_require(name, user_path, sandbox);
	}
	
	// REST模块
	sandbox.rest = rest;
	
	// Jscex异步编程模块
	sandbox.Jscex = Jscex;
	
	// 任务操作模块
	sandbox.task = new TaskSession(username, id, access_token);
	
	// 工具集
	sandbox.util = {
		mustache:		Mustache						// Mustache模版引擎
	}
	
	// 调试输出函数
	sandbox.debug = function (msg) {
		logcache.log(username, id, msg);
	}
	
	// setTimeout函数和setInterval函数
	sandbox.setTimeout = setTimeout;
	sandbox.setInterval = setInterval;
	
	sandbox.global = sandbox.GLOBAL = sandbox.Global = sandbox.module = sandbox;
	return sandbox;
}


//---------------------------------------------
/** 允许加载的模块 */
var LIMIT_MODULES = ['util', 'events', 'stream', 'crypto', 'dns', 'url', 'querystring'];

/**
 * require函数
 *
 * @param {string} name 模块名称
 * @param {string} user_path 用户目录
 * @param {object} sandbox 沙箱
 * @return {object} 返回false表示失败
 */
session_require = function (name, user_path, sandbox) {
	try {
		var name = name.trim();
		// 以.或..开头的模块名可能不安全
		if (name.substr(0, 1) == '.')
			return false;
			
		// 检查用户目录中是否有这些模块
		if (session_check_module(user_path, name))
			return require_usermodule(path.resolve(user_path, name), sandbox);
		if (session_check_module(user_path, name + '.js'))
			return require_usermodule(path.resolve(user_path, name + '.js'), sandbox);
		// 检查用户目录下的node_modules目录
		var user_path2 = path.resolve(user_path, 'node_modules');
		if (session_check_module(user_path2, name))
			return require_usermodule(path.resolve(user_path2, name), sandbox);
		if (session_check_module(user_path2, name + '.js'))
			return require_usermodule(path.resolve(user_path2, name + '.js'), sandbox);
			
		// 不允许调用危险模块
		for (i in LIMIT_MODULES)
			if (name == LIMIT_MODULES[i])
				return require(name);
				
		return false;
	}
	catch (err) {
		return false;
	}
}

/**
 * 检查指定目录是否有指定Js模块
 *
 * @param {string} user_path 目录
 * @param {string} filename
 */
session_check_module = function (user_path, filename) {
	try {
		var files = fs.readdirSync(user_path);
		for (i in files)
			if (filename == files[i])
				return true;
	}
	catch (err) {
		return false;
	}
}


//---------------------------------------------
/** 操作任务队列 */
var TaskSession = function (username, id, access_token) {
	this.username = username;
	this.id = id;
	this.access_token = access_token;
}
/* 取数据 */
TaskSession.prototype.get = function (k) {
	var k = this.username + '/' + this.id + '/' + k;
	return datacache.get(k);
}
/* 设置数据 */
TaskSession.prototype.set = function (k, v) {
	var k = this.username + '/' + this.id + '/' + k;
	return datacache.set(k, v);
}
/* 获取UserQueue实例 */
var getUserQueue = function (username) {
	if (username in taskvm.users)
		return taskvm.users[username];
	else
		return false;
}
/* 任务开始 */
TaskSession.prototype.start = function () {
	var queue = getUserQueue(this.username);
	if (queue)
		return queue.running(this.id);
}
/* 任务结束 */
TaskSession.prototype.end = function () {
	var queue = getUserQueue(this.username);
	if (queue)
		return queue.running(this.id, false);
}
/* 删除自身 */
TaskSession.prototype.remove = function () {
	var queue = getUserQueue(this.username);
	if (queue)
		return queue.remove(this.id);
}
/* 取任务信息 */
TaskSession.prototype.info = function () {
	var queue = getUserQueue(this.username);
	if (queue)
		return queue.get(this.id);
}
/* 重新设置任务队列 */
TaskSession.prototype.modify = function (isAuto, t) {
	var queue = getUserQueue(this.username);
	if (queue)
		return queue.add(this.id, isAuto, t.template, this.access_token, t.cycle, t.auto_start, t.auto_end);
}
/* 修改运行周期 */
TaskSession.prototype.setCycle = function (cycle) {
	var t = this.info();
	t.cycle = cycle;
	return this.modify(true, t);
}
/* 修改自动开始时间 */
TaskSession.prototype.setStart = function (auto_start) {
	var t = this.info();
	t.auto_start = auto_start;
	return this.modify(true, t);
}
/* 修改自动结束时间 */
TaskSession.prototype.setEnd = function (auto_end) {
	var t = this.info();
	t.auto_end = auto_end;
	return this.modify(true, t);
}
/* 切换到睡眠状态 */
TaskSession.prototype.sleep = function () {
	var t = this.info();
	return this.modify(false, t);
}
/* 记录日志 */
TaskSession.prototype.log = function (msg) {
	logcache.log(this.username, this.id, msg);
}
