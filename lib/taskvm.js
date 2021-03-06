/**
 * taskcloud虚拟机
 *
 * @author leizongmin<leizongmin@gmail.com>
 * @version 0.1
 */
 
/*
 * 依赖此模块：session, server, logcache, snapshot
 */
 
var templatecache = require('./templatecache');		// 模版缓存模块
var taskqueue = require('./taskqueue');				// 任务队列模块
var UserQueue = taskqueue.UserQueue;					// 用户任务队列对象
var datacache = require('./datacache');				// 数据缓存模块
var session = require('./session');					// 任务会话模块
var rest = require('./rest');							// REST网络访问模块
var cmdparser = require('./cmdparser');				// 命令/数据解析模块
var logcache = require('./logcache');					// 日志缓存模块
var snapshot = require('./snapshot');					// taskqueue快照模块

var path = require('path');

var taskvm = module.exports;
/** 版本号 */
taskvm.version = '0.1.0';

taskvm.logger = function () { console.log.apply(null, arguments); }
var debug = function () {
	if (taskvm.logger)
		taskvm.logger.apply(null, arguments);
}

/** 默认任务队列扫描周期 */
taskvm.cycle = 1000;	// ms
var _taskvm_auto_scan = false;

/** 用户任务队列列表 */
taskvm.users = {}

/**
 * 初始化
 *
 * @param {string} template_dir 任务模版所在目录
 * @param {int} queue_cycle 扫描周期(ms)
 */
taskvm.init = function (template_dir, queue_cycle) {
	// 配置各个模块的logger
	templatecache.logger = taskvm.logger;
	taskqueue.logger = taskvm.logger;
	datacache.logger = taskvm.logger;
	session.logger = taskvm.logger;
	rest.logger = taskvm.logger;
	cmdparser.logger = taskvm.logger;
	logcache.logger = taskvm.logger;
	snapshot.logger = taskvm.logger;
	
	// 配置任务模版所在目录
	if (template_dir)
		templatecache.dirname = template_dir;
		
	// 配置队列扫描周期，必须大于100ms
	if (queue_cycle >= 100) 
		taskvm.cycle = queue_cycle;
		
	// 输出配置信息
	debug('Init taskvm: cycle=' + taskvm.cycle + 'ms,  ' + 'template_dir=' + template_dir);
}

/**
 * 加入任务
 *
 * @param {string} username 用户名
 * @param {string} code 命令代码
 * @return {int} 返回创建成功后的任务ID
 */
taskvm.exec = function (username, code) {
	if (typeof username != 'string' || username == '')
		var username = 'public';
	var cmd = cmdparser.parser(code);
	if (!cmd) {
		debug('Parsing task start-code error: bad format. [' + username + ']');
		return -1;
	}
	
	// 任务默认参数
	var t = cmd.task;
	// 如果没有指定任务ID，则动态分配一个
	if (typeof t.id  == 'undefined' || t.id < 1) {
		t.id = getRandomId(username);
		debug('Warning: auto assigns a task id: ' + t.id);
	}
	if (typeof t.template == 'undefined') {
		debug('Parsing task start-code error: missing template. [' + username + ']');
		return -2;
	}
	if (isNaN(t.id)) {
		debug('Parsing task start-code error: id must a number. [' + username + ']');
		return -3;
	}
	t.template = t.template.toString().trim();
	if (t.template == '') {
		debug('Parsing task start-code error: template cannot be empty. [' + username + ']');
		return -4;
	}
	// t.template = username + '/' + t.template;
	if (typeof t.auto == 'undefined')
		t.auto = true;
	t.auto = t.auto ? true : false;
	if (typeof t.cycle == 'undefined')
		t.cycle = 0;
	if (typeof t.access_token == 'undefined')
		t.access_token = '';
	if (typeof t.start == 'undefined')
		t.start = 0;
	if (typeof t.end == 'undefined')
		t.end = 0;
	if (isNaN(t.start))
		t.start = 0;
	if (isNaN(t.end))
		t.end = 0;
	if (isNaN(t.cycle))
		t.cycle = 0;
	if (t.cycle < 1)
		t.auto = false;
	
	// 载入任务模版，如果模板名称以'#'开头，则视为公共模板
	if (t.template.substr(0, 1) == '#')
		var s = templatecache.get('public/' + t.template.substr(1));
	else
		var s = templatecache.get(username + '/' + t.template);
	if (s == false) {
		debug('Loading task template [' + t.template + '] error! [' + username + ']');
		return -5;
	}
	else if (typeof s == 'string') {
		debug('Compiling task template [' + t.template + '] error! [' + username + ']\n' + s);
		taskvm._compile_error_info = s;
		return -6;
	}
	
	// 加入任务到队列
	if (!(username in taskvm.users)) {
		taskvm.users[username] = new UserQueue(username);
	}
	var queue = taskvm.users[username];
	queue.add(t.id, t.auto, t.template, t.access_token, t.cycle, t.start, t.end);
	
	// 加入预设数据
	datacache.set(username + '/' + t.id + '/arguments', cmd.data);
	logcache.log(username, t.id, '部署任务[' + t.template + ']');
	
	return t.id;
}

/**
 * 开始自动扫描队列，并运行任务
 */
taskvm.start = function () {
	_taskvm_auto_scan = true;
	if (taskvm.cycle >= 100)  {
		auto_scan_and_run();
		debug('Start taskvm.');
	}
	else
		debug('Start taskvm fail: cycle=' + taskvm.cycle + 'ms');
}
/** 扫描任务队列并运行任务 */
var auto_scan_and_run = function () {
	for (i in taskvm.users) {
		var queue = taskvm.users[i];
		var list = queue.scan();
		for (j in list) {
			var t = list[j];
			run_in_sandbox(t);
		}
	}
	
	// 继续自动扫描
	if (_taskvm_auto_scan)
		setTimeout(auto_scan_and_run, taskvm.cycle);
}
/** 在沙箱中运行任务 */
var run_in_sandbox = function (t) {
	try {
		// 获取任务模板，以'#'开头的是公共任务模板
		if (t.template.substr(0, 1) == '#')
			var s = templatecache.get('public/' + t.template.substr(1));
		else
			var s = templatecache.get(t.username + '/' + t.template);
		
		if (!s) {
			debug('Start task [' + t.task_id + '] fail: missing template. [' + t.template + '] [' + t.username + ']');
			return false;
		}
		
		// 创建环境
		var sandbox = session.create(t.username, t.task_id, t.access_token, path.resolve(templatecache.dirname, t.username));
		s.runInNewContext(sandbox);
		return true;
	}
	catch (err) {
		debug('Start task [' + t.username + '] [' + t.task_id + '] fail: ' + err.stack);
		logcache.log(t.username, t.task_id, err.stack);
		return false;
	}
}


/**
 * 停止自动扫描队列
 */
taskvm.stop = function () {
	_taskvm_auto_scan = false;
	debug('Stop taskvm.');
}

/**
 * 获取任务队列
 *
 * @param {string} username 用户名，如果没有设置用户名则返回所有用户的任务列表
 * @return {object} 
 */
taskvm.list = function (username) {
	if (typeof username != 'undefined') {
		var queue = taskvm.users[username];
		return queue ? queue.queue : false;
	}
	else {
		var ret = {}
		for (i in taskvm.users)
			ret[i] = taskvm.users[i].queue;
		return ret;
	}
}

/**
 * 删除指定任务
 *
 * @param {string} username 用户名
 * @param {int} id 任务ID
 */
taskvm.kill = function (username, id) {
	if (username in taskvm.users)
		return taskvm.users[username].remove(id);
}

/**
 * 运行一次指定任务
 *
 * @param {string} username 用户名
 * @param {int} id 任务ID
 * @return {bool}
 */
taskvm.once = function (username, id) {
	if (username in taskvm.users) {
		var t = taskvm.users[username].get(id);
		if (!t)
			return false;
		
		return run_in_sandbox(t);
	}
}

/**
 * 获取一个未被占用的task_id
 *
 * @param {string} username
 * @return {int}
 */
var getRandomId = function (username) {
	if (username in taskvm.users) {
		var queue = taskvm.users[username];
		var i = 0;
		do {
			var id = (new Date().getTime()) % 10000;
			var t = queue.get(id);
			i++;
		} while (t && i < 1000);
		return id;
	}
	else {
		return (new Date().getTime()) % 10000;
	}
}