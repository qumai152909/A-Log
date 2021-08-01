研究的目标文件均在A-Log/bin目录下；

# 启动命令

启动命令：在项目A-Log根目录下面，控制台输入其中一个命令：

~~~bash
./bin/userBin isUser
./bin/userBin inputIn
./bin/userBin createUser
./bin/userBin showTxtContent
./bin/userBin prams
./bin/userBin prams -d ./  -r /data/fe/release/fe-vas-h5 -h q6 --localroot asset-dev --pub

./bin/userBin mkdir
./bin/userBin copeOneFile

./bin/userBin copyFolderSync -f bin/asset-dev -t copyAssetDevSync

./bin/pubBin upFiles
~~~

# 参数

~~~bash
./bin/userBin prams -d ./  -r /data/fe/release/fe-vas-h5 -h q6 --localroot asset-dev --pub

# 输出参数：
{
	_: [ 'prams' ],
  d: './',
  r: '/data/fe/release/fe-vas-h5',
  h: 'q6',
  localroot: 'asset-dev',
  pub: true
}
~~~

o r

~~~bash
./bin/userBin prams -d ./ -r /data/static/QAPUB/fe-vas-h5 -h 10.110.15.1 -p qa -u qa --localroot asset-dev --pub

# 输出参数：

{
	_: [ 'prams' ],
  d: './',
  r: '/data/static/QAPUB/fe-vas-h5',
  h: '10.110.15.1',
  p: 'qa',
  u: 'qa',
  localroot: 'asset-dev',
  pub: true
}

~~~

对应addServer中的参数

​		h = host = '10.110.15.1'

​	   local = localRoot = "asset-dev"

```json
{
  "Q6": {
    "ip": "12.122.12.66",
    "port": 22,
    "user": "syy",
    "password": "****",
    "local": "asset-dev",
    "remote": "/data/static/QA6/fe-vas-h5"
  },
  "12.122.12.66": {
    "ip": "12.122.12.66",
    "port": 22,
    "user": "syy",
    "password": "****",
    "local": "asset-dev",
    "remote": "/data/static/QA6/fe-vas-h5"
  }
}
```

# 正则

~~~js
    let {local, remote, ip} = remoteHost;

    local = local.replace(/^(\\|\/)|(\\|\/)$/g, ''); // 去掉首位的‘/’ 、 或者‘\\’
    remote = remote.replace(/^(\\|\/)|(\\|\/)$/g, '');

'\\asset\\'.replace(/^(\\|\/)|(\\|\/)$/g, ''); // asset
'/asset/'.replace(/^(\\|\/)|(\\|\/)$/g, '');  // asset
~~~





# readdirFilesSync.js

**获取目录下所有文件地址**

目的： 找出目标文件下，所有文件和子孙文件的绝对路径，并返回这些文件绝对路径组成的数组

目标目录结构：

~~~
/Users/sunyingying23/Github/A-Log/bin/asset-dev/
																				-- main.html
																			 --- images/
																								-- gogreern.png
                                                -- satr-coffee.jpeg
~~~

**readdirFilesSync.js ： 递归遍历目录，找出所有文件：**

~~~js
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
~~~

**调用readdirFilesSync函数**

~~~js
const readdirFilesSync = require('../utils/readdirFilesSync'); // 同步遍历文件夹中所有文件

// SSH2库, 能够与服务器建立ssh连接,  轻松传输(下载和上传)文件
const Client = require('ssh2').Client; // 创建自己的sftp客户端构造函数

const isWin = /win\d{2}/i.test(process.platform);

// 在项目A-Log运行upFilesBin文件，cwd = /Users/sunyingying23/Github/A-Log/
let cwd = process.cwd()+(isWin?'\\':'/'); // 调用node命令执行脚本时的目录

// 暂时写死：todo
cwd = '/Users/sunyingying23/Github/A-Log/bin/asset-dev/';


  const fileList = readdirFilesSync(cwd);
  console.log(fileList);
~~~

结果：

~~~js
[
  '/Users/sunyingying23/Github/A-Log/bin/asset-dev/images/gogreern.png',
  '/Users/sunyingying23/Github/A-Log/bin/asset-dev/images/satr-coffee.jpeg',
  '/Users/sunyingying23/Github/A-Log/bin/asset-dev/main.html'
]
~~~

# upfiles.js-连接服务器

~~~js
// SSH2库,  能够与服务器建立ssh连接,  轻松传输(下载和上传)文件
const Client = require('ssh2').Client; // 创建自己的sftp客户端构造函数

// 连接服务器
function connServer() {
  const conn = new Client();
  const remotePathToList = '/webApp/';

  conn.on('ready', () => {
    conn.sftp(function(err, sftp) {
      if (err) throw err;

      sftp.readdir(remotePathToList, (err, list) => {
        if (err) throw err;
        console.log('uuuuueeueeueu');

        // List the directory in the console
        console.dir(list); // 输出1
        // Do not forget to close the connection, otherwise you'll get troubles
        conn.end();
      });
    });
  }).on('error', err => {
    console.log(`connect error: ${err}`);
  }).connect({
    host: '120.27.215.50',
    port: '22', // 默认22
    username: 'root',
    password: 'SYY152909.',
    interactiveAuth: true,
    tryKeyboard: true,
  });
}

connServer();
~~~

运行：./bin/testBin upfile命令后，输出1输出结果：

~~~json
[
  {
    filename: 'index.html',
    longname: '-rw-r--r--    1 root     root          576 Jul  7 00:16 index.html',
    attrs: Stats {
      mode: 33188,
      permissions: 33188,
      uid: 0,
      gid: 0,
      size: 576,
      atime: 1625768480,
      mtime: 1625588171
    }
  },
  {
    filename: '404.html',
    longname: '-rw-r--r--    1 root     root          525 Jul  7 00:20 404.html',
    attrs: Stats {
      mode: 33188,
      permissions: 33188,
      uid: 0,
      gid: 0,
      size: 525,
      atime: 1625714258,
      mtime: 1625588407
    }
  },
  {
    filename: 'js',
    longname: 'drwxr-xr-x    2 root     root           52 Jul  7 18:30 js',
    attrs: Stats {
      mode: 16877,
      permissions: 16877,
      uid: 0,
      gid: 0,
      size: 52,
      atime: 1625795529,
      mtime: 1625653824
    }
  },
  {
    filename: 'css',
    longname: 'drwxr-xr-x    2 root     root           35 Jul  7 18:34 css',
    attrs: Stats {
      mode: 16877,
      permissions: 16877,
      uid: 0,
      gid: 0,
      size: 35,
      atime: 1625795531,
      mtime: 1625654082
    }
  },
  {
    filename: 'access.log',
    longname: '-rw-r--r--    1 nginx    root      1976513 Jul  9 13:22 access.log',
    attrs: Stats {
      mode: 33188,
      permissions: 33188,
      uid: 990,
      gid: 0,
      size: 1976513,
      atime: 1625808187,
      mtime: 1625808170
    }
  },
  {
    filename: 'error.log',
    longname: '-rw-r--r--    1 nginx    root        62937 Jul  9 11:12 error.log',
    attrs: Stats {
      mode: 33188,
      permissions: 33188,
      uid: 990,
      gid: 0,
      size: 62937,
      atime: 1625800351,
      mtime: 1625800347
    }
  },
  {
    filename: 'redirect.html',
    longname: '-rw-r--r--    1 root     root          597 Jul  7 18:15 redirect.html',
    attrs: Stats {
      mode: 33188,
      permissions: 33188,
      uid: 0,
      gid: 0,
      size: 597,
      atime: 1625740108,
      mtime: 1625652940
    }
  }
]
~~~

# syncFile.js

~~~js
// fp = '/Users/sunyingying23/Github/A-Log/bin/asset-dev/images/gogreern.png'

function syncFile(fp, sftp) {
  return new Promise((resolve, reject) => {
    const stat = fs.statSync(fp)

    let {local, remote, ip} = remoteHost; // remote="/data/static/QA6/fe-vas-h5"

    local = local.replace(/^(\\|\/)|(\\|\/)$/g, ''); // asset-dev
    remote = remote.replace(/^(\\|\/)|(\\|\/)$/g, ''); // "data/static/QA6/fe-vas-h5"

  // rpath="/Users/sunyingying23/Github/A-Log/bin/data/static/QA6/fe-vas-h5/images/gogreern.png"
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
      // fp是一个文件
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
~~~









