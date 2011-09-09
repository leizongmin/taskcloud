/** 任务控制示例：修改运行周期 */

var info = task.info();
debug('我之前的运行周期是：' + info.cycle);

if (!args.cycle)
    args.cycle = 6000;

// 修改运行周期
task.setCycle(args.cycle);
debug('现在的运行周期是：' + args.cycle);

// 任务结束
task.end();
