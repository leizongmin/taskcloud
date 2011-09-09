/** 读取启动参数示例 */

var msg = [];

for (i in args) {
    msg.push(i + '=' + args[i]);
}

debug('共有' + msg.length + '个参数，分别为：' + msg)

// 任务结束
task.end();
