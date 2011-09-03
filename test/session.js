var session = require('../lib/session');

console.log(session);

var $ = session.create(12, 'fdfdfsgr');
console.log($);
console.log($.task.info());