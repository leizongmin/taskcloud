var cmd = require('../lib/cmdparser');

var code = 'id=12\n template=test\r\n access_token="fhdskjfhsdjkhfjksd"\n auto_start=2011/12/31 12:30 +800\r\n\n data=jglfjllgfd\r\n time=12:30 \r\n\r\n ffsfsdf=12\n fsf';
console.log(cmd.parser(code));