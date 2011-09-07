var logcache = require('../lib/logcache');

for (i = 0; i < 100; i++)
	logcache.log('', '下载是' + i);
	
console.log(logcache.get());
console.log(logcache.get('lei'));
console.log(logcache);