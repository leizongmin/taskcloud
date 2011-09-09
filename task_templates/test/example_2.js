/** require()示例 */

// 需要参数：host:需要解析的域名

// 默认解析启动参数中的host，如果没有，则设置为cnodejs.net
if (!args.host)
    args.host = 'cnodejs.net';
    
// 载入Nodejs内置的dns模块
var dns = require('dns');

if (dns) {
    dns.resolve(args.host, function (err, address){
        if (err)
            debug('解析' + args.host + '时出错！' + err);
        else {
            debug(args.host + '对应的IP地址为：' + address);
        }
        task.end();
    });
}
else {
    task.end();   
}