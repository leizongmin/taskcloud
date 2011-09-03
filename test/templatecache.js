
var template = require('../lib/templatecache');

template.init(module.dirname);

var x = template.get('hello');
console.log(x.runInThisContext());

var x = template.get('hello');
var x = template.get('hello0');

console.log(template);