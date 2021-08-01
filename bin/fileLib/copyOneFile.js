const fs = require('fs');
const chalk = require('chalk');

function callback(err) {
  if (err) {
    console.log(chalk.redBright(err));
    throw err;
  }
  console.log(chalk.greenBright('拷贝成功： source.txt was copied to destination.txt'));
}

// 默认：覆盖式复制文件： destination.txt will be created or overwritten by default.
// 如果tmp文件夹不存在，拷贝失败，error

fs.copyFile('./bin/data/wow.txt', './tmp/wow.txt', callback);

// By using COPYFILE_EXCL, the operation will fail if destination.txt exists.
//fs.copyFile('source.txt', 'destination.txt', fs.constants.COPYFILE_EXCL, callback);
