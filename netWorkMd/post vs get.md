// https://segmentfault.com/t/javascript/questions

// https://github.com/Advanced-Frontend/Daily-Interview-Question/issues/501

# GET 与 POST 区别是什么 ?

1， w3school 给出的标准答案    
2， 从 HTTP 是什么开始，深入 GET 与 POST 请求方法，即两者的本质区别
3， 常见的 GET 与 POST 误解
        POST 方法比 GET 方法安全？
        POST 方法会产生两个 TCP 数据包？

## 全部区别
|                  | GET                                                          | POST                                                         |
| ---------------- | ------------------------------------------------------------ | ------------------------------------------------------------ |
| 安全性           | 与 POST 相比，GET 的安全性较差，因为所发送的数据是 URL 的一部分。 | POST 比 GET 更安全，因为参数不会被保存在浏览器历史或 web 服务器日志中 |
| 可见性           | 数据在 URL 中对所有人都是可见的。                            | 数据不会显示在 URL 中。                                      |
| 对数据类型的限制 | 只允许 ASCII 字符。                                          | 没有限制。也允许二进制数据。                                 |
| 对数据长度的限制 | 是的。当发送数据时，URL 的最大长度是 2048 个字符             | 无限制                                                       |
| 编码类型         | application/x-www-form-urlencoded                            | application/x-www-form-urlencoded 或 multipart/form-data     |
| 缓存             | 能被缓存                                                     | 不能缓存                                                     |
|                  |                                                              |                                                              |



## 本质区别

两点：

1， 请求报文，**起始行不同**：GET /uri HTTP/1.1  、POST /uri HTTP/1.1

2， **资源的操作方式不同**： get：请求服务器返回资源； post： 向指定的服务器资源提交数据；

3， 数据载体不同： get： 数据在 URL 中； post： 数据在请求报文的主体中；



## POST 方法比 GET 方法安全？

+ *在 HTTP 协议里*，所谓的“安全”是指：请求方法不会对服务器上的资源进行修改。get、head方法被认为是安全的，而post不是；

+ **在数据传输上，数据均不安全。**因为 HTTP 在网络上是明文传输的，想要安全传输就得加密，也就是 HTTPS。



##  POST 方法会产生两个 TCP 数据包？

大多数框架都是尽量在一个 TCP 包里面把 HTTP 请求发出去的，但是也确实存在先发 HTTP 头，然后发 body 的框架。但是具体发多少个TCP包，这个 **不是 HTTP 协议的事情是操作系统 TCP 协议栈与代码的问题，跟 HTTP 没关系**











