/** 示例：读取任务信息 */
debug('Hello, world!');

var info = task.info();
for (i in info)
    debug(i + '=' + info[i]);

// 任务结束
task.end();
