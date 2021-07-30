研究的目标文件均在A-Log/bin目录下；

# 启动命令

启动命令：在项目A-Log根目录下面，控制台输入其中一个命令：

~~~bash
./bin/userBin isUser
./bin/userBin inputIn
./bin/userBin createUser
./bin/userBin showTxtContent
./bin/userBin prams

./bin/upFilesBin upFiles
~~~

## 启动/demo1/user.js文件



# readdirFilesSync.js-目录下所有文件地址

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
  let result = [];
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
const isWin = /win\d{2}/i.test(process.platform);
let cwd = process.cwd()+(isWin?'\\':'/'); // 调用node命令执行脚本时的目录
// 在项目A-Log运行testBin文件，得到console.log(cwd)： /Users/sunyingying23/Github/A-Log/

// 暂时写死：
cwd = '/Users/sunyingying23/Github/A-Log/bin/asset-dev/';

const readdirList = readdirFilesSync(cwd);
console.log(readdirList);
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









