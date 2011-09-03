var datacache = require('../lib/datacache');

datacache.set('a', {a:12345, b:'fdshfdjk'});
datacache.set('b', 123);
console.log(datacache.get('a'));
console.log(datacache.cache);