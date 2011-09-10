/**
 * 测试模块：通知
 * 
 * 此模块包含了各种通知方式，如发邮件、发微博等，其他任务模板可以通过调用此模块作为输出运行结果之用
 */
 
var notification = module.exports;

debug('require notification');

/**
 * 发邮件
 * 
 * @param {string} to 接收邮件者
 * @param {string} title 邮件标题
 * @param {string} text 邮件内容
 * @param {function} callback 回调函数
 */
notification.sendmail = function (to, title, text, callback) {
    if (!callback)
        callback = function (err) {
            if (err)
                debug('sendmail error: ' + err);
        }
    rest.get('http://taskcloud.sinaapp.com/open/email/send.php', {to:to, title:title, text:text}, function (err, data){
        if (err)
            callback(err);
        else {
           // var ret = JSON.parse(data);
           // callback(ret.error);
        }
    });
}