const readdirFilesSync = require('./readdirFilesSync'); // 同步遍历文件夹中所有文件

// 获取目录中所有文件
function getFileList(args) {
  const { d } = args;
  // -d ./ 部署当前目录下所有文件到服务器，此时目录=asset-dev
  if (d) {
    const readdirList = readdirFilesSync(cwd);
    console.log(readdirList);
    return readdirList;
  }
}

module.exports = getFileList;
