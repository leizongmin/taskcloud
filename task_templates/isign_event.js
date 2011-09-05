/**
 * isign 检查指定活动的签到情况
 *
 * 任务需要以下参数：
 * 		event_id			活动ID
 * 		access_token		微博授权信息
 * 		access_token_secret
 * 		lat					活动中心纬度
 * 		lng					活动中心经度
 * 		radius				活动半径
 * 		topic				活动话题
 * 任务运行时会产生以下变量：
 * 		min_id				上次获得结果的最大微博消息ID号
 */
 
debug('检查签到情况...');

// 获取参数
var args = task.get('arguments');
var access_token = args.access_token;
var access_token_secret = args.access_token_secret;
var lat = args.lat;
var lng = args.lng;
var radius = args.radius;
var topic = args.topic;

var url = 'http://isign.sinaapp.com/service/geotopic.php';

rest.get(url, {
	ot: access_token, ots: access_token_secret,
	lat: lat, lng: lng, r: radius, n: topic
	}, function (err, data) {
	
		if (err) {
			debug('出错：' + err);
			task.end();
			return;
		}
		
	try {
		var data = JSON.parse(data.toString().match(/\{.*\}/)[0]);
		if (data.error) {
			debug('出错：' + data.error);
			task.end();
			return;
		}
		
		for (i in data.data) {
			var line = data.data[i];
			debug('@' + line.name + ': ' + line.text);
		}
		debug(data);
		task.end();
	}
	catch (err) {
		debug('出错：' + err);
		task.end();
	}
});