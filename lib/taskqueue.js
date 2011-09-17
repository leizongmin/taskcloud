/**
 * taskcloud虚拟机 任务队列管理
 *
 * @author leizongmin<leizongmin@gmail.com>
 * @version 0.1
 */
 
/*
 * 依赖此模块：taskvm, snapshot
 */
 
var queue = module.exports;

queue.logger = function () { console.log.apply(null, arguments); }
var debug = function () {
	if (queue.logger)
		queue.logger.apply(null, arguments);
}

/* 任务类型 */
queue.AUTO_RUN = 1;		// 自动运行
queue.NOT_AUTO_RUN = 0;	// 不自动运行

/* 运行状态 */
queue.STATUS_RUNNING = 1;	// 正在运行
queue.STATUS_READY = 0;		// 运行完毕

/**
 * 创建一个队列管理实例
 *
 * @param {string} user 用户名
 */
var UserQueue = queue.UserQueue = function (user) {
	this.username = user;
	/* 队列 */
	this.queue = {
		auto: {},		// 自动运行队列
		wait: {},		// 准备自动运行队列
		sleep: {}		// 休眠队列
	}
	debug('Create an UserQueue. [' + user + ']');
}

/**
 * 加入队列
 *
 * @param {int} id 任务ID
 * @param {int} isAuto 是否自动运行
 * @param {string} template 模版名称
 * @param {string} access_token 授权码
 * @param {int} cycle 运行周期
 * @param {int} auto_start 开始时间
 * @param {int} auto_end 结束时间
 */
UserQueue.prototype.add = function (id, isAuto, template, access_token, cycle, auto_start, auto_end) {
	// 先删除原来的
	this.remove(id);
	
	if (typeof auto_start == 'undefined') auto_start = 0;
	if (typeof auto_end == 'undefined') auto_end = 0;
	
	// 判断是否已超过auto_end时间，如果是，则不添加任务
	var timestamp = new Date().getTime();
	if (auto_end > 0 && timestamp > auto_end) {
		debug('The current time later than auto_end time. [' + this.username + ']');
		return;
	}
	
	if (isAuto) {
		var t = {
			task_id:		id,					// 任务ID
			template:		template,			// 模版
			access_token:	access_token,		// 授权码
			cycle:			cycle,				// 循环周期
			auto_start:		auto_start,			// 自动启动时间
			auto_end:		auto_end,			// 自动结束时间
			status:			queue.STATUS_READY,	// 运行状态
			timestamp:		timestamp,			// 时间戳
			username:		this.username		// 用户名
		}
		if (auto_start) {
			this.queue.wait[id] = t;
			debug('Add a [wait] task: ' + id + ' [' + this.username + ']');
		}
		else {
			this.queue.auto[id] = t;
			debug('Add an [auto] task: ' + id + ' [' + this.username + ']');
		}
	}
	else {
		var t = {
			task_id:		id,				// 任务ID
			template:		template,		// 模版
			access_token:	access_token,	// 授权码
			username:		this.username	// 用户名
		}
		this.queue.sleep[id] = t;
		debug('Add a [sleep] task: ' + id + ' [' + this.username + ']');
	}
}

/**
 * 获取即将运行的任务
 *
 * @return {array}
 */
UserQueue.prototype.scan = function () {
	var time = new Date().getTime();
	var ret = {};
	
	// 扫描自动运行队列
	for (i in this.queue.auto) {
		var t = this.queue.auto[i];							// debug(t);
		// 任务的状态必须为READY
		if (t.status == queue.STATUS_READY) {
			if (t.timestamp + t.cycle <= time) {
				ret[t.task_id] = t;
			}
		}
		// 检查任务是否到达自动结束时间
		if (t.auto_end > 0 && t.auto_end <= time) {
			delete this.queue.auto[i];
			debug('Task auto end. [auto] ' + t.task_id + ' [' + this.username + ']');
		}
	}
	
	// 扫描等待运行队列
	for (i in this.queue.wait) {
		var t = this.queue.wait[i];							// debug(t);
		// 检查是否到达自动开始时间
		if (t.auto_start <= time) {
			ret[t.task_id] = t;
			// 将任务转移到auto队列
			this.queue.auto[t.task_id] = t;
			delete this.queue.wait[t.task_id];
			debug('Task switch to [auto] ' + t.task_id + ' [' + this.username + ']');
		}
		// 检查是否到达自动结束时间
		if (t.auto_end > 0 && t.auto_end <= time) {
			delete this.queue.wait[i];
			debug('Task auto end. [wait] ' + t.task_id + ' [' + this.username + ']');
		}
	}
	
	return ret;
}

/**
 * 删除任务
 *
 * @param {int} id 任务ID
 * @return {bool}
 */
UserQueue.prototype.remove = function (id) {
	if (id in this.queue.auto) {
		delete this.queue.auto[id];
		debug('Remove task ' + id + ' from [auto] [' + this.username + ']');
		return true;
	}
	if (id in this.queue.wait) {
		delete this.queue.wait[id];
		debug('Remove task ' + id + ' from [sleep] [' + this.username + ']');
		return true;
	}
	if (id in this.queue.sleep) {
		delete this.queue.sleep[id];
		debug('Remove task ' + id + ' from [sleep] ' + this.username + ']');
		return true;
	}
	return false;
}

/**
 * 取任务信息
 *
 * @param {int} id 任务ID
 */
UserQueue.prototype.get = function (id) {
	var info;
	if (id in this.queue.auto) {
		debug('Get task ' + id + ' from [auto] [' + this.username +']');
		info = this.queue.auto[id];
	}
	else if (id in this.queue.wait) {
		debug('Get task ' + id + ' from [sleep] [' + this.username +']');
		info = this.queue.wait[id];
	}
	else if (id in this.queue.sleep) {
		debug('Get task ' + id + ' from [sleep] [' + this.username + ']');
		info = this.queue.sleep[id];
	}
	if (info) {
		var ret = {}
		for (i in info)
			ret[i] = info[i];
		return ret;
	}
	else
		return ret;
}

/**
 * 更改任务运行状态
 *
 * @param {int} id 任务ID
 * @param {int} status 状态
 * @return {bool}
 */
UserQueue.prototype.running = function (id, status) {
	if (typeof status == 'undefined') status = queue.STATUS_RUNNING;
	if (status == false) status = queue.STATUS_READY;
	
	var timestamp = new Date().getTime();
	
	if (id in this.queue.auto) {
		this.queue.auto[id].status = status;
		this.queue.auto[id].timestamp = timestamp;
		debug('Change running status to ' + status + ' [auto] [' + id + '] [' + this.username + ']');
		return true;
	}
	if (id in this.queue.wait) {
		this.queue.wait[id].status = status;
		this.queue.wait[id].timestamp = timestamp;
		debug('Change running status to ' + status + ' [wait] [' + id + '] [' + this.username + ']');
		return true;
	}
	if (id in this.queue.sleep) {
		this.queue.sleep[id].status = status;
		this.queue.sleep[id].timestamp = timestamp;
		debug('Change running status to ' + status + ' [sleep] [' + id + '] [' + this.username + ']');
		return true;
	}
}
 