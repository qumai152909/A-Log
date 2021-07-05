https://developer.mozilla.org/zh-CN/docs/Learn/Common_questions/What_is_a_web_server MDN 🍓

# 服务器概述

“服务器（web server）”可以代指硬件或软件，或者是它们协同工作的整体。

1. 硬件部分，指一台计算机【一台存储了网络服务软件以及静态资源（比如，HTML文档、图片、CSS样式表和JavaScript文件）的计算机】。能接入到互联网，并且支持与其它连接到互联网的设备进行物理数据的交互。
2. 软件部分，例如HTTP服务器，【一台HTTP服务器是一种能够理解URL（网络地址）和HTTP（浏览器用来查看网页的协议）的软件】

<img src="/Users/sunyingying23/Github/A-Log/imgs/http server.png" alt="http server" style="zoom:40%;" /> 

***

根据上图：

​		**静态文件、http服务器，都是放在网络服务器上的，**

​		静态资源不是存放在http服务器上的；

​		客户端通过http服务器，访问网络服务器上存储的资源（HTML 文件、图片文件等等）。

​		

# 静态、动态的服务器

要发布一个网站，你需要一个静态或动态的服务器。

+ 静态网络服务器（**static web server**），由一个计算机（硬件）和一个 HTTP 服务器（软件）组成。我们称它为 “静态” 是因为这个服务器把它托管文件的 “保持原样” 地传送到你的浏览器。

+ 动态网络服务器（**dynamic web server**） 由一个静态的网络服务器加上额外的软件组成，最普遍的组合是一个应用服务器 [*application server*] 和一个数据库 [*database*]。我们称它为 “动态” 是因为这个应用服务器会在通过 HTTP 服务器把托管文件传送到你的浏览器之前会对这些托管文件进行更新。

  

# http服务器是什么？

*HTTP服务器本质上也是一种应用程序——它通常运行在服务器之上，绑定服务器的IP地址并监听某一个tcp端口来接收并处理HTTP请求*，这样客户端（一般来说是IE, Firefox，Chrome这样的浏览器）就能够通过HTTP协议来获取**服务器（网络服务器）**上的网页（HTML格式）、文档（PDF格式）、音频（MP4格式）、视频（MOV格式）等等资源。



+ 一般用来传递静态的页面给客户端；



# http服务器、nginx、Apache

严格的来说，Apache/Nginx 应该叫做「HTTP Server」；

实现http服务器：直接用现成的，Apache / Nginx，python -m SimpleHTTPServer

+ Nginx是一款开源的HTTP服务器软件

+ nginx作为轻量级的http服务器，能够很好地应付高并发的http请求。同时，它也能被配置为http代理服务器。
+ 一般来说，需要性能的web 服务，用nginx 。如果不需要性能只求稳定，那就apache 吧。

# Tomcat和nginx

严格的来说，Apache/Nginx 应该叫做「HTTP Server」；而 Tomcat 则是一个「Application Server」

***

Tomcat运行在JVM之上，它和HTTP服务器一样，绑定IP地址并监听TCP端口，同时还包含以下指责：

- 管理Servlet程序的生命周期
- 将URL映射到指定的Servlet进行处理
- 与Servlet程序合作处理HTTP请求——根据HTTP请求**生成HttpServletResponse**对象并传递给Servlet进行处理，将Servlet中的HttpServletResponse对象生成的内容返回给浏览器

***
虽然Tomcat也可以认为是HTTP服务器，但通常它仍然会和Nginx配合在一起使用：

- 动静态资源分离——运用Nginx的反向代理功能分发请求（接口请求）：所有动态资源的请求（请求json数据等）交给Tomcat。而静态资源的请求（例如图片、视频、CSS、JavaScript文件等）则直接由Nginx返回到浏览器，这样能大大减轻Tomcat的压力。

  >前端服务器： 仅存放前端打包后的静态资源。如果是一个访问静态资源的请求，该服务器直接返回。
  >
  >后端服务器：如果是一个动态数据的请求，该请求到达前端服务器后，通过前端服务器中Nginx的反向代理功能，请求被分发到后端服务器，后端服务器再返回对应json数据；

- 负载均衡，当业务压力增大时，可能一个Tomcat的实例不足以处理，那么这时可以启动多个Tomcat实例进行水平扩展，而Nginx的负载均衡功能，可以把请求通过算法分发到各个不同的实例进行处理





***
链接：https://www.zhihu.com/question/32212996/answer/87524617
来源：知乎

# 托管文件

严格来说，你可以在你自己的计算机上托管所有的这些文件，但是在一个*专用的网络服务器*上存储它们会方便得多，因为它

- 会一直启动和运行
- 会一直与互联网连接
- 会一直拥有一样的 IP 地址（不是所有的 [ISPs](https://developer.mozilla.org/zh-CN/docs/Glossary/ISP) 都会为家庭线提供一个固定的 IP 地址）
- 由一个第三方提供者维护

因为所有的这些原因，寻找一个优秀的托管提供者是建立你的网站的一个重要部分。

比较不同公司提供的服务并选择一个适合你的需求和预算的服务（服务的价格从免费到每月上万美金不等）。你可以在这篇文章 （[article](https://developer.mozilla.org/en-US/Learn/How_much_does_it_cost#Hosting)）中找到更多的细节。

一旦你设置好一个网络托管解决方案，你只需要去*上传你的文件到你的网络服务器* [[upload your files to your web server](https://developer.mozilla.org/en-US/docs/Learn/Common_questions/Upload_files_to_a_web_server)]。

## 如何上传你的文件到你的网络服务器？

https://developer.mozilla.org/en-US/docs/Learn/Common_questions/Upload_files_to_a_web_server

 In this article we'll discuss how to do that, using various available options such as SFTP clients, RSync and GitHub.

# 服务器端口

服务器：通过不同的端口提供不同的服务，所以一台[服务器](http://www.itsto.com/)同时可以是Web服务器，也可以是FTP[服务器](http://hpe.ihuidian.com/product/hp_server.html)，还可以是邮件服务器等。

**代理服务器常用以下端口：**

（1）HTTP协议代理服务器常用端口号：80/8080/3128/8081/9080
（2）SOCKS代理协议服务器常用端口号：1080
（3）FTP（文件传输）协议代理服务器常用端口号：21
（4）Telnet（远程登录）协议代理服务器常用端口：23

（5）SSH（安全登录）、SCP（文件传输）、端口重定向，默认的端口号为22/tcp



在默认情况下，端口80(port 80)是服务器侦听网页客户端请求的端口。

80是http协议的默认端口,而8080，一般用与webcahe；其实端口没有实际意义，只是一个接口，主要是看服务的监听端口，如果baidu的服务器监听的81端口，那么你直接输入[http://baidu.com:80](http://baidu.com/)就不行了，就要输入[http://baidu.com:81](http://baidu.com:81/)这样才能正常访问



# 本地DNS服务器？

本地DNS一般是指，你电脑上网时，IPv4或者IPv6设置中填写的那个DNS。

客户端电脑使用的DNS就是本地DNS服务器，本地DNS服务器会向权威DNS获取解析记录返回给用户，并将解析记录缓存。

本地DNS服务器一般是网络服务商提供的DNS。



















