const fs = require('fs');

// 判断是否是一个目录
function isDir (path) {
  return !!fs.statSync(path).isDirectory();
}
// 判断是否是一个文件
function isFile(path) {
  return !!fs.statSync(path).isFile();
}

// 数据类型判断
function isType(type) {
  return function(obj) {
    return {}.toString.call(obj) == "[object " + type + "]";
  }
}

const isObject = isType("Object");
const isString = isType("String");
const isArray = Array.isArray;
const isFunction = isType("Function");
const isBoolean = isType("Boolean");

exports.isDir = isDir;
exports.isFile = isFile;
exports.isObject = isObject;
exports.isArray = isArray;
exports.isFunction = isFunction;
exports.isBoolean = isBoolean;
exports.isString = isString;
