const users = require('../data/user.json');


let username = '';

process.stdout.write("请输入用户名:");

//process.stdin.setEncoding('utf8');

process.stdin.on('data', input => {
  let inputData = input.toString().trim();
  
  if (!username) {
    if (Object.keys(users).indexOf(inputData) < 0) {
      process.stdout.write('用户名不存在'+'\n');
      process.stdout.write("请重新输入用户名:");
      username = '';
    } else {
      process.stdout.write("请输入密码:");
      username = inputData;
    }
  } else {
    if (inputData === users[username]) {
      console.log("登陆成功");
      //process.stdin.end();
      process.stdin.pause();
    } else {
      process.stdout.write("密码错误，请重新输入密码"+"\n");
    }
  }
});
