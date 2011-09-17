/**
 * taskcloud web 公共代码
 *
 * @author leizongmin<leizongmin@gmail.com>
 * @version 0.1
 */

var config = require('./config.inc');

var g = module.exports = {}

/********************************************* taskvm ***************************************************/
g.taskvm = require('../../lib/taskvm');
g.logcache = require('../../lib/logcache');


/********************************************** 登录验证 ************************************************/
g.auth = require('./lib/auth');


/************************************************** 模板管理 **************************************/
g.usertpl = require('./lib/usertpl');