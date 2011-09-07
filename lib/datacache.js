/**
 * taskcloud虚拟机 数据缓存
 *
 * @author leizongmin<leizongmin@gmail.com>
 * @version 0.1
 */
 
/*
 * 依赖此模块：taskvm, session
 */ 
 
var data = module.exports;

data.logger = function () { console.log.apply(null, arguments); }
var debug = function () {
	if (data.logger)
		data.logger.apply(null, arguments);
}

/* 数据缓存 */
data.cache = {};


/**
 * 取
 *
 * @param {string} key 键
 * @return {object}
 */
data.get = function (key) {
	debug('Get data [' + key + ']');
	return data.cache[key];
}

/**
 * 写
 *
 * @param {string} key 键
 * @param {object} value 值
 */
data.set = function (key, value) {
	debug('Set data [' + key + ']');
	data.cache[key] = value;
}
