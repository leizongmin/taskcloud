query = {}
render = {}

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
	$.getJSON('/' + USERNAME + '/templatelist', function (d) {
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
	$.getJSON('/' + USERNAME + '/template/' + t, function (d) {
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
	$.post('/' + USERNAME + '/template/' + t, {code: code}, function (d) {
		if (d.status < 1)
			alert('保存模板' + t + '失败！');
		else {
			alert('保存成功！');
		}
	});
}