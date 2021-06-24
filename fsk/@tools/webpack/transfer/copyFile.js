const fs = require('fs')
const path = require('path')
const dir = require('./paths')

const { paths: { dir } } = require('../utils');


function fileDir(_path) {
  let result = fs.readdirSync(_path).filter(v => !/^\./.test(v))
  result.forEach(v => {
    let subPath = path.join(_path, v)
    let stat = fs.statSync(subPath)
    if (stat.isFile()) {
      let fileName = path.basename(subPath)
      let simpleFileName = fileName.replace(/^(.+?)(\.[a-z0-9]{8,})(\.[^.]+)$/, '$1$3')
      if (/^.+?\.[a-z0-9]{8,}\.[^.]+$/.test(fileName)) {
        let readable = fs.createReadStream(subPath);
        let writable = fs.createWriteStream(path.join(subPath, `../${simpleFileName}`));
        readable.pipe(writable);
      }
    } else if (stat.isDirectory()) {
      fileDir(subPath)
    }
  })
}

module.exports = function(){
  fileDir(dir.prdPath)
}
