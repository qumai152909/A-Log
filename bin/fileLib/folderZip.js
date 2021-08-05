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
const { f, t, p } = args;

const toPath = path.join(cwd, t);
let fromPath = getFromPath(f, p);

console.log(chalk.blue(`转换打包文件目录: ${fromPath}`));

function getFromPath(from, project) {
  let initFromPath = path.join(cwd, from, project);
  
  let dateFolderName = null;
  fs.readdirSync(initFromPath).forEach(item => {
    if (item.indexOf('.') < 0) {
      dateFolderName = item;
    }
  });

  return path.join(initFromPath, dateFolderName);
}

function copyHtml() {
  // readFile方法读取文件内容
  // writeFile改写文件内容
  const htmlPath = path.join(cwd, 'src/index.html');
  
  fs.readFile(htmlPath, 'utf8', function(err, fileContent) {
    // /plus-xview-milestone/20210726
    const re = new RegExp("\\\/" + p + "\\\/(\\d)+", "g");
    
    const result = fileContent.replace(re, '.');
    
    fs.writeFile(`${toPath}/index.html`, result, 'utf8', function (err) {
      if (err) {
        console.log(chalk.red('文件index.html复制失败！'));
        throw err;
      } else {
        console.log(chalk.green('文件index.html复制: success！'));
      }
    });
    
  })
}

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
        
        copyHtml();
        console.log(chalk.green(`成功将文件为通天塔格式，路径为${toPath}/tower.zip`));
      });
    }
  });
}

module.exports = () => {
  startZip();
};

