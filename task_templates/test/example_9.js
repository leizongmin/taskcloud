/** REST操作示例：天气预报，通过载入模块发邮件通知 */

// 需要参数：city:所在城市，email:邮箱地址

var sendmail = require('module_notification').sendmail;
var sendweibo = require('module_notification').sendweibo;

if (!args.city)
    args.city = '广州';
    
rest.get('http://service.ucdok.com/weather/get.php', {city: args.city}, function (err, data) {
    if (err) {
        debug('出错了：' + err);
    }
    else {
        var w = JSON.parse(data);
        var msg = args.city + '天气预报：' + w.current.condition;
        debug(msg);
        if (args.email) {}
            //sendmail(args.email, msg, msg);
            sendweibo(msg);
    }
    
    // 运行结束，别忘了告诉任务调度系统呐
    task.end();
});
