const fs = require('fs');
const chalk = require('chalk');

// 异步： Asynchronously creates a directory

// Creates /tmp/a/apple, regardless of whether `/tmp` and /tmp/a exist.
fs.mkdir('./tmp/a/apple', { recursive: true }, (err) => {
  if (err) {
    console.log(chalk.redBright(err));
    throw err;
  } else {
    console.log(chalk.greenBright('创建文件夹./tmp/a/apple成功'));
  }
});
