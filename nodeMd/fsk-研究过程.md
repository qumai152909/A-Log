研究的目标文件均在A-Log/bin目录下；

# 启动命令

启动命令：在项目A-Log根目录下面，控制台输入：

~~~bash
./bin/testBin 

./bin/testBin upfile
~~~



# upfiles.js文件

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









