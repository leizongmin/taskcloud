var req = require('../lib/require');

for (var i = 0; i < 10; i++)
console.log(req('/cygdrive/f/github/taskcloud/test/module.js', {}));