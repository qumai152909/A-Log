const fs = require('fs');
const resolve = require('path').resolve;
const basename = require('path').basename;
const pathjion = require('path').join;
const extname = require('path').extname;
const cwd = process.cwd();

// 数据类型判断
function isType(type) {
  return function(obj) {
    return {}.toString.call(obj) == "[object " + type + "]"
  }
}
const isObject = isType("Object");
const isString = isType("String");
const isArray = Array.isArray;
const isFunction = isType("Function");
const isBoolean = isType("Boolean");

// 判断是否是一个目录
function isDir (path){
  return !!fs.statSync(path).isDirectory();
}
// 判断是否是一个文件
function isFile(path){
  return !!fs.statSync(path).isFile();
}

// root = '/Users/sunyingying23/Github/A-Log/bin/asset-dev/'

/**
 * readdirSync is fsk sub module return files array
 * @root directory
 * @deep true or false :暂无
 * @filter ['.js','.css'] or '.js' or ''
 */

function readdirFilesSync(root) {
  if (!isDir(root)) {
    console.log(root +' is not directory');
    return false;
  }

  // 得到root目录下的所有内容
  const rootFiles = fs.readdirSync(root); // ['images', 'main.html']

  rootFiles.forEach(fd => {
    const pathreg = /^\/|([A-Z]:\\)/; // 匹配/开头，或者E:\\
    const pathstart = pathreg.exec(root); // ["/", undefined, index: 0, input: "/Users/sunyingying23/Github/A-Log/bin/asset-dev/", groups: undefined]
    
    // 得出fd的完整路径: '/Users/sunyingying23/Github/A-Log/bin/asset-dev/main.html'
    const fdPath = pathstart && pathstart.index === 0 ? pathjion(root, fd) : pathjion(cwd, root, fd);
    
    // 如果fdPath是一个文件
    if(isFile(fdPath)) {
    
    }
  });
}

module.exports = readdirFilesSync;
