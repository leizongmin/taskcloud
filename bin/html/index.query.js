if (typeof query == 'undefined')
	query = {}
	
/** 获取任务列表 */
query.getAllProcess = function () {
	$.getJSON('/task/' + USERNAME, function (d) {
		if (d.status > 0) {
			var html = render.processArray(d.data.auto) + render.processArray(d.data.wait) + render.processArray(d.data.sleep);
		}
		else if (d.status == -1) {
			alert('请先登录！');
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
	$.post('/task/' + USERNAME + '/exec', {code: code}, function (d) {
		if (d.status > 0) {
			query.getAllProcess();
			alert('成功！');
		}
		else if (d.status == -1) {
			alert('请先登录！');
		}
		else {
			$('.command').fadeIn();
			alert('运行任务失败：' + d.data.info);
		}
	}, 'json');
}

/** 结束任务 */
query.kill = function (id) {
	$.get('/task/' + USERNAME + '/kill', {id: id}, function (d) {
		if (d.status == -1)
			alert('请先登录！');
		else if (d.status < 1)
			alert('无法结束任务' + id);
		else
			query.getAllProcess();
	});
}

/** 运行一次任务 */
query.once = function (id) {
	$.get('/task/' + USERNAME + '/once', {id: id}, function (d) {
		if (d.status == -1)
			alert('请先登录！');
		else if (d.status < 1)
			alert('无法运行任务' + id);
		else
			query.getAllProcess();
	});
}

/** 查看日志 */
query.logs = function (id) {
	$.get('/log/' + USERNAME + '/' + id, function (d) { console.log(d);
		if (d.status == -1)
			alert('请先登录！');
		else if (d.status < 1)
			alert('无法获取任务' + id + '的运行日志!');
		else {
			var html = render.logs(d.data.reverse());
			$('.logs-box').html(html);
		}
	});
}