/**
 * taskcloud虚拟机 Web接口
 *
 * @author leizongmin<leizongmin@gmail.com>
 * @version 0.1
 */
 
var web = require('QuickWeb');

var taskvm = require('../lib/taskvm');
var logcache = require('../lib/logcache');
var snapshot = require('../lib/snapshot');

var server = module.exports;

/**
 * 启动一个HTTP服务实例
 *
 * @param {int} server_port 服务器端口
 * @param {string} template_dir 任务模版目录
 * @param {int} queue_cycle 任务扫描周期
 * @param {int} snapshot_cycle 快照保存周期
 * @param {int} snapshot_path 快照保存路径
 * @param {int} time_zone 时区 例：+8
 */
server.run = function (server_port, template_dir, queue_cycle, snapshot_cycle, snapshot_path, time_zone) {
	/* 默认参数 */
	// 默认端口为8080
	if (typeof server_port == 'undefined' || server_port < 1)
		server_port = 8080;
	// 默认模板目录
	if (!template_dir)
		template_dir = './task_templates';
	// 默认扫描周期为1秒, 不能小于1秒
	if (typeof queue_cycle == 'undefined' || queue_cycle < 100)
		queue_cycle = 1000;
	// 默认快照周期为10分钟, 不能小于10秒
	if (typeof snapshot_cycle == 'undefined' || snapshot_cycle < 10000)
		snapshot_cycle = 600000;
	// 默认快照保存路径
	if (!snapshot_path)
		snapshot_path = './snapshot.json';
	// 默认时区为+8
	if (isNaN(time_zone))
		time_zone = 8;
		
	console.log('----------------------  Server config  ----------------------');
	console.log('server_port = ' + server_port);
	console.log('template_dir = ' + template_dir);
	console.log('queue_cycle = ' + queue_cycle);
	console.log('snapshot_cycle = ' + snapshot_cycle);
	console.log('snapshot_path = ' + snapshot_path);
	console.log('time_zone = ' + time_zone);
	console.log('-------------------------------------------------------------');
	
	//--------------------------初始化日志记录---------------------------------------------
	var debug = logger = function (msg) {
		var date = new Date();
		date.setTime(date.getTime() + 3600000 * time_zone);		// 设置时区
		var str_time = date.getUTCFullYear() + '/' + (date.getUTCMonth() + 1) + '/' + date.getUTCDate() + ' ' + 
						date.getUTCHours() + ':' + date.getUTCMinutes() + ':' + date.getUTCSeconds();
		var msg = '[' + str_time + '] ' + msg;
		console.log(msg);
	}
	taskvm.logger = logger;
	
	//--------------------------初始化QuickWeb--------------------------------------------
	web.set('wwwroot', __dirname + '/html');			// 网站根目录
	web.set('code_path', __dirname + '/code');			// 代码目录
	web.set('template_path', __dirname + '/html');		// 模板目录
	
	web.loadPlus();
	web.create(server_port);
	

	//--------------------------初始化taskvm--------------------------------------------
	taskvm.init(template_dir, queue_cycle);
	taskvm.start();
	
	//--------------------------初始化snapshot--------------------------------------------
	snapshot.load(snapshot_path, function (ok) {
		debug('Load snapshot data ' + (ok ? 'success.' : 'fail!'));
	});
	setInterval(function () {
		snapshot.save(snapshot_path, function (ok) {
			debug('Save snapshot data ' + (ok ? 'success.' : 'fail!'));
		});
	}, snapshot_cycle);
	

	console.log('+------------------------------------------------------------------+');
	console.log('+                                                                  +');
	console.log('+               Server start!                                      +');
	console.log('+                                                                  +');
	console.log('+------------------------------------------------------------------+');
}


//--------------------------防止意外退出--------------------------------------------
process.on('uncaughtException', function (err) {
	console.log(err.stack);
});
process.on('exit', function () {
	console.log('Server exit.');
});
