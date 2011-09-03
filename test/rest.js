var rest = require('../lib/rest');

console.log(rest);

rest.get('http://www.baidu.com/', function (err, data, headers) {
	console.log(err);
	console.log(data);
	console.log(headers);
}, {lei:'cool'});