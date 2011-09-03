var taskvm = require('../lib/taskvm');

taskvm.init('.', 100);

var code = 'id=12\n template=hello\n auto=true\n cycle=1000\n start=2011/9/3 12:58 +800\n end=2011/9/3 13:11+800\n\n count=0';

console.log(taskvm.exec(code));
taskvm.start();

//console.log(module.dirname);