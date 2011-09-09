/** 模板 test2 */
debug('Hello, world!');

var m = require('test_module');

var x = m.say();

for (i in x)
    debug(i + '=' + x[i]);

//debug(m.say());

// 任务结束
task.end();
