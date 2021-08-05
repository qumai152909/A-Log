// 同步方法： 拷贝文件夹中所有文件、文件夹、子文件、子文件夹，到另一个目录下

const fs = require('fs');
const path = require('path');
const rimraf = require('rimraf');
const chalk = require('chalk');

const isWin = /win\d{2}/i.test(process.platform);
let cwd = process.cwd()+(isWin?'\\':'/'); // 调用node命令执行脚本时的目录: /Users/sunyingying23/Github/A-Log/

const args = require('minimist')(process.argv.slice(2));
const { f, t } = args;

const fromPath = path.join(cwd, f);
const toPath = path.join(cwd, t);

function copyFolderSync(from, to) {
  fs.mkdirSync(to); // Synchronously creates a directory
  
  // readdirSync ：Reads the contents of the directory. ['images', 'main.html']
  
  fs.readdirSync(from).forEach(element => {
    const eleFromPath = path.join(from, element);
    const eleToPath = path.join(to, element);
    
    if (fs.statSync(eleFromPath).isFile()) {
      
      fs.copyFileSync(eleFromPath, eleToPath); // 复制
      
      const fromRelative = eleFromPath.replace(cwd, '');
      const toRelative = eleToPath.replace(cwd, '');
      console.log(chalk.green(`复制:: ${fromRelative} >>>>>> ${toRelative} >>>>>> success`));
    } else {
      
      copyFolderSync(eleFromPath, eleToPath);
    }
  });
}

function startCopy() {
  rimraf(toPath, err => {
    if (err) {
      console.log(chalk.red(err));
      throw err;
    } else {
      console.log(chalk.green(`清理文件夹${t}：success`));
      copyFolderSync(fromPath, toPath);
    }
  });
}

module.exports = () => {
  startCopy();
};

