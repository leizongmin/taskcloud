var queue = require('../lib/taskqueue');

var time = new Date().getTime();

queue.add(1, queue.AUTO_RUN, 'Test', 'ghsdkhfshfsd', 60, time + 2000, time + 10000);
queue.add(2, queue.NOT_AUTO_RUN, 'Test', 'ghsdkhfshfsd', 60, time, time + 10000);
queue.add(3, queue.AUTO_RUN, 'Test', 'ghsdkhfshfsd', 60, 0, time + 12000);
queue.add(4, queue.AUTO_RUN, 'Test', 'ghsdkhfshfsd', 60, 0, time + 3000);
/*
setInterval(function () {
	console.log(queue.scan());
	//console.log(queue.queue);
	console.log('==========================================================');
}, 1000);
*/

console.log(queue.get(2));
queue.running(1);
queue.running(2);
queue.running(2, false);
console.log(queue.queue);