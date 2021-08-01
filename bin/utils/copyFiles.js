
// ip 服务器IP地址
// name 别名
// user 用户名
// pwd 密码
// localRoot 本地文件目录 'asset-dev'
// remote 远程目录 '/data/static/QA18/fe-vas-h5'

// fp = '/Users/sunyingying23/Github/A-Log/bin/asset-dev/images/gogreern.png'

function copyFiles(fp, sftp) {
  return new Promise((resolve, reject) => {
    const stat = fs.statSync(fp); // fs.statSync = 同步获取文件的属性

    let {local, remote, ip} = remoteHost;
    local = local.replace(/^(\\|\/)|(\\|\/)$/g, ''); // asset-dev
    remote = remote.replace(/^(\\|\/)|(\\|\/)$/g, ''); // "data/static/QA6/fe-vas-h5"
  
    // rpath="/Users/sunyingying23/Github/A-Log/bin/data/static/QA6/fe-vas-h5/images/gogreern.png"
  
    const rpath = fp.replace(local, remote)
                    .replace(/trunk[\\\/]?/, '')  // 去掉trunk目录
                    .replace(/branches[\\\/][^\\\/]+[\\\/]?/, ''); // 去掉分支目录

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
