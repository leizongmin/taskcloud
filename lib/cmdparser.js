/**
 * taskcloud虚拟机 命令解释
 *
 * @author leizongmin<leizongmin@gmail.com>
 * @version 0.1
 */
 
/*
 * 依赖此模块：taskvm
 */
 
var cmdparser = module.exports;

cmdparser.logger = function () { console.log.apply(null, arguments); }
var debug = function () {
	if (cmdparser.logger)
		cmdparser.logger.apply(null, arguments);
}


/**
 * 解释命令
 *
 * @param {string} code 代码
 * @return {object} 返回{task:{任务参数}, data:{预先设定的任务数据}} 返回false表示解析失败
 */
cmdparser.parser = function (code) {
	var block = code.split(/\r?\n\r?\n/);
	if (block.length < 1)
		return false;
	
	// 解析任务参数
	var task = {}
	var line = block[0].split(/\r?\n/);
	for (i in line) {
		var d = parseLine(line[i]);
		if (d)
			task[d.k] = d.v;
	}
	
	// 解析任务数据
	var data = {}
	for (var di = 1; di < block.length; di++) {
		var line = block[di].split(/\r?\n/);
		for (i in line) {
			var d = parseLine(line[i]);
			if (d)
				data[d.k] = d.v;
		}
	}
	
	return {task: task, data: data}
}

/**
 * 解析一行数据
 *
 * @param {string} line 行
 * @param {object} 返回{k:键名, v:值} 返回false表示解析失败
 */
var parseLine = function (line) {
	var pos = line.indexOf('=');
	if (pos < 0)
		return false;
		
	var ret = {};
	ret.k = line.substr(0, pos).trim();
	ret.v = line.substr(pos + 1);
	
	// 如果是引号括起来的字符串
	if (ret.v.match(/['"].*['"]/)) {
		ret.v = ret.v.trim();
		ret.v = ret.v.substr(1, ret.v.length - 2);
		return ret;
	}
	
	// 尝试判断值类型
	try {
		ret.v = ret.v.trim();
		
		// 如果是布尔类型
		var b = ret.v.toLowerCase();
		if (b == 'true') {
			ret.v = true;
			return ret;
		}
		if (b == 'false') {
			ret.v = false;
			return ret;
		}
		
		// 如果是数值类型
		if (!isNaN(ret.v)) {
			ret.v = parseFloat(ret.v);
			return ret;
		}
		// 如果是日期类型
		var d = new Date(ret.v).getTime();
		if (!isNaN(d))
			ret.v = d;
		return ret;
	}
	catch (err) {
		return ret;
	}
}