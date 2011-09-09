/** REST操作示例：天气预报，发邮件通知 */

// 需要参数：city:所在城市，email:邮箱地址

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
            sendmail(args.email, msg, msg);
    }
    
    // 运行结束，别忘了告诉任务调度系统呐
    task.end();
});

/** 发送邮件通知我 */
var sendmail = function (to, title, text) {
    rest.get('http://taskcloud.sinaapp.com/open/email/send.php', {to:to, title:title, text:text}, function (err, data){
        if (err) {
            debug('真悲剧：' + err);
        }
        else {
            var ret = JSON.parse(data);
            debug('发送邮件' + (ret.error ? '失败了：' + ret.error : '成功了'));
        }
    });
}