/**
 * taskcloud虚拟机 Web接口
 *
 * @author leizongmin<leizongmin@gmail.com>
 * @version 0.1
 */
 
var web = require('QuickWeb');
var taskvm = require('../lib/taskvm');
var logcache = require('../lib/logcache');

var server = module.exports;

/**
 * 启动一个HTTP服务实例
 *
 * @param {string} template_dir 任务模版目录
 * @param {string} server_token 授权码，用于验证客户端的身份
 * @param {int} queue_cycle 任务扫描周期
 * @param {int} server_port 服务器端口
 * @param {int} time_zone 时区 例：+8
 */
server.run = function (template_dir, server_token, queue_cycle, server_port, time_zone) {
	/* 默认参数 */
	if (!template_dir)
		template_dir = './task_templates';	// 默认模版目录
	if (typeof queue_cycle == 'undefined' || queue_cycle < 100)
		queue_cycle = 1000;			// 默认扫描周期为1s
	if (typeof server_port == 'undefined' || server_port < 1)
		server_port = 8080;			// 默认端口为8080
	if (isNaN(time_zone))
		time_zone = 8;				// 默认时区为+8
	if (!server_token)
		server_token = '';			// 默认授权码为空
		
	console.log('Server config:');
	console.log('template_dir=' + template_dir);
	console.log('server_token=' + server_token);
	console.log('queue_cycle=' + queue_cycle);
	console.log('server_port=' + server_port);
	console.log('time_zone=' + time_zone);
	
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
