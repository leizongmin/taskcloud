/**
 * taskcloud Web 用户账户登录验证
 *
 * @author leizongmin<leizongmin@gmail.com>
 * @version 0.1
 */
 
/*
 * 依赖此模块：server
 */

var usermanager = module.exports = {}

var md5 = require('md5');
var path = require('path');
var fs = require('fs');

usermanager.logger = function () { console.log.apply(null, arguments); }
var debug = function () {
	if (usermanager.logger)
		usermanager.logger.apply(null, arguments);
}

/** 用户列表 */
usermanager.users = {} 

/** 用户登录access_token表 */
usermanager.access_tokens = {}

/**
 * 登录验证，如果登录成功，返回access_token
 *
 * @param {string} username
 * @param {string} password
 * @return {string}
 */
usermanager.login = function (username, password) {
	var u = usermanager.users[username];
	if (u && u.password == md5(password)) {
		var access_token = createAccessToken(username);
		return access_token;
	}
	else
		return false;
}

/**
 * 根据access_token获取用户名
 *
 * @param {string} access_token
 */
usermanager.getUserName = function (access_token) {
	var u = usermanager.access_tokens[access_token];
	if (u)
		return u.username;
	else
		return false;
}


/**
 * 读取用户账户密码数据
 */
var readUserData = function () {
	var filename = path.resolve(__dirname, 'users.data');
	debug('Reading user data file: ' + filename);
	try {
		var data = fs.readFileSync(filename);
		var lines = data.toString().split(/\r?\n/g);
		for (i in lines) {
			var line = parseLine(lines[i]);
			if (line)
				usermanager.users[line.username] = line;
		}
		fs.unwatchFile(filename);
		fs.watchFile(filename, function () {
			debug('Remove user data file.');
			readUserData();
		});
	}
	catch (err) {
		debug('Reading user data file error: ' + err);
	}
}

/**
 * 解析数据文件中的一行
 *
 * @param {string} line
 * @return {object}
 */
var parseLine = function (line) {
	var d = line.toString().split(':');
	if (d.length < 2)
		return false;
	else
		return {
			username:	d[0].trim(),
			password:	d[1].trim()
		}
}

/**
 * 生成access_token
 *
 * @param {string} username 用户名
 * @return {string}
 */
var createAccessToken = function (username) {
	var time = new Date().getTime();
	var access_token = md5(time + username + Math.random());
	usermanager.access_tokens[access_token] = {
		username:	username,		// 用户名
		timestamp:	time			// 时间戳
	}
	debug('Allows a access_token [' + access_token + '] for [' + username + ']');
	return access_token;
}


readUserData();