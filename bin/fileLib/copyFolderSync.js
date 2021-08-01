// 同步方法： 拷贝文件夹中所有文件、文件夹、子文件、子文件夹，到另一个目录下

const fs = require('fs');
const path = require('path');
const rimraf = require('rimraf');
const chalk = require('chalk');
const JSZip = require('jszip');

const zip = new JSZip();

const isWin = /win\d{2}/i.test(process.platform);
let cwd = process.cwd()+(isWin?'\\':'/'); // 调用node命令执行脚本时的目录: /Users/sunyingying23/Github/A-Log/

const args = require('minimist')(process.argv.slice(2));
const { f, t } = args;

const fromPath = path.join(cwd, f);
const toPath = path.join(cwd, t);

function zipFolder(nowPath, zipObj) {
  let files = fs.readdirSync(nowPath);//读取path目录中的所有文件及文件夹名字（同步操作）

  files.forEach(fileName => { //遍历path目录
    let fillPath = path.join(nowPath, fileName);
    let fileAttr = fs.statSync(fillPath);//获取一个文件的属性

    if (fileAttr.isFile()) {
      zipObj.file(fileName, fs.readFileSync(fillPath)); // 压缩目录添加文件
    } else { // 如果是目录的话，继续查询
      let dirlist = zip.folder(fileName);// 压缩对象中生成该目录
      zipFolder(fillPath, dirlist);//重新检索目录文件
    }
  });
}

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

function startZip() {
  rimraf(toPath, err => {
    if (err) {
      console.log(chalk.red(err));
      throw err;
    } else {
      console.log(chalk.green(`清理文件夹${t}：success`));
      fs.mkdirSync(toPath); // Synchronously creates a directory
      
      zipFolder(fromPath, zip);
  
      zip.generateAsync({ // 设置压缩格式，开始打包
        type: "nodebuffer",//nodejs用
        compression: "DEFLATE", // 压缩算法
        compressionOptions: { // 压缩级别
          level: 0
        }
      }).then(function (content) {
        fs.writeFileSync(toPath + "/result.zip", content, "utf-8");//将打包的内容写入 指定目录下的 result.zip中
        console.log(chalk.green(`成功将文件为通天塔格式，路径为${toPath}/tower.zip`));
      });
    }
  });
}

module.exports = () => {
  // startCopy();
  startZip();
};

