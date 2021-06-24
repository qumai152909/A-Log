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
  const arr = fp.replace(/^(\/|\\)|(\\|\/)$/g, '').split(/\/|\\/)
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
      const dirPath = `${pDir || ''}/${b}`
      const p = dirCreators[dirPath] || promise(dirPath)
      dirCreators[dirPath] || (dirCreators[dirPath] = p)
      return p
    })

  }, Promise.resolve())
}

function syncFile(fp, sftp) {
  return new Promise((resolve, reject) => {
    const stat = fs.statSync(fp)
    let {local, remote, ip} = remoteHost
    local = local.replace(/^(\\|\/)|(\\|\/)$/g, '')
    remote = remote.replace(/^(\\|\/)|(\\|\/)$/g, '')
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
      sftp.fastPut(fp, rpath, err => {
        if (err) {
          if (err.toString().indexOf('No such file') >- 1) {
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
  remoteHost = config[host]
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
