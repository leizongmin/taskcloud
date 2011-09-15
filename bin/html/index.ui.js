$(document).ready(function () {

	// 导航栏效果
	$('.toolbar-item').hover(function () {
		$(this).addClass('toolbar-item-hover');
	}, function () {
		$(this).removeClass('toolbar-item-hover');
	});
	
	// 自动刷新任务列表
	setInterval(function () {
		query.getAllProcess();
	}, 10000);
	query.getAllProcess();
});

if (typeof render == 'undefined')
	render = {}
if (typeof ui == 'undefined')
	ui = {}

/** 渲染一行任务 */
render.processItem = function (d) {
	if (!d)
		return '';
	var html = '<tr class="process-item"><td class="task-id">' + d.task_id + '</td>\
					<td class="task-template">' + d.template + '</td>\
					<td class="task-cycle">' + (d.cycle ? d.cycle : '-') + '</td>\
					<td class="task-status">' + (d.status > 0 ? '运行中' : '就绪') + '</td>\
					<td class="task-start">' + time2str(d.auto_start) + '</td>\
					<td class="task-end">' + time2str(d.auto_end) + '</td>\
					<td class="task-timestamp">' + time2str(d.timestamp) + '</td>\
					<td><a href="#" onclick="query.kill(' + d.task_id + ')" title="结束任务">[X]</a> \
					<a href="#" onclick="query.once(' + d.task_id + ')" title="运行一次任务">[R]</a> \
					<a href="/home/templates#' + d.template + '" target="_blank" title="编辑任务模板">[E]</a> \
					<a href="#" onclick="ui.watchlogs(' + d.task_id + ')" title="运行日志">[L]</a></td></tr>'
	return html;
}

/** 渲染一组任务 */
render.processArray = function (d) {
	var html = '';
	for (i in d) {
		html += render.processItem(d[i]);
	}
	return html;
}

/** 将毫秒时间转换为文本 */
var time2str = function (time) {
	if (!time)
		return '-';
	try {
		var date = new Date(time);
		date.setTime(date.getTime() + 3600000 * 8);		// 设置为+8时区
		var str_time = date.getUTCFullYear() + '/' + (date.getUTCMonth() + 1) + '/' + date.getUTCDate() + ' ' + 
						date.getUTCHours() + ':' + date.getUTCMinutes() + ':' + date.getUTCSeconds();
		return str_time;
	}
	catch (err) {
		return '-';
	}
}

/** 渲染日志 */
render.logs = function (d) {
	var html = '';
	for (i in d)
		html += '<div class="logs-item">' + d[i] + '</div>';
	return html;
}

/** 显示新建任务框 */
ui.addTask = function () {
	var $box = $('.command');
	var $win = $(window);
	$box.css({
		top: 	($win.height() - $box.height()) * 0.6 / 2,
		left:	($win.width() - $box.width()) / 2
	}).fadeIn();
}

/** 查看日志 */
ui.watchlogs = function (id) {
	var $box = $('.logs');
	var $win = $(window);
	$box.css({
		height:	$win.height() * 0.6
	}).css({
		top: 	($win.height() - $box.height()) * 0.6 / 2,
		left:	($win.width() - $box.width()) / 2
	}).fadeIn();
	
	$('.logs-box').height($box.height() - 40);
	
	ui.watch_logs_id = id;
	ui.watch_logs_intid = setInterval(function () {
		query.logs(id);
	}, 10000);
	query.logs(id);
}

/** 取消查看日志 */
ui.unwatchlogs = function () {
	clearInterval(ui.watch_logs_intid);
	$('.logs').fadeOut();
}