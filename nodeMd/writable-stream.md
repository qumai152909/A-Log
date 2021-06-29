# 可写流简介

可写流是对数据要被写入的目的地的一种抽象。

可写流的例子包括：

- [客户端的 HTTP 请求](http://nodejs.cn/api/http.html#http_class_http_clientrequest)
- [服务器的 HTTP 响应](http://nodejs.cn/api/http.html#http_class_http_serverresponse)
- [fs 的写入流](http://nodejs.cn/api/fs.html#fs_class_fs_writestream)
- [zlib 流](http://nodejs.cn/api/zlib.html)
- [crypto 流](http://nodejs.cn/api/crypto.html)
- [TCP socket](http://nodejs.cn/api/net.html#net_class_net_socket)
- [子进程 stdin](http://nodejs.cn/api/child_process.html#child_process_subprocess_stdin)
- [`process.stdout`](http://nodejs.cn/api/process.html#process_process_stdout)、[`process.stderr`](http://nodejs.cn/api/process.html#process_process_stderr)

所有可写流都实现了 `stream.Writable` 类定义的接口。



# writable.write()

**写入数据到流**

语法：

~~~
writable.write(chunk[, encoding][, callback])
~~~

参数： 

​	chunk： 要写入的数据；类型：any、Buffer、string

​	encoding: 制定编码方式；如果 `chunk` 是字符串，则指定字符编码。**默认值:** `'utf8'`

​	callback： 回调函数，当数据块被输出到目标后的回调函数











