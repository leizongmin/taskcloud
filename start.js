/**
 * taskcloud虚拟机 启动
 *
 * @author leizongmin<leizongmin@gmail.com>
 * @version 0.1
 */
 
var server = require('./bin/server');

// 系统配置
var SERVER_PORT = 80;							// 服务器端口
var TEMPLATE_PATH = './task_templates';		// 模板目录
var QUEUE_CYCLE = 1000;						// 任务队列扫描周期
var SNAPSHOT_CYCLE = 1000;					// 快照保存周期
var SNAPSHOT_PATH = './snapshot.json';		// 快照文件名
var TIME_ZONE = 8;							// 时区，主要用于日志输出中的时间格式

// 启动服务器
server.run(SERVER_PORT, TEMPLATE_PATH, QUEUE_CYCLE, SNAPSHOT_CYCLE, SNAPSHOT_PATH, TIME_ZONE);
