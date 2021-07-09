

SSH2 client and server modules written in pure JavaScript for [node.js](http://nodejs.org/).

**使用SSH2库,  能够与服务器建立ssh连接,  轻松传输(下载和上传)文件**

 ssh2是用纯JavaScript编写的，你可以使用此插件轻松创建自己的sftp客户端。

https://github.com/mscdex/ssh2

http://www.srcmini.com/61074.html

# Installation

```
 npm install ssh2
```

https://www.npmjs.com/package/ssh2

# ssh2 Api

 `require('ssh2').Client`  : returns a **_Client_** constructor. (客户端构造函数)

 `require('ssh2').Server` returns a **_Server_** constructor. （服务器端构造函数）

# ssh2 Client： 客户端

~~~js
var Client = require('ssh2').Client; // 客户端构造函数

var conn = new Client(); // 创建一个客户端实例对象
~~~

## client events(客户端事件)

* **ready**() - Authentication was successful. （验证成功）
* **end**() - The socket was disconnected.

* **error**(< _Error_ >err) - An error occurred.

## client methods(方法)

### connect()  sftp()

* **connect**(< _object_ >config) - _(void)_ - 使用参数 `config` 中给出的信息尝试连接到服务器

* **sftp**(< _function_ >callback) - _boolean_ - 启动 SFTP 会话. `callback有2个参数`: < _Error_ >err, < _SFTPStream_ >sftp. For methods available on `sftp`, see thesee the [`SFTP` client documentation](https://github.com/mscdex/ssh2/blob/master/SFTP.md).

  (except `read()` and `write()` are used instead of `readData()` and `writeData()` respectively, for convenience). Returns `false` if you should wait for the `continue` event before sending any more traffic.

打开sftp连接：

~~~js
var Client = require('ssh2').Client;
var connSettings = {
     host: 'myserver-direction.com',
  	 port: 22, // Normal is 22 port
     username: 'myUsername',
  	 password: 'myPassword'
};

var conn = new Client();
conn.on('ready', function() {
    conn.sftp(function(err, sftp) {
         if (err) throw err;
         // you'll be able to use sftp here
         // Use sftp to execute tasks like .unlink or chmod etc
    });
}).connect(connSettings);
~~~

### client.exec()

**exec**(< *string* >command[, < *object* >options], < *function* >callback) - *(void)* - Executes `command` on the server. `callback` has 2 parameters: < *Error* >err, < *Channel* >stream. Valid `options` properties are:

### client.end()

- **end**() - *(void)* - Disconnects the socket.



# ftp (文件传输协议)

https://network.51cto.com/art/201909/603552.htm

目前在网络上,如果你想把文件和其他人共享。最方便的办法莫过于将文件放FTP服务器上，然后其他人通过FTP客户端程序来下载所需要的文件。

***\*1、FTP架构\****

   如同其他的很多通讯协议，FTP通讯协议也采用客户机 / 服务器（Client / Server ）架构。

FTP是TCP/IP协议组中的协议之一，TP协议由两个部分组成：

- FTP服务器(用来存储文件)
- FTP客户端(用户可以使用FTP客户端通过FTP协议访问位于FTP服务器上的资源)

*用户可以通过FTP客户端，借助FTP协议，来连接FTP服务器，以上传或者下载文件*。

## vs sftp

SFTP = SSH File Transfer Protocol，安全文件传送协议。

SFTP与FTP有着几乎一样的语法和功能。

SFTP为SSH的其中一部分，是一种传输档案至 Blogger 服务器的安全方式。

其实在SSH软件包中，已经包含了一个叫作SFTP的安全文件信息传输子系统，SFTP本身没有单独的守护进程，它必须使用sshd守护进程(**端口号默认是22**)来完成相应的连接和答复操作，所以从某种意义上来说，SFTP并不像一个服务器程序，而更像是一个客户端程序。

### 两者的主要区别

- 链接方式：FTP使用TCP端口21上的控制连接建立连接。而，SFTP是在客户端和服务器之间通过SSH协议(TCP端口22)建立的安全连接来传输文件。
- 安全性：SFTP使用加密传输认证信息和传输的数据，所以使用SFTP相对于FTP是非常安全。
- 效率：SFTP这种传输方式使用了加密解密技术，所以传输效率比普通的FTP要低得多。



# sftp stream相关

SFTP是SSH File Transfer Protocol的缩写，安全文件传送协议。

SFTPStream: 是一个双向的流；

C = Client

https://github.com/mscdex/ssh2/blob/master/SFTP.md

## C: sftp.fastGet() 下载文件

是客户端的方法（**Client-only methods**）：  Downloads a file at `remotePath` to `localPath`

fastGet(< *string* >remotePath, < *string* >localPath[, < *object* >options], < *function* >callback) - *(void)* 

~~~js
var conn = new Client();
conn.on('ready', function() {
  
    conn.sftp(function(err, sftp) {
        if (err) throw err;
        
        var moveFrom = "/remote/file/path/file.txt";
        var moveTo = "/local/file/path/file.txt";

        sftp.fastGet(moveFrom, moveTo, {}, function(downloadError){
            if(downloadError) throw downloadError;

            console.log("Succesfully uploaded");
        });
    });
}).connect(connSettings);
~~~



## C: sftp.createReadStream()

限制：

​	Client-only methods

语法：

​	reateReadStream(< *string* >path[, < *object* >options]) - *ReadStream* -

含义： 

​	 Returns a new readable stream for `path`

demo:

~~~
sftp.createReadStream('sample.txt', {encoding: 'utf8'});
~~~



## C: sftp.readdir()

语法：

​	 readdir(< *mixed* >location, < *function* >callback) - *boolean*

作用： Retrieves a directory listing = 检索目录中的所有内容

要列出目录, 请使用readdir方法:

~~~js
var Client = require('ssh2').Client;

var remotePathToList = '/var/www/ourcodeworld';

var conn = new Client();

conn.on('ready', function() {
    conn.sftp(function(err, sftp) {
         if (err) throw err;
         
      // list是一个数组[{ filename: 'foo', longname: '....', attrs: {...} }]
         sftp.readdir(remotePathToList, function(err, list) {
                if (err) throw err;
                // List the directory in the console
                console.dir(list);
                // Do not forget to close the connection, otherwise you'll get troubles
                conn.end();
         });
    });
}).connect(connSettings);
~~~

list参数是一个包含对象的数组, 每个对象都包含有关远程路径中每个文件夹和文件的信息。结构应如下所示:

~~~js
[
  {
    filename: 'foo',
    attrs: {},
    ...
  }
]
例如：2代表文件夹，1代表文件， 属性：attrs: Stats
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
    filename: 'redirect.html',
    longname: '-rw-r--r--    1 root     root          597 Jul  7 18:15 redirect.html',
    attrs: Stats {
      mode: 33188,
      permissions: 33188,
      uid: 0,
      gid: 0,
      size: 597,
      atime: 1625740108, // 资源访问时间的 UNIX 时间戳。
      mtime: 1625652940 //  UNIX timestamp of the modified time of the resource
    }
  }
]    
~~~



## C: sftp.stat()

- **stat**(< *string* >path, < *function* >callback) - *(void)* - 

  列出目标的属性（如上面的attrs: Stats） = Retrieves attributes for `path`.

   `callback` has 2 parameter: < *Error* >err, < *Stats* >stats.

  参数stats还有其他方法：

  - `stats.isDirectory()` ： 是否是一个目录
  - `stats.isFile()`

## C: sftp.unlink(): 删除远程文件

~~~js
var remotePathToList = '/var/www/ourcodeworld';

var conn = new Client();
conn.on('ready', function() {
    conn.sftp(function(err, sftp) {
         if (err) throw err;
         
         sftp.unlink("remote-filepath.txt", function(err){
            if ( err ) {
                console.log( "Error, problem starting SFTP: %s", err );
            }
            else
            {
                console.log( "file unlinked" );
            }

            conn.close();
        });
    });
}).connect(connSettings);
~~~



# ssh2 demo

### Get a directory listing via SFTP

```js
var Client = require('ssh2').Client; // 客户端构造函数

var conn = new Client(); // 客户端实例对象

conn.on('ready', function() {
  console.log('Client :: ready');
  
  conn.sftp(function(err, sftp) {
    if (err) throw err;
    
    // readdir ： 列出目录
    sftp.readdir('foo', function(err, list) {
      if (err) throw err;
      
      console.dir(list); // List the directory in the console
      
      conn.end(); // Do not forget to close the connection, otherwise you'll get troubles

    });
  });
}).connect({
  host: '192.168.100.100',
  port: 22,
  username: 'frylock',
  password: 'nodejsrules'
});

// example output:
// Client :: ready
// [ { filename: 'test.txt',
//     longname: '-rw-r--r--    1 frylock   frylock         12 Nov 18 11:05 test.txt',
//     attrs:
//      { size: 12,
//        uid: 1000,
//        gid: 1000,
//        mode: 33188,
//        atime: 1353254750,
//        mtime: 1353254744 } },
//   { filename: 'mydir',
//     longname: 'drwxr-xr-x    2 frylock   frylock       4096 Nov 18 15:03 mydir',
//     attrs:
//      { size: 1048576,
//        uid: 1000,
//        gid: 1000,
//        mode: 16877,
//        atime: 1353269007,
//        mtime: 1353269007 } } ]
```

### 利用 ssh2-sftp-client 实现测试环境前端自动部署脚本

~~~~js
let Client = require('ssh2-sftp-client');
const path = require('path')
const glob = require('glob')
let sftp = new Client();
const localPath = path.join(__dirname, '../dist').replace(/\\/g, '/')
const remotePath = '/data/dist'
sftp.connect({
    host: '*****',
    port: 22,
    username: '*****',
    password: '*****'
}).then(() => {
    console.log('连接成功');
    console.log('删除static');
    return sftp.rmdir(`${remotePath}`, true)
}).then(async () => {
    console.log('删除static成功');
    console.log('创建static中js,css,img,fonts文件');
    await sftp.mkdir(`${remotePath}`, true)
    await sftp.mkdir(`${remotePath}/static`, true)
    await sftp.mkdir(`${remotePath}/static/css`, true)
    await sftp.mkdir(`${remotePath}/static/img`, true)
    await sftp.mkdir(`${remotePath}/static/fonts`, true)
    await sftp.mkdir(`${remotePath}/static/js`, true)
}).then(() => {
    console.log('创建static中js,css,img,fonts文件成功');

    const fileLiat = glob.sync(`${localPath}/**/*.{js,css,png,eot,woff,ttf,html}`)
    return Promise.all(
        fileLiat.map(file => {
            console.log(file);
            const remoteFile = file.replace(localPath, remotePath)
            return sftp.fastPut(file, remoteFile)
        })
    )
}).then(() => {
    console.log('成功');
    sftp.end()
}).catch((err) => {
    console.log(err.message, 'catch error');
    sftp.end()
});

// 原文链接：https://blog.csdn.net/weixin_43707525/article/details/112554352
~~~~

https://www.cnblogs.com/re-saika/p/13503887.html



# Errors

## SSH连接报错:Permission denied, please try again

https://cloud.tencent.com/developer/article/1454777



