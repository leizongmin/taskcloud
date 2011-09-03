/**
 * taskcloud虚拟机 任务队列
 *
 * @author leizongmin<leizongmin@gmail.com>
 * @version 0.1
 */
 
var queue = module.exports;

queue.logger = function () { console.log.apply(null, arguments); }
var debug = function () {
	if (queue.logger)
		queue.logger.apply(null, arguments);
}

/* 队列 */
queue.queue = {
	auto: {},		// 自动运行队列
	wait: {},		// 准备自动运行队列
	sleep: {}		// 休眠队列
}

/* 任务类型 */
queue.AUTO_RUN = 1;		// 自动运行
queue.NOT_AUTO_RUN = 0;	// 不自动运行

/* 运行状态 */
queue.STATUS_RUNNING = 1;	// 正在运行
queue.STATUS_READY = 0;		// 运行完毕

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
queue.add = function (id, isAuto, template, access_token, cycle, auto_start, auto_end) {
	// 先删除原来的
	queue.remove(id);
	
	if (typeof auto_start == 'undefined') auto_start = 0;
	if (typeof auto_end == 'undefined') auto_end = 0;
	
	// 判断是否已超过auto_end时间，如果是，则不添加任务
	var timestamp = new Date().getTime();
	if (auto_end > 0 && timestamp > auto_end) {
		debug('The current time later than auto_end time.');
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
			timestamp:		timestamp			// 时间戳
		}
		if (auto_start) {
			queue.queue.wait[id] = t;
			debug('Add a [wait] task: ' + id);
		}
		else {
			queue.queue.auto[id] = t;
			debug('Add an [auto] task: ' + id);
		}
	}
	else {
		var t = {
			task_id:		id,				// 任务ID
			template:		template,		// 模版
			access_token:	access_token,	// 授权码
		}
		queue.queue.sleep[id] = t;
		debug('Add a [sleep] task: ' + id);
	}
}

/**
 * 获取即将运行的任务
 *
 * @return {array}
 */
queue.scan = function () {
	var time = new Date().getTime();
	var ret = {};
	
	// 扫描自动运行队列
	for (i in queue.queue.auto) {
		var t = queue.queue.auto[i];
		// 任务的状态必须为READY
		if (t.status == queue.STATUS_READY) {			// debug((t.timestamp + t.cycle) - time);
			if (t.timestamp + t.cycle <= time) {
				ret[t.task_id] = t;
			}
		}
		// 检查任务是否到达自动结束时间
		if (t.auto_end > 0 && t.auto_end <= time) {
			delete queue.queue.auto[i];
			debug('Task auto end. [auto] ' + t.task_id);
		}
	}
	
	// 扫描等待运行队列
	for (i in queue.queue.wait) {
		var t = queue.queue.wait[i];
		// 检查是否到达自动开始时间
		if (t.auto_start <= time) {
			ret[t.task_id] = t;
			// 将任务转移到auto队列
			queue.queue.auto[t.task_id] = t;
			delete queue.queue.wait[t.task_id];
			debug('Task switch to [auto] ' + t.task_id);
		}
		// 检查是否到达自动结束时间
		if (t.auto_end > 0 && t.auto_end <= time) {
			delete queue.queue.wait[i];
			debug('Task auto end. [wait] ' + t.task_id);
		}
	}
	
	return ret;
}

/**
 * 删除任务
 *
 * @param {int} id 任务ID
 */
queue.remove = function (id) {
	if (id in queue.queue.auto) {
		delete queue.queue.auto[id];
		debug('Remove task ' + id + ' from [auto]');
	}
	if (id in queue.queue.wait) {
		delete queue.queue.wait[id];
		debug('Remove task ' + id + ' from [sleep]');
	}
	if (id in queue.queue.sleep) {
		delete queue.queue.sleep[id];
		debug('Remove task ' + id + ' from [sleep]');
	}
}

/**
 * 取任务信息
 *
 * @param {int} id 任务ID
 */
queue.get = function (id) {
	if (id in queue.queue.auto) {
		debug('Get task ' + id + ' from [auto]');
		return queue.queue.auto[id];
	}
	if (id in queue.queue.wait) {
		debug('Get task ' + id + ' from [sleep]');
		return queue.queue.wait[id];
	}
	if (id in queue.queue.sleep) {
		debug('Get task ' + id + ' from [sleep]');
		return queue.queue.sleep[id];
	}
}

/**
 * 更改任务运行状态
 *
 * @param {int} id 任务ID
 * @param {int} status 状态
 */
queue.running = function (id, status) {
	if (typeof status == 'undefined') status = queue.STATUS_RUNNING;
	if (status == false) status = queue.STATUS_READY;
	
	var timestamp = new Date().getTime();
	
	if (id in queue.queue.auto) {
		queue.queue.auto[id].status = status;
		queue.queue.auto[id].timestamp = timestamp;
		debug('Change running status to ' + status + ' [auto] [' + id + ']');
		return;
	}
	if (id in queue.queue.wait) {
		queue.queue.wait[id].status = status;
		queue.queue.wait[id].timestamp = timestamp;
		debug('Change running status to ' + status + ' [wait] [' + id + ']');
		return;
	}
	if (id in queue.queue.sleep) {
		queue.queue.sleep[id].status = status;
		queue.queue.sleep[id].timestamp = timestamp;
		debug('Change running status to ' + status + ' [sleep] [' + id + ']');
		return;
	}
}
 