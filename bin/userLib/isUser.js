const users = require('../data/user.json'); // 静态数据文件

// 目的：判断输入的用户名和密码，是否和上面文件中已有的信息匹配

let username = '';

process.stdout.write("请输入用户名:");

//process.stdin.setEncoding('utf8'); 为什么不用这个设置？而是使用.toString().trim() ？

process.stdin.on('data', input => {
  let inputData = input.toString().trim();
  
  if (!username) { // 输入的确实是用户名
    if (Object.keys(users).indexOf(inputData) < 0) { // 输入的用户名不存在于json文件中
      process.stdout.write('用户名不存在'+'\n');
      process.stdout.write("请重新输入用户名:");
      username = ''; // 重置
    } else { // 输入的用户名存在于json中
      process.stdout.write("请输入密码:");
      username = inputData;
    }
  } else { // 输入的是密码
    if (inputData === users[username]) { // 密码正确（存在于json文件中且映射正确）
      console.log("登陆成功");
      //process.stdin.end(); // 官网好像没有此方法
      process.stdin.pause(); //Stop reading input，停止触发'data'事件
    } else {
      process.stdout.write("密码错误，请重新输入密码: ");
    }
  }
});
