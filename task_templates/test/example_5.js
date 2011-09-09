/** 任务控制示例：自动开始和自动结束 */

// 当前时间
var now = new Date().getTime();

// 设置1分钟后再开始
task.setStart(now + 60000);
debug('我下次开始时间是：' + new Date(now + 60000))

// 设置运行1分钟后结束
task.setEnd(now + 120000);
debug('我将在以下时间后结束：' + new Date(now + 120000))

// 任务结束
task.end();
