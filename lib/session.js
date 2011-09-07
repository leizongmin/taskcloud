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



/**
 * 创建任务执行环境，作为vm的沙箱
 *
 * @param {string} username 用户名
 * @param {int} id 任务ID
 * @param {string} access_token 授权码
 */
session.create = function (username, id, access_token) {
	var sandbox = {
		require:	session_require,						// require函数
		rest:		rest,									// REST模块
		Jscex:		Jscex,									// Jscex异步编程模块
		task:		new TaskSession(username, id, access_token),		// 用于操作任务队列
		util: {												// 工具集
			mustache:		Mustache						// Mustache模版引擎
		},
		debug:		function () {							// 调试输出函数
			debug('Debug [' + id + ']:');
			debug.apply(this, arguments);
			//debug('==========================================================');
		},
		setTimeout:		setTimeout,							// setTimeout函数
		setInterval:	setInterval							// setInterval函数
	}
	sandbox.global = sandbox.GLOBAL = sandbox.Global = sandbox.module = sandbox;
	return sandbox;
}


//---------------------------------------------
/** 允许加载的模块 */
var LIMIT_MODULES = ['util', 'events', 'stream', 'crypto', 'dns', 'url', 'querystring'];
/** require函数 */
session_require = function (name) {
	var name = name.trim();
	// 不允许调用本地文件
	if (name.substr(0, 1) == '.')
		return false;
	// 不允许调用危险模块
	for (i in LIMIT_MODULES)
		if (name == LIMIT_MODULES[i])
			return require(name);
	return false;
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
	var k = this.id + '/' + k;
	return datacache.get(k);
}
/* 设置数据 */
TaskSession.prototype.set = function (k, v) {
	var k = this.id + '/' + k;
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

