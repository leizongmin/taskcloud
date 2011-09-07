var taskqueue = require('../lib/taskqueue');

var time = new Date().getTime();

var queue = new taskqueue.UserQueue('lei');
queue.add(1, taskqueue.AUTO_RUN, 'Test', 'ghsdkhfshfsd', 60, time + 2000, time + 10000);
queue.add(2, taskqueue.NOT_AUTO_RUN, 'Test', 'ghsdkhfshfsd', 60, time, time + 10000);
queue.add(3, taskqueue.AUTO_RUN, 'Test', 'ghsdkhfshfsd', 60, 0, time + 12000);
queue.add(4, taskqueue.AUTO_RUN, 'Test', 'ghsdkhfshfsd', 60, 0, time + 3000);
/*
setInterval(function () {
	console.log(queue.scan());
	//console.log(queue.queue);
	console.log('==========================================================');
}, 1000);
*/

console.log(queue.get(2));
console.log(queue.queue);
queue.running(1);
queue.running(2);
queue.running(2, false);
console.log(queue.queue);