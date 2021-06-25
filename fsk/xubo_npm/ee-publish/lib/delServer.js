const fs = require('fs')
const resolvePath = require('path').resolve
const config = require('../config')
module.exports = (name) => {
  delete config[name]
  const cpath = resolvePath(__dirname, '../config/index.json')
  fs.writeFile(cpath, JSON.stringify(config), 'utf8', err => {
    err && console.log(err)
    require('./showList')
  })
}


