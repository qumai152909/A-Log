https://www.cloudflare.com/zh-cn/learning/dns/what-is-dns/ ： what is dns 🍓🍓🍓

https://www.huaweicloud.com/articles/70afe10f7ecb46838e391ff0a6d417f7.html

ISP: 互联网服务供应商



DNS（Domain Name System，域名系统）

# 主机名到IP的[映射](http://baike.baidu.com/view/21249.htm)有2种方式

1）静态映射，每台设备上都配置主机到IP地址的映射，各设备独立维护自己的**映射表**，而且只供本设备使用；

2）动态映射，建立一套域名解析系统（DNS），只在专门的**DNS服务器**上配置主机到IP地址的映射，网络上需要使用主机名通信的设备，首先需要到DNS服务器查询主机所对应的[IP地址](http://baike.baidu.com/view/3930.htm)。

# 域名解析

通过[主机名](http://baike.baidu.com/view/1617349.htm)，最终得到该主机名对应的IP地址的过程叫做域名解析（或主机名解析）。

在解析域名时，可以首先采用静态域名解析的方法，如果[静态](http://baike.baidu.com/view/612026.htm)域名解析不成功，再采用动态域名解析的方法。可以将一些常用的域名放入静态域名解析表中，这样可以大大提高域名解析效率。

# what is DNS ?

DNS 可使用户使用域名而不是 IP 地址连接到网站。 



# DNS 缓存

**浏览器如何通过域名去查询URL对应的IP（对应服务器地址）呢？**

​		1、浏览器缓存

　　2、操作系统缓存

　　3、路由缓存

　　4、ISP的DNS服务器

　　5、根服务器

# ISP缓存

1、ISP缓存，本身是一种宽带接入提供商给网页批量访问加速的技术。ISP会将当前访问量较大的网页内容放到ISP服务器的缓存中，当有新的用户请求相同内容时，可以直接从缓存中发送相关信息，不必每次都去访问真正的网站，从而加快了不同用户对相同内容的访问速度，同时也能节省网间流量结算成本。


2、ISP缓存主要以缓存静态页面为主，比如新浪的新闻页。

3、 如果ISP的缓存中的网页带有用户SESSIONID信息，就可能发生登录串号现象。当用户A登录时服务端返回页面内容被ISP缓存，这时同网络的用户B访问该网站，直接取得了刚才ISP缓存的信息，而该缓存信息中包含有用户A的SESSIONID（此时用户A还未退出），这样用户B处就显示出了A的信息。

# 4 个 DNS 服务器

- **[DNS 解析器](https://www.cloudflare.com/learning/dns/dns-server-types#recursive-resolver)** 
- **根域名服务器** 
- **[TLD 域名服务器](https://www.cloudflare.com/learning/dns/dns-server-types#tld-nameserver)** 
- **[权威性域名服务器](https://www.cloudflare.com/learning/dns/dns-server-types#authoritative-nameserver)** 



