
var msg = task.get('msg');
if (!msg)
	msg = 'Hello, world!';
debug(msg);
//debug('Hello, world!');
task.end();
