const path = require('path');
const readdirFilesSync = require('../utils/readdirFilesSync'); // 同步遍历文件夹中所有文件

const isWin = /win\d{2}/i.test(process.platform);

// 在项目A-Log运行upFilesBin文件，cwd = /Users/sunyingying23/Github/A-Log/
let cwd = process.cwd()+(isWin?'\\':'/'); // 调用node命令执行脚本时的目录

// 启动命令的参数，暂时写死 todo
const argsStatic = {
  d: './',
  r: '/data/static/QA18/fe-vas-h5',
  h: '10.110.15.1',
  p: 'qa',
  u: 'qa',
  sourceRoot: 'bin/asset-dev',
  targetRoot: 'dist',
  pub: true
};
const sourceDir = path.join(cwd, argsStatic.sourceRoot); // '/Users/sunyingying23/Github/A-Log/bin/asset-dev/'
const tarDir = path.join(cwd, argsStatic.targetRoot); // '/Users/sunyingying23/Github/A-Log/dist'

// 主文件
function upFiles() {
  const fileList = readdirFilesSync(sourceDir);
  console.log(fileList);
  
  //fileList.reduce((a, b) => a.then(() => syncFile(b, sftp)), Promise.resolve());
}

//upFiles();
module.exports = upFiles;
