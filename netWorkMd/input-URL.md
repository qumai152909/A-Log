浏览器输入 URL 后发生了什么？

# 全过程简要概述1
1，当我们将网址输入到浏览器后，第一件事就是解析 url， 将域名与实际的文件路径分离，得到域名，

2，通过 缓存、本地host或者DNS 解析 获取到该域名的 ip 地址：

	>首先浏览器会查询浏览器缓存，如果浏览器缓存有这个网址，就可以直接获取到 域名对应的IP；
	>
	>如果没有就进一步访问本机缓存，如果本机缓存也没有才会发起 DNS 请求。
	>
	>（本机host文件，什么时候访问？？？）

3， 得到 ip 后，根据协议、ip、端口号、资源路径、请求参数等，浏览器会先与服务器通过 TCP 三次握手建立连接，然后构建并发送 HTTP 请求：

>当需要发送 HTTP 请求的时候，同样也不是直接就发送到服务器了???  不是的：
>
>需要发送到浏览器缓存。
>
>浏览器中的缓存分为强缓存和协商缓存，浏览器发起 HTTP 请求时首先会根据 http 头信息来判断是存有强缓存，以及其是否过期，如果有强缓存且未过期则命中，不会发送请求到服务器了。如果强缓存没命中，则会向服务器发起请求，这个请求的 Header 头中会带有浏览器最后一次请求该资源的时间和一个资源校验码(使用资源修改时间、资源大小等信息生成)，服务器收到这个请求后会判断协商缓存是否过期，如果过期则返回新的资源信息，如果没过期则返回 304 状态码，表示资源未更新，可以使用缓存中的资源。

4，最后是页面渲染；

作者：weak chicken
链接：https://leetcode-cn.com/circle/discuss/UrcaDQ/
来源：力扣（LeetCode）





# 概述2

https://zhuanlan.zhihu.com/p/43369093















