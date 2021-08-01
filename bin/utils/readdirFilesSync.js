const fs = require('fs');
const chalk = require('chalk');

const resolve = require('path').resolve;
const basename = require('path').basename;
const pathjion = require('path').join;
const extname = require('path').extname;
const cwd = process.cwd();

const { isDir, isFile } = require('../utils/getType');

/**
 * readdirSync is fsk sub module return files array
 * @root directory
 * @deep true or false :暂无
 * @filter ['.js','.css'] or '.js' or ''
 */

// root = '/Users/sunyingying23/Github/A-Log/bin/asset-dev/'

function readdirFilesSync(root) {
  let result = [];
  if (!isDir(root)) {
    console.log(chalk.red(root +' is not directory'));
    return false;
  }

  // 同步得到root目录下的所有内容名称组成的数组, fs.readdirSync = Reads the content's filenames of the directory.
  const rootFiles = fs.readdirSync(root); // ['images', 'main.html']

  rootFiles.forEach(fd => {
    const pathreg = /^\/|([A-Z]:\\)/; // 匹配/开头，或者E:\\
    const pathstart = pathreg.exec(root); // ["/", undefined, index: 0, input: "/Users/sunyingying23/Github/A-Log/bin/asset-dev/", groups: undefined]
    
    // 得出fd的完整路径: '/Users/sunyingying23/Github/A-Log/bin/asset-dev/main.html'
    const fdPath = pathstart && pathstart.index === 0 ? pathjion(root, fd) : pathjion(cwd, root, fd);
    
    // 如果fdPath是一个文件， basename=main.html
    if(isFile(fdPath) && basename(fdPath).indexOf('.') !== 0) {
      result.push(fdPath);
    } else if (isDir(fdPath) && fd.indexOf('.') !== 0) {
      result = result.concat(readdirFilesSync(fdPath)); // 如果fdPath是文件夹，则递归查找文件夹下面的各个文件
    }
  });
  
  return result;
}

module.exports = readdirFilesSync;
