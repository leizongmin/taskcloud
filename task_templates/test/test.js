debug('Hello, word000000!');
for (i in args)
	debug(i + '=' + args[i]);

//task.end();

rest.get('http://www.baidu.com', function (err, data) {
    if (err)
        debug('打开页面出错！' + err);
    else
        debug('共接收到' + data.length + '字节数据');
    task.end();
})