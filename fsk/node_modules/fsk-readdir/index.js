/**
 * Created by panyanming on 15/2/3.
 * readdirSync is fsk sub module return files array
 * @root directory
 * @deep true or false
 * @filter ['.js','.css'] or '.js' or ''
 */

var fs = require('fs'),
    resolve = require('path').resolve,
    basename = require('path').basename,
    pathjion = require('path').join,
    extname = require('path').extname,
    cwd = process.cwd();

function isType(type) {
    return function(obj) {
        return {}.toString.call(obj) == "[object " + type + "]"
    }
}
var isObject = isType("Object");
var isString = isType("String");
var isArray = Array.isArray;
var isFunction = isType("Function");
var isBoolean = isType("Boolean");

function isDir (path){
    return !!fs.statSync(path).isDirectory();
}

function isFile(path){
    return !!fs.statSync(path).isFile();
}

function readdirSync(root,filter,ignore,deep){
    var result = [];
    if(filter && isString(filter)){
        filter = [filter];
    }
    if(ignore && isString(ignore)){
        ignore = [ignore];
    }
    if(isString(root)){
        root = [root];
    }
    root.forEach(function(subs){
        if(!isDir(subs)){
            console.log(subs +' is not directory');
            return false;
        }
        fs.readdirSync(subs).forEach(function(fd){
            var pathreg = /^\/|([A-Z]:\\)/;
            var pathstart = pathreg.exec(subs);
            var path = pathstart&&pathstart.index === 0 ? pathjion(subs,fd) : pathjion(cwd,subs,fd);
            if(isFile(path)&& basename(path).indexOf('.')!==0){
                if(filter){
                    filter.indexOf(extname(fd)) > -1 && result.push(path);
                }else if(ignore){
                    ignore.indexOf(extname(fd)) === -1 && result.push(path);
                }else{
                    result.push(path);
                }
            }else if(isDir(path) && deep && fd.indexOf('.')!==0){
                result = result.concat(readdirSync(path,filter,ignore,deep));
            }
        });
    });
    return result;
}

exports.readdirSync = readdirSync;
exports.isDir = isDir;
exports.isFile = isFile;
exports.isObject = isObject;
exports.isArray = isArray;
exports.isFunction = isFunction;
exports.isBoolean = isBoolean;
exports.isString = isString;