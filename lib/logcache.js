/**
 * taskcloud虚拟机 日志缓存
 *
 * @author leizongmin<leizongmin@gmail.com>
 * @version 0.1
 */
 
/*
 * 依赖此模块：session, taskvm, require
 */
 
var logcache = module.exports;

logcache.logger = function () { console.log.apply(null, arguments); }
var debug = function () {
	if (logcache.logger)
		logcache.logger.apply(null, arguments);
}

var taskvm = require('./taskvm');

/** 时区 */
logcache.timezone = 8;
/** 日志缓存数目 */
logcache.count = 20;
/** 自动回收失效的任务ID，扫描周期，单位ms */
logcache.recover_cycle = 1000;

/** 日志频道 */
logcache.users = {}

/**
 * 初始化
 *
 * @param {int} count 缓存数目
 * @param {int} timezone 时区
 */
logcache.init = function (count, timezone) {
	if (typeof count != 'undefined' && count > 0)
		logcache.count = count;
	if (typeof timezone != 'undefined')
		logcache.timezone = timezone;
}

/**
 * 记录日志
 *
 * @param {string} username 用户名
 * @param {int} task_id 任务ID
 * @param {string} message 日志内容
 * @param {bool}
 */
logcache.log = function (username, task_id, message) {
	if (typeof username == 'undefined' || typeof task_id == 'undefined' || typeof message == 'undefined')
		return false;
	var time = getStrTime();
	var line = '[' + time + '] ' + message;
	if (!(username in logcache.users))
		logcache.users[username] = {}
	if (!(task_id in logcache.users[username]))
		logcache.users[username][task_id] = [];
	var c = logcache.users[username][task_id];
	c.push(line);
	while (c.length >= logcache.count)
		c.shift();
	// console.log('[logcache] ' + line);
	return true;
}

/**
 * 获取指定频道的日志
 *
 * @param {string} username 用户名
 * @param {int} task_id 任务ID
 * @return {array}
 */
logcache.get = function (username, task_id) {
	if (typeof username == 'undefined')
		return [];
	var c = logcache.users[username];
	if (typeof task_id == 'undefined') {
		if (typeof c == 'undefined')
			return {};
		else
			return c;
	}
	else {
		if (typeof c == 'undefined')
			return [];
		else {
			var c = c[task_id];
			if (typeof c == 'undefined')
				return [];
			else
				return c;
		}
	}
}

/**
 * 获取文本格式的时间
 *
 * @return {string}
 */
var getStrTime = function () {
	var date = new Date();
	var time = date.getTime();
	date.setTime(time + logcache.timezone * 3600000);
	var str_time = date.getUTCFullYear() + '/' + (date.getUTCMonth() + 1) + '/' + date.getUTCDate() + ' ' + 
						date.getUTCHours() + ':' + date.getUTCMinutes() + ':' + date.getUTCSeconds();
	return str_time;
}

/** 无效任务ID回收 */
var scan_and_recover = function () {
	debug('Start logcache recover...');
	for (var i in logcache.users) {
		var u = logcache.users[i];
		var ts = taskvm.list(i);
		var tids = {}
		for (var j in ts) {			// auto, wait, sleep队列
			var tq = ts[j];
			for (var k in tq) {		// 相应队列下的任务
				var id = tq[k].task_id;
				tids[id] = {}
			}
		}
		// 检查失效的任务ID
		for (var j in u) {
			if (!(j in tids)) {
				delete u[j];
				debug('Recovering failure task id: [' + j + ']');
			}
		}
	}
}
/** 自动扫描 */
var auto_scan = function () {
	scan_and_recover();
	setTimeout(auto_scan, logcache.recover_cycle);
}
auto_scan();