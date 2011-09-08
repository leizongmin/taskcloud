if (typeof query == 'undefined')
	query = {}
	
/** 获取任务列表 */
query.getAllProcess = function () {
	$.getJSON('/' + USERNAME + '/tasklist', function (d) {
		if (d.status > 0) {
			var html = render.processArray(d.data.auto) + render.processArray(d.data.wait) + render.processArray(d.data.sleep);
		}
		else {
			var html = '<tr class="process-item"><td colspan="8">没有任务进程</td></tr>';
		}
		$('.process-item').remove();
		$('.process-header').after(html);
	});
}

/** 运行命令 */
query.exec = function () {
	$('.command').fadeOut();
	var code = $('#cmdcode').val();
	$.post('/' + USERNAME + '/exec', {code: code}, function (d) {
		if (d.status > 0)
			query.getAllProcess();
		else
			$('.command').fadeIn();
		alert(d.status > 0 ? '成功！' : '失败！');
	}, 'json');
}

/** 结束任务 */
query.kill = function (id) {
	$.get('/' + USERNAME + '/kill', {id: id}, function (d) {
		if (d.status < 1)
			alert('无法结束任务' + id);
		else
			query.getAllProcess();
	});
}

/** 运行一次任务 */
query.once = function (id) {
	$.get('/' + USERNAME + '/once', {id: id}, function (d) {
		if (d.status < 1)
			alert('无法运行任务' + id);
		else
			query.getAllProcess();
	});
}

/** 查看日志 */
query.logs = function (id) {
	$.get('/' + USERNAME + '/log/' + id, function (d) {
		if (d.status < 1)
			alert('无法获取任务' + id + '的运行日志!');
		else {
			var html = render.logs(d.data);
			$('.logs-box').html(html);
		}
	});
}