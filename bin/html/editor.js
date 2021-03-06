query = {}
render = {}
ui = {}

$(document).ready(function () {
	/* 创建编辑器 */
	window.editor = ace.edit("editor");
	editor.setTheme("ace/theme/textmate");
	var JavaScriptMode = require("ace/mode/javascript").Mode;
	editor.getSession().setMode(new JavaScriptMode());
	editor.setFontSize('14px');
	
	// 获取模板列表
	query.templatelist();
	
	// 自动打开模板
	var t = window.location.hash.substr(1);
	if (t != '') {
		query.getTemplate(t)
	}
});

/** 取模板列表 */
query.templatelist = function () {
	$.getJSON('/template/' + USERNAME, function (d) {
		if (d.status < 1)
			alert('无法获取模板列表！');
		else {
			var html = render.templatelist(d.data);
			$('.template').html(html);
			/* 模板列表效果 */
			$('.template-item').hover(function () {
				$(this).addClass('template-item-hover');
			}, function () {
				$(this).removeClass('template-item-hover');
			});
		}
	});
}

/** 渲染模板列表 */
render.templatelist = function (d) {
	var html = '';
	for (i in d)
		html +=	'<div class="template-item" onclick="query.getTemplate(\'' + d[i] + '\')">' + d[i] + '</div>';
	return html;
}

/** 读取模板文件 */
query.getTemplate = function (t) {
	$.getJSON('/template/' + USERNAME + '/' + t, function (d) {
		if (d.status < 1)
			alert('无法获取模板' + t);
		else {
			editor.getSession().setValue(d.data);
			query.edit_template_name = t;
			$('#template_name').html(t);
		}
	});
}

/** 保存 */
query.saveTemplate = function () {
	var t = query.edit_template_name;
	var code = editor.getSession().getValue();
	$.post('/template/' + USERNAME + '/' + t, {code: code}, function (d) {
		if (d.status < 1)
			alert('保存模板' + t + '失败！');
		else {
			alert('保存成功！');
		}
		query.templatelist();
	});
}

/** 新建模板 */
ui.newTemplate = function () {
	var t = prompt('请输入新建的模板名称：');
	if (t == null || t == '') {
		alert('已取消。');
		return;
	}
	query.edit_template_name = t;
	$('#template_name').html(t);
	
	var hello = '/** 模板 ' + t + ' */\r\ndebug(\'Hello, world!\');\r\n\r\n// 任务结束\r\ntask.end();\r\n';
	editor.getSession().setValue(hello);
}