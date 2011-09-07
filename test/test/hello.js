//debug('hello, I am template!');

//debug(global);
/*
rest.get('http://www.baidu.com/', function (err, data, headers) {
	debug('Finish.');
	task.end();
});
*/
/*
var x = task.get('count');
x++; 
task.set('count', x);
if (x > 3) {
	task.sleep();
}
debug('x=' + x);

setTimeout(function () {
	debug('Finish.');
	task.end();
}, 3000);
*/
/*
var x = task.get('x');
if (!x) {
	task.setEnd(new Date().getTime() + 5000);
	task.set('x', true);
}
debug(x);
*/
task.end();