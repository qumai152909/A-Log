SLB（服务器负载均衡）

Nginx系列教程（三）| 一文带你读懂Nginx的负载均衡 https://mp.weixin.qq.com/s?__biz=MzAwMjg1NjY3Nw==&mid=2247488847&idx=1&sn=b97ab2bc6880c6136d924224b791b792&scene=21#wechat_redirect

# 定义



# 各种IP地址

*对客户端看到的而言，RS（real server 实际服务器）的IP地址即是绑定负载均衡设备的虚拟IP地址（VIP），真正的RS服务器IP地址对于客户端是不可见的。*

+ RS ip： 实际服务器的ip地址（也就是实际提供数据的服务器地址）
+ DIP： 负载均衡设备的ip地址
+ VIP： 虚拟服务地址（Virtual IP）
+ CIP： client ip， 客户端的地址





# 负载均衡设备

`负载均衡设备`也常被称为"`四到七层交换机`"



# 虚拟IP

VIP虽然名字上叫虚拟IP，却是实打实存在的一个IP，**这个VIP同时绑定在负载均衡设备上和提供服务的Real Server上**，但只有负载均衡设备响应这个vip的arp请求，RS接受处理该ip的报文，并不影响arp，这样就不会完成ip冲突。

当用户的请求来到时，交换机会发起arp，负载均衡器响应arp，则交换机记录该ip是属于负载均衡器的，把该ip的报文都交给负载均衡器处理，负载均衡器根据转发规则将报文转给实际的业务real server。

(也就是说客户端和虚拟ip通信；负载均衡器和RS通信 )
链接：https://www.zhihu.com/question/67682565/answer/255631744

***

虚拟IP和负载均衡：

我们知道一般的IP地址是和物理网卡绑定的，而VIP相反，是不与实际网卡绑定的的IP地址。

当外网的上的一个机器，通过域名访问某公司内网资源时，内网的DNS服务器会把域名解析到一个VIP上。

当外网主机得到这个VIP后，就将数据包发往这个VIP。但是在内网中，这个VIP是不与具体的设备相连接的，所以外网发过来数据包，究竟会到哪台机器（RS）呢？

其实，这个在内网的过程是，通过ARP协议来完成的。也就是说这个VIP可以映射到的MAC地址是可以控制的。

**VIP在内网中被动态的映射到不同的MAC地址上，也就是映射到不同的机器设备上（RS），那么就可以起到负载均衡的效果啦。**

>PS:VIP的概念的是LVS中一个概念，具体学习《Linux负载均衡软件LVS之概念篇》http://blog.csdn.net/wangjianno2/article/details/21291209
>
>原文地址：http://www.voidcn.com/article/p-rvygijjc-bhh.html



## arp：地址解析协议

是根据IP地址获取物理地址的一个TCP/IP协议。

# 负载均衡的三种传输模式

 一文详解负载均衡和反向代理的真实区别 https://mp.weixin.qq.com/s/TYM83F2O-keMvn4ZYa5nqw

在负载均衡设备中，SLB主要工作在以下的三种传输模式中：

- 反向代理模式
- 透传模式
- 三角模式



# 负载均衡分层

https://developer.aliyun.com/article/507416?spm=a2c6h.17698244.wenzhang.5.134211daJd9MbX





## 四层和七层负载均衡的区别

https://developer.aliyun.com/article/62902?spm=a2c6h.14164896.0.0.104a741b6m0kZz



### 第一，技术原理上的区别。



四层负载均衡： TCP的连接建立，即三次握手是客户端和后端服务器直接建立的

七层负载均衡：负载均衡和前端的客户端、以及后端的服务器，会分别建立TCP连接（2个三次握手）

### 第二，应用场景的需求



# Nginx负载均衡的作用

- `转发功能`：Nginx 会按照一定的算法轮询、权重将客户端发来的请求转发至不同的应用服务器上，同时减轻单台服务器的压力，提高服务器的并发量；
- `故障迁移`：当一台服务器出现了故障时，客户端发来的请求将自动发送到其他服务器；
- `添加恢复`：当故障服务器恢复正常工作时，将自动添加到处理用户请求中；









https://zhuanlan.zhihu.com/p/56299238