var usermanager = require('../bin/user/usermanager');

var a = usermanager.login('test', 'test');
console.log(a);

console.log(usermanager.getUserName(a));

console.log(usermanager);