process: 用于描述当前 Node.js 进程状态的对象，提供了一个与操作系统的简单接口。

https://zhuanlan.zhihu.com/p/91541043

# process.argv

process.argv : 返回一个数组:

 第一个元素为解释器的绝对路径；

第二个元素为当前执行的文件路径；

剩余的元素为其他命令行参数。

```js
node index.js 1991 name=chenfangxu --v "lalla"

[ '/usr/local/Cellar/node/7.9.0/bin/node',
  '/Users/cfangxu/project/demo/myNEapp/site/index.js',
  '1991',
  'name=chenfangxu',
  '--v',
  'lalla' ]
```

# process.nextTick(callback) 

异步任务，



# process.stdin.pause() end ()

```bash
process.stdin.end();
process.stdin.pause(); // readable.pause()
```

**process.stdin.end()方法**

不会主动结束；如果输入了结束字符，才会结束。在Mac上，结束字符操作是： CTRL + C 或者CTRL + D；

[Readable Streams](https://nodejs.org/api/stream.html#stream_class_stream_readable)在触发`"end"`事件之前，期望EOT(传输结束)字符。在bash中，可以使用CTRL + D来完成。

**readable.pause()**

`readable.pause()` 方法使流动模式的流停止触发 [`'data'`](http://nodejs.cn/api/stream.html#stream_event_data) 事件；并切换出流动模式。

碰到此方法，在bash中，会直接退出输入模式；

如果存在 `'readable'` 事件监听器，则 `readable.pause()` 方法不起作用。

*相反方法是：`readable.resume()` 方法*： 将被暂停的可读流恢复触发 [`'data'`](http://nodejs.cn/api/stream.html#stream_event_data) 事件，并将流切换到流动模式。

http://nodejs.cn/api/stream.html#stream_readable_pause

# process.chdir()

切换工作目录到指定目录。

# process.cwd()

- 返回运行当前脚本的工作目录的路径。



# process.exit([code])

退出当前进程。

如果未提供code ，此 exit 方法要么使用'success' 状态码 0，要么使用 process.exitCode 属性值，前提是此属性已被设置。 Node.js 在所有['exit']事件监听器都被调用了以后，才会终止进程。



# process.stdout

`process.stdout`属性返回一个对象，表示标准输出;

下面代码表示, 将一个文件内容输出。

```js
const fs = require('fs');

const readerStream = fs.createReadStream('./bin/wow.txt'); // // 创建可读流

readerStream.setEncoding('UTF8'); // 设置编码为 utf8。

readerStream.pipe(process.stdout);
```



通过`pipe`方法，先将文件数据压缩，然后再导向标准输出:

```js
var fs = require('fs');
var zlib = require('zlib');

fs.createReadStream('wow.txt')
  .pipe(zlib.createGzip())
  .pipe(process.stdout);
```



# pipe

**管道： 管道提供了一个输出流到输入流的机制。通常我们用于从一个流中获取数据并将数据传递到另外一个流中。**

创建 main.js 文件, 代码如下：

```js
var fs = require("fs");

// 创建一个可读流
var readerStream = fs.createReadStream('input.txt');

// 创建一个可写流
var writerStream = fs.createWriteStream('output.txt');

// 管道读写操作
// 读取 input.txt 文件内容，并将内容写入到 output.txt 文件中
readerStream.pipe(writerStream); // readable.pipe() 方法绑定可写流到可读流

console.log("程序执行完毕");
```





# process.stdout.write

**和console.log()类似**

`console.log()` calls `process.stdout.write` with formatted output. 

See `format()` in console.js for the implementation.

Currently (v0.10.ish):

```js
Console.prototype.log = function() {
  this._stdout.write(util.format.apply(this, arguments) + '\n');
};
```



# process.stdin

**返回一个指向 标准输入流(stdin) 的可读流(Readable Stream)。**

For details of how to read from `stdin` see [`readable.read()`](https://nodejs.org/api/stream.html#stream_readable_read_size).

## demo1

https://www.cnblogs.com/vajoy/p/4783390.html

~~~js
process.stdin.on('end', function() {
    process.stdout.write('end');
});



function gets() {
  process.stdin.setEncoding('utf8');
  
  process.stdin.on('data', function(chunk) {
    console.log('start!');
    
    // 去掉下一行可一直监听输入，即保持标准输入流为开启模式
    process.stdin.pause();
    
    console.log(`---: ${chunk}`);
    //process.stdin.emit('end'); //触发end事件
  });
  
  console.log('试着在键盘敲几个字然后按回车吧');
}

module.exports = gets;

~~~





## Demo2

https://www.huaweicloud.com/articles/12640703.html : node之process.stdout和process.stdin实现控制台登录

1 ,定义用户： let users={ "admin":"123", "user1":"321", "user2":"213" };  

2, 设置用户名变量存储输入的用户名，以判断是进行用户名输入还是密码输入，初始值为空： let username="";   

3, 进入逻辑判断，如果用户名为空，判断输入的用户名是否存在于用户中，如果不存在，重置....

~~~js
// 定义用户
let users = {
  "admin": "123",
  "user1": "321",
  "user2": "213"
};

// 设置用户名变量,存储输入的用户名
let username = "";

process.stdout.write("请输入用户名:");

process.stdin.on('data', (input) => {
	input = input.toString().trim(); // 用户在控制台的输入
	if(!username) {
		if(Object.keys(users).indexOf(input) === -1) { 
      process.stdout.write('用户名不存在'+'\n'); 
      process.stdout.write("请重新输入用户名:"); 
      username = "";
		} else { 
      process.stdout.write("请输入密码:"); 
      username = input;
		}
	} else { //输入密码
		if(input === users[username]) { 
      console.log("登陆成功");
		} else { 
      process.stdout.write("请重新输入密码"+"\n");
		} 
  }
});

~~~





























