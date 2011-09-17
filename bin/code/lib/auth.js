/**
 * taskcloud Web 用户账户登录验证
 *
 * @author leizongmin<leizongmin@gmail.com>
 * @version 0.1
 */


var md5 = require('md5');

/** 连接到数据库 */
var db = require('../config.inc').db;
var db_user = db.collection('user');
var db_auth = db.collection('auth_token');

var debug = function (err) {
	console.log('[auth] ' + err);
}

var auth = module.exports = {}


/**
 * 获取指定用户的Access_token，如果没有则自动生成一个
 *
 * @param {string} username 用户名
 * @param {function} callback 回调函数
 */
auth.getAccessToken = function (username, callback) {
	db_auth.findOne({username: username}, function (err, data) {
		if (err) {
			debug(err);
			callback();
		}
		else if (!data) {
			var timestamp = new Date().getTime();
			var access_token = md5(username + timestamp + Math.random());
			db_auth.save({username: username, access_token: access_token, timestamp: timestamp});
			callback(access_token);
		}
		else {
			callback(data.access_token);
		}
	});
}

/**
 * 登录验证，并返回其access_token
 *
 * @param {string} username 用户名
 * @param {string} password 密码
 * @param {function} callback 回调函数
 */
auth.verify = function (username, password, callback) {
	password = md5(password);
	db_user.findOne({username: username, password: password}, function (err, data) {
		if (err) {
			debug(err);
			callback();
		}
		else if (!data){
			callback();
		}
		else {
			auth.getAccessToken(username, callback);
		}
	});
}

/**
 * 获取指定Access_token所对应的用户名
 *
 * @param {string} access_token 授权码
 * @param {function} callback 回调函数
 */
auth.getUserName = function (access_token, callback) {
	db_auth.findOne({access_token: access_token}, function (err, data) {
		if (err) {
			debug(err);
			callback();
		}
		else if (!data) {
			callback();
		}
		else {
			callback(data.username);
		}
	});
}