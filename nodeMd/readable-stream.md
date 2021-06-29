

https://zhuanlan.zhihu.com/p/91541043

http://nodejs.cn/api/stream.html#stream_stream

# nodejs流简介

为什么要有流这种形态存在,估计大家应该都清楚,在linux中能用流解决的事情是不会使用别的方法.

为什么?

**因为流的效率高并且占用内存小.**

相信没有人会直接去`cat|less`一个2/3GB的日志文件(敢这么做,信不信分分钟钟爆掉你的内存卡), *而是会采用`|`管道来做出一个流,然后在流中查看我们想要的信息.*

Nodejs的流也是这么一个目的, 在有限的内存中实现我们操作"海量"数据的目标.



# 流的4个类型

在当前的nodejs文档中，介绍的流主要分4种：readable,	writable,	transform,	duplex。



- readable:  可以读取数据的流	(比如fs.createReadStream)
- writable:   可以写入数据的流     (比如fs.createWriteStream)
- duplex:     可以读写数据的流     (比如net.Socket)
- transform： 是双工流的一种特殊模式,  与duplex的区别在于它可以对数据进行加工.(比如zlib streams/crypto streams)

# [Readable](https://nodejs.org/api/stream.html#stream_readable_streams) stream

https://nodejs.org/api/stream.html#stream_readable_streams

https://www.runoob.com/nodejs/nodejs-stream.html

***

Examples of `Readable` streams include:

- [HTTP responses, on the client](https://nodejs.org/api/http.html#http_class_http_incomingmessage)
- [HTTP requests, on the server](https://nodejs.org/api/http.html#http_class_http_incomingmessage)
- [fs read streams](https://nodejs.org/api/fs.html#fs_class_fs_readstream)
- [zlib streams](https://nodejs.org/api/zlib.html)
- [crypto streams](https://nodejs.org/api/crypto.html)
- [TCP sockets](https://nodejs.org/api/net.html#net_class_net_socket)
- [child process stdout and stderr](https://nodejs.org/api/child_process.html#child_process_subprocess_stdout)🍓🍓🍓🍓 （ ）
- [`process.stdin`](https://nodejs.org/api/process.html#process_process_stdin) 🍓🍓🍓



***



```js
const readable = getReadableStreamSomehow();
readable.on('data', (chunk) => {
  console.log(`Received ${chunk.length} bytes of data.`);
});
readable.on('end', () => {
  console.log('There will be no more data.');
});
```



# 消费流数据

Node提供了多种方法来消费流数据。 

开发者通常应该选择其中一种方法来消费数据，不要在单个流使用多种方法来消费数据。 混合使用 `on('data')`、`on('readable')`、`pipe()` 或异步迭代器，会导致不明确的行为。



# readable.on('data', cb)事件

data事件： 当流将数据块传送给消费者后触发。

```js
const readable = getReadableStreamSomehow();

readable.on('data', (chunk) => {
  console.log(`接收到 ${chunk.length} 个字节的数据`);
});
```

- `chunk` ： Buffer 、 string、 any类型的数据块。 对于非对象模式的流， `chunk` 可以是字符串或 `Buffer`。 对于对象模式的流，`chunk` 可以是任何 JavaScript 值，除了 `null`。

如果使用 `readable.setEncoding()` 为流指定了默认的字符编码，则回调传入的数据为字符串，否则传入的数据为 `Buffer`。



# readable.pipe()

语法： 

~~~js
readable.pipe(destination[, options])
~~~

参数：

​	destination： <stream.Writable>数据写入的目标;

​	options: 		管道选项

返回值：

​	返回<stream.Writable>目标可写流；

**`readable.pipe()` 方法绑定可写流到可读流， 并将可读流的所有数据推送到绑定的可写流**



#### demo: 将可读流的所有数据通过管道推送到 `file.txt` 文件：

```js
const fs = require('fs');

const readable = getReadableStreamSomehow();

const writable = fs.createWriteStream('file.txt');

readable.pipe(writable); // readable 的所有数据都推送到 'file.txt'。
```

#### demo: 会返回目标流的引用，这样就可以对流进行链式地管道操作

```js
const fs = require('fs');
const r = fs.createReadStream('file.txt');
const z = zlib.createGzip();
const w = fs.createWriteStream('file.txt.gz');

r.pipe(z).pipe(w); // 可以在单个可读流上绑定多个可写流。
```



# raadavle.read()

http://nodejs.cn/api/stream.html#stream_event_end



