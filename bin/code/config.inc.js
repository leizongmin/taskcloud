/**
 * taskcloud Web 连接mongodb数据库
 *
 * @author leizongmin<leizongmin@gmail.com>
 * @version 0.1
 */
 
var mongo = require("mongoskin");
var db_url = exports.db_url = "127.0.0.1:27017/taskcloud";
exports.db = mongo.db(db_url);
