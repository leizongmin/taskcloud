/**
 * taskcloud虚拟机 taskqueue快照
 *
 * @author leizongmin<leizongmin@gmail.com>
 * @version 0.1
 */
 
var snapshot = module.exports;

snapshot.logger = function () { console.log.apply(null, arguments); }
var debug = function () {
	if (snapshot.logger)
		snapshot.logger.apply(null, arguments);
}

var taskvm = require('./taskvm');
var taskqueue = require('./taskqueue');

var fs = require('fs');


/**
 * 保存快照
 *
 * @param {string} filename 保存的文件名
 * @param {function} callback 回调函数
 */
snapshot.save = function (filename) {
	var save = {}
	for (var i in taskvm.users) {
		var u = taskvm.users[i];
		save[i] = u.queue;
	}
	var json = JSON.stringify(save);
	fs.writeFile(filename, json, function (err) {
		if (err)
			debug('Snapshot save error: ' + err);
		callback(err ? false : true);
	});
}

/**
 * 载入快照
 *
 * @param {string} filename 快照文件名
 * @param {function} callback 回调函数
 */
snapshot.load = function (filename, callback) {
	try {
		fs.readFile(filename, function (err, data) {
			if (err) {
				debug('Snapshot load error: ' + err);
				callback(false);
				return;
			}
			try {
				var users = JSON.parse(data.toString());
				for (var i in users) {
					// 创建UserQueue实例
					var u = new taskqueue.UserQueue(i);
					u.queue = users[i];
					// 添加到taskvm
					taskvm.users[i] = u;
				}
			}
			catch (err) {
				debug('Parsing snapshot data file error:' + err);
				callback(false);
			}
		});
	}
	catch (err) {
		debug('Snapshot load error: ' + err);
		callback(false);
	}
}
