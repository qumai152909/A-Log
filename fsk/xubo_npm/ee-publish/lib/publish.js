const execsync = require('child_process').execSync
const path = require('path')
const isWin = /win\d{2}/i.test(process.platform)
const cwd = process.cwd()+(isWin?'\\':'/')
const Client = require('ssh2').Client
const fs = require('fs')
const config = require('../config/index.json')
const readdirSync  = require('fsk-readdir').readdirSync
const dirCreators = {}
require('colors')
let remoteHost = null

function formatSvnFile(str){
  const patten = /[AM]\s+(?:\+\s+)?[^\s\n\r(:]+/g,
    match = str.match(patten),
    filter = /[AM]\s+(?:\+\s+)?/,
    relative = /^\/+/,
    result = [];
  match && match.forEach(function(val){
    let fp = val.replace(filter,'').replace(relative,'')
    result.push(path.resolve(cwd, fp));
  });
  return result;
}
function mkdirWithSFtp (fp, sftp) {
  const arr = fp.replace(/^(\/|\\)|(\\|\/)$/g, '').split(/\/|\\/); // ['images', 'a.png']

  const promise = dir => new Promise((resolve, reject) => {
    sftp.stat(dir, err => {
      if (err) {
        sftp.mkdir(dir, err => err ? reject(err) : resolve(dir))
      } else {
        resolve(dir)
      }
    })
  })
  return arr.reduce((a, b) => {
    return a.then(pDir => {
      const dirPath = `${pDir || ''}/${b}`; // '/images'
      const p = dirCreators[dirPath] || promise(dirPath);
      dirCreators[dirPath] || (dirCreators[dirPath] = p)
      return p
    })

  }, Promise.resolve())
}


// ip 服务器IP地址
// name 别名
// user 用户名
// pwd 密码
// local 本地文件目录 'asset-dev'
// remote 远程目录 '/data/static/QA18/fe-vas-h5'

// fp = '/Users/sunyingying23/Github/A-Log/bin/asset-dev/images/gogreern.png'

function syncFile(fp, sftp) {
  return new Promise((resolve, reject) => {
    const stat = fs.statSync(fp)
    let {local, remote, ip} = remoteHost;
    local = local.replace(/^(\\|\/)|(\\|\/)$/g, ''); // asset-dev
    remote = remote.replace(/^(\\|\/)|(\\|\/)$/g, ''); // "data/static/QA6/fe-vas-h5"
  
    // rpath="/data/static/QA6/fe-vas-h5/images/gogreern.png" ???
  
    const rpath = fp.replace(local, remote)
      .replace(/trunk[\\\/]?/, '')  // 去掉trunk目录
      .replace(/branches[\\\/][^\\\/]+[\\\/]?/, '') // 去掉分支目录
 
    if (stat.isDirectory()) {
      sftp.stat(fp, err => {
        if (err) {
          mkdirWithSFtp(rpath, sftp).then(resolve).catch(err => {
            console.log(`sync:: ${fp} >>>>>> ${ip}:${rpath} >>>>>> ${err}`)
          })
        } else {
          resolve()
        }
      })
    } else {
      // fp是一个文件，开始上传到远程服务器
      sftp.fastPut(fp, rpath, err => {
        if (err) {
          if (err.toString().indexOf('No such file') >- 1) { // 如果服务器上没有这个文件
            console.log(`sync:: ${ fp } 需要创建创建文件夹...`.red)
            mkdirWithSFtp(path.dirname(rpath), sftp)
              .then(() => syncFile(fp, sftp))
              .then(resolve)
              .catch(err => {
                console.log(`sync:: ${ fp } >>>>>> ${ip}:${rpath} >>>>>>${err}`.red)
                console.log('重试一次...')
                return syncFile(fp, sftp)
              })
              .catch(err => {
                console.log(`sync:: ${fp} >>>>>> ${ip}:${rpath} >>>>>> ${err}`.red)
                return syncFile(fp, sftp)
              })
              .then(resolve)
              .catch(err => console.log(`sync:: ${ fp } >>>>>> ${ip}:${rpath} >>>>>>${err}`.red))
          } else {
            console.log(`sync:: ${fp} >>>>>> ${ip}:${rpath} >>>>>> ${err}`.red)
            resolve()
          }
        } else {
          // 上传成功
          console.log(`sync:: ${fp} >>>>>> ${ip}:${rpath} >>>>>> success`.green);
          resolve()
        }
      })
    }
  })
}

function syncHosts (args, fileList) {
  const {h: hosts, pub} = args
  const host = hosts.pop()
  if (!host) {
    return
  }
  remoteHost = config[host]; // host = '10.110.15.1' or host=h='q6'
  const conn = new Client();
  conn.on('ready', () => {
    conn.sftp((err, sftp) => {
      if (err) throw err
      // 一个一个来
      fileList.reduce((a, b) => a.then(() => syncFile(b, sftp)), Promise.resolve()).then(() => {
        conn.end()
        syncHosts(args, fileList)
      }).catch(err => {
        console.error(err)
        conn.end()
      })
      // 太快了
      // Promise.all(fileList.map(file => syncFile(file, sftp))).then(() => {
      //   conn.end()
      //   syncHosts(args, fileList)
      // }).catch(err => {
      //   console.error(err)
      //   conn.end()
      // })
    })
  }).connect({
    host: remoteHost.ip,
    port: remoteHost.port,
    username: remoteHost.user,
    password: remoteHost.pwd
  })
}

function getFileList (args) {
  const {s, d, f, filter, ignore} = args
  if (s) {
    const files = execsync('svn status').toString()
    return formatSvnFile(files)
  } else if (d) {
    return readdirSync(cwd, filter, ignore, true).map(val => path.resolve(cwd, val))
  } else if (f) {
    if (typeof f === 'string') {
      return [path.resolve(cwd, f)]
    } else if (Array.isArray(f)) {
      return f.map(fp => path.resolve(cwd, fp))
    }
  }
}
module.exports = (args) => {
  if (typeof args.h === 'string') {
    args.h = [args.h]
  }
  const fileList = getFileList(args)
  if (args.pub) {
    fileList && fileList.length > 0 && syncHosts(args, fileList)
  } else {
    fileList && fileList.forEach(fp => console.log(fp))
  }
}
