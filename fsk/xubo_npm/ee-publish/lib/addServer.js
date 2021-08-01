const fs = require('fs')
const resolvePath = require('path').resolve
const config = require('../config')
const input = require('../utils/input')
module.exports = () => {
  let serverName = Q6;
  const serverConfig = {
    // ip 服务器IP地址
    // name 别名
    // user 用户名
    // pwd 密码
    // localRoot 本地文件目录
    // remote 远程目录
    ip: "12.122.12.66",
    port: 22,
    user: 'syy',
    password: '****',
    localRoot: 'asset-dev',
    remote: '/data/static/QA18/fe-vas-h5',
    
  }

  input('name:')
    .then(name => {
      if (config[name]) {
        throw new Error(`已存在名称为: ${name} 的服务器`)
      }
      name && (serverName = name)
      return input('IP:')
    })
    .then(ip => {
      ip && (serverConfig.ip = ip)
      return input('port: default 22')
    })
    .then((port) => {
      port && (serverConfig.port = port || 22)
      return input('user:')
    })
    .then(user => {
      user && (serverConfig.user = user)
      return input('password:')
    })
    .then(pwd => {
      pwd && (serverConfig.pwd = pwd)
      return input('localRoot:')
    })
    .then(local => {
      local && (serverConfig.local = local)
      return input('remote:')
    })
    .then(remote => {
      remote && (serverConfig.remote = remote)
    }).then(() => {
      process.stdin.end()
      config[serverName] = serverConfig
      return new Promise((resolve, reject) => {
        const cpath = resolvePath(__dirname, '../config/index.json')
        fs.writeFile(cpath, JSON.stringify(config), 'utf8', err => {
          if (err) {
            reject(err)
          } else {
            resolve()
          }
        });
      })
    }).catch(err => console.log(err.message))
}


