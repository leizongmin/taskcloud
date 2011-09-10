/**
 * taskcloud虚拟机 启动
 *
 * @author leizongmin<leizongmin@gmail.com>
 * @version 0.1
 */
 
var server = require('./bin/server');

// 系统配置
var TEMPLATE_PATH = './task_templates';		// 模板目录
var SERVER_TOKEN = '';						// 授权码，用于客户端与服务器通讯（暂时不可用）
var QUEUE_CYCLE = 1000;						// 任务队列扫描周期
var SERVER_PORT = 80;						// 服务器端口
var TIME_ZONE = 8;							// 时区，主要用于日志输出中的时间格式

// 启动服务器
server.run(TEMPLATE_PATH, SERVER_TOKEN, QUEUE_CYCLE, SERVER_PORT, TIME_ZONE);
