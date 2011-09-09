/** REST操作示例：天气预报 */

// 需要参数：city:所在的城市

if (!args.city)
    args.city = '广州';
    
rest.get('http://service.ucdok.com/weather/get.php', {city: args.city}, function (err, data) {
    if (err) {
        debug('出错了：' + err);
    }
    else {
        var w = JSON.parse(data);
        debug(args.city + '天气预报：' + w.current.condition);
    }
    
    // 运行结束，别忘了告诉任务调度系统呐
    task.end();
});
