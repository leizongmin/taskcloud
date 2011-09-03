/**
 * taskcloud虚拟机 REST
 *
 * @author leizongmin<leizongmin@gmail.com>
 * @version 0.1
 */
 
var rest = module.exports;

var net = require('net'),
	url = require('url'),
	querystring = require('querystring');
	
rest.logger = function () { console.log.apply(null, arguments); }
var debug = function () {
	if (rest.logger)
		rest.logger.apply(null, arguments);
}

/** 超时时间 */
rest.timeout = 60000;

/**
 * 连接指定主机，发送并接收数据
 *
 * @param {string} host 主机
 * @param {number} port 端口
 * @param {string} reqdata 请求头
 * @param {function} callback 回调函数 function (err, data)
 */
send = function (host, port, reqdata, callback) {
	var client = new net.Socket();
	var data = new Buffer('');
	client.on('connect', function () {
		client.end(reqdata);
	});
	client.on('data', function (chunk) {
		data += chunk;
	});
	client.on('end', function () {
		client.destroy();
		callback(undefined, data);
	});
	client.on('timeout', function () {
		client.destroy();
		callback('timeout');
	});
	client.on('error', function (err) {
		client.destroy();
		callback(err);
	});
	client.on('close', function (had_error) {
		client.destroy();
		if (had_error)
			callback('close');
	});
	client.setTimeout(rest.timeout);
	client.connect(port, host);
	// debug(reqdata);
}
/***************************************************************************************/

/**
 * http请求
 *
 * @param {string} requrl 请求URL
 * @param {object} params 参数
 * @param {function} callback 回调函数 function (err, data, headers)
 * @param {string} method 请求方法
 * @param {object} headers 请求头
 * @param {string} postdata 请求内容
 */
request = function (requrl, params, callback, method, headers, postdata) {
	if (!params)
		params = {};
	var option = url.parse(requrl);
	if (!option.port)
		option.port = 80;		// 默认80端口
	option.path = option.pathname + (option.search ? option.search : '');
	if (!method)
		var method = 'GET';		// 默认GET方法
	if (!headers)
		var headers = {};
	var defaultHeaders = {		// 默认HTTP头
		'Host':			option.hostname,
		'User-Agent':	'taskcloud-rest (v0.1)'
		}
	for (i in defaultHeaders) {
		if (!(i in headers))
			headers[i] = defaultHeaders[i];
	}
	
	var sendData;
	switch (method.toUpperCase()) {
		case 'POST':
			sendData = makePostHeader(option.path, params, headers);
			break;
		default:
			sendData = makeDefaultHeader(method.toUpperCase(), option.path, params, headers);
	}
	
	// debug(sendData);
	send(option.hostname, option.port, sendData, function (err, data) {
		if (err) {
			callback(err);
			return;
		}
		
		var data = data.toString();
		var pos = data.indexOf('\r\n\r\n');
		var body = data.substr(pos + 4);
		var header = data.substr(0, pos).split('\r\n');
		
		// 解析HTTP头
		// debug(header);
		var headers = {};
		var i;
		for (i = 1; i < header.length; i++) {
			var headerLine = header[i];
			pos = headerLine.indexOf(':');
			headers[headerLine.substr(0, pos).trim()] = headerLine.substr(pos + 1).trim();
		}
		// debug(headers);
		var status = header[0].split(' ');
		var statusCode = parseInt(status[1]);
		if (statusCode < 200 || statusCode > 299) {
			callback(statusCode, body, headers);
			return;
		}
		// debug(status);
		
		callback(err, body, headers);
	});
}
 
/**
 * 生成POST请求数据
 *
 * @param {object} params 参数
 * @return {object} 格式： {data:数据, boundary:分界线, length:数据长度}
 */
makePostData = function (params) {
	var data = querystring.stringify(params);
	return {
		data:		data,
		length:		new Buffer(data).length
	}
}

/**
 * 生成附加Header请求头
 *
 * @param {object} headers
 * @return {string}
 */
makeHeader = function (headers) {
	var ret = '';
	for (i in headers)
		ret += i + ':' + headers[i] + '\r\n';
	return ret;
}

/**
 * 生成GET请求头
 *
 * @param {string} method
 * @param {string} path
 * @param {object} params
 * @param {object} headers
 * @return {string}
 */
makeDefaultHeader = function (method, path, params, headers) {
	if (params) {
		var option = url.parse(path, true);
		for (i in params) {
			option.query[i] = params[i];
		}
		path = option.pathname + '?' + querystring.stringify(option.query);
	}
	
	return method + ' ' + path + ' HTTP/1.1\r\n' + makeHeader(headers) + '\r\n';
}

/**
 * 生成POST请求头
 *
 * @param {string} path
 * @param {object} params
 * @param {object} headers
 * @return {string}
 */
makePostHeader = function (path, params, headers) {
	var postData = makePostData(params);
	headers['Content-Length'] = postData.length;
	headers['Content-Type'] = 'application/x-www-form-urlencoded';
	
	return 'POST ' + path + ' HTTP/1.1\r\n' + makeHeader(headers) + '\r\n' + postData.data;
}

/***************************************************************************************/
/*
 * 回调函数格式：function (err, data, headers) 其中err为undefined时表示成功，如果为数值，表示HTTP请求的状态代码，为文本表示错误描述
 * 							data是请求返回的数据，headers是Response头
 * 参数形式：	method('url', callback)
 *				method('url', params, callback)
 * 				method('url', callback, headers)
 * 				method('url', params, callback, headers)
 * 				method('url', params, callback, headers, data)
 */

var agent_request = function () {
	var method, requrl, params = {}, callback, headers = {}, data;
	method = arguments[0];
	requrl = arguments[1];
	if (arguments.length == 3) {
		callback = arguments[2];
	}
	else if (arguments.length == 4) {
		if (typeof arguments[2] == 'function') {
			callback = arguments[2];
			headers = arguments[3];
		}
		else {
			params = arguments[2];
			callback = arguments[3];
		}
	}
	else {
		params = arguments[2];
		callback = arguments[3];
		headers = arguments[4];
		data = arguments[5];
	}
	request(requrl, params, callback, method, headers, data);
}
 
/**
 * GET
 */
rest.get = function () {
	var args = ['GET'];
	var i  = 0;
	while (i < arguments.length) {
		args.push(arguments[i]);
		i++;
	}
	agent_request.apply(this, args);
}

/**
 * POST
 */
rest.post = function () {
	var args = ['POST'];
	var i  = 0;
	while (i < arguments.length) {
		args.push(arguments[i]);
		i++;
	}
	agent_request.apply(this, args);
}

/**
 * DELETE
 */
rest.delete = function () {
	var args = ['DELETE'];
	var i  = 0;
	while (i < arguments.length) {
		args.push(arguments[i]);
		i++;
	}
	agent_request.apply(this, args);
}

/**
 * PUT
 */
rest.put = function () {
	var args = ['PUT'];
	var i  = 0;
	while (i < arguments.length) {
		args.push(arguments[i]);
		i++;
	}
	agent_request.apply(this, args);
}