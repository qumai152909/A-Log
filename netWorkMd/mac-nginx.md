# mac 安装 nginx

使用homebrew来安装， 终端下执行：

~~~bash
brew install nginx
~~~

如果安装的时候报错，例如openssl error， 可能是因为brew仓库访问限制的缘故，解决办法如下：

# homebrew改为国内地址

https://zhuanlan.zhihu.com/p/111014448

**苹果电脑**，在终端中复制粘贴回车下面脚本

~~~bash
/bin/zsh -c "$(curl -fsSL https://gitee.com/cunkai/HomebrewCN/raw/master/Homebrew.sh)"
~~~

**苹果电脑 卸载脚本：**

~~~bash
/bin/zsh -c "$(curl -fsSL https://gitee.com/cunkai/HomebrewCN/raw/master/HomebrewUninstall.sh)"
~~~

**常见错误**去下方[地址](https://link.zhihu.com/?target=https%3A//gitee.com/cunkai/HomebrewCN/blob/master/error.md)查看

```text
https://gitee.com/cunkai/HomebrewCN/blob/master/error.md
```

*按照上面命令，成功安装brew后，再次运行brew install nginx，即可安装nginx成功。*

# nginx常用命令

~~~bash
brew services start nginx # 启动nginx服务 成功后，使用浏览器打开http://localhost:8080 

nginx -v # 查看安装版本  nginx version: nginx/1.21.1
nginx -V    #查看版本，以及配置文件地址

nginx -t   # 检测 nginx 的默认配置文件语法是否正确，并进行测试，最后输出结果

---------------------------

nginx 	 #启动nginx

nginx -s quit     # 安全关闭
nginx -s stop   # 快速停止

nginx -s reload    #重新加载配置

nginx -s reopen # 重启

nginx -h #帮助

brew uninstall nginx # 卸载nginx
~~~

1，nginx -t 运行结果：

~~~bash
nginx: the configuration file /usr/local/etc/nginx/nginx.conf syntax is ok
nginx: configuration file /usr/local/etc/nginx/nginx.conf test is successful
~~~

2， nginx -h 运行结果：

~~~bash
nginx version: nginx/1.21.1
Usage: nginx [-?hvVtTq] [-s signal] [-p prefix]
             [-e filename] [-c filename] [-g directives]

Options:
  -?,-h         : this help
  -v            : show version and exit
  -V            : show version and configure options then exit
  -t            : test configuration and exit
  -T            : test configuration, dump it and exit
  -q            : suppress non-error messages during configuration testing
  -s signal     : send signal to a master process: stop, quit, reopen, reload
  -p prefix     : set prefix path (default: /usr/local/Cellar/nginx/1.21.1/)
  -e filename   : set error log file (default: /usr/local/var/log/nginx/error.log)
  -c filename   : set configuration file (default: /usr/local/etc/nginx/nginx.conf)
  -g directives : set global directives out of configuration file
~~~

-c filename： 指出了nginx默认配置文件的地址

# nginx目录

**nginx安装文件目录** ：		/usr/local/Cellar/nginx

**nginx配置文件目录**： 		/usr/local/etc/nginx

**config默认配置文件**：   /usr/local/etc/nginx/nginx.conf

**系统hosts位置**：  		/private/etc/hosts

# 自定义配置-代理-proxy_pass

+ 1, 修改默认配置文件:  /usr/local/etc/nginx/nginx.conf

  将默认的所有server字段都注释掉；

  将底部的include servers/* 修改为 include servers/extra.conf;

  结果如下

  ~~~nginx
  #user  nobody;
  worker_processes  1;
  
  #error_log  logs/error.log;
  #error_log  logs/error.log  notice;
  #error_log  logs/error.log  info;
  #pid        logs/nginx.pid;
  events {
      worker_connections  1024;
  }
  http {
      include       mime.types;
      default_type  application/octet-stream;
  
      #log_format  main  '$remote_addr - $remote_user [$time_local] "$request" '
      #                  '$status $body_bytes_sent "$http_referer" '
      #                  '"$http_user_agent" "$http_x_forwarded_for"';
  
      #access_log  logs/access.log  main;
  
      sendfile        on;
      #tcp_nopush     on;
  
      #keepalive_timeout  0;
      keepalive_timeout  65;
  
      #gzip  on;
  
      # another virtual host using mix of IP-, name-, and port-based configuration
      #
      #server {
      #    listen       8000;
      #    listen       somename:8080;
      #    server_name  somename  alias  another.alias;
  
      #    location / {
      #        root   html;
      #        index  index.html index.htm;
      #    }
      #}
  
      # HTTPS server
      #
      #server {
      #    listen       443 ssl;
      #    server_name  localhost;
  
      #    ssl_certificate      cert.pem;
      #    ssl_certificate_key  cert.key;
  
      #    ssl_session_cache    shared:SSL:1m;
      #    ssl_session_timeout  5m;
  
      #    ssl_ciphers  HIGH:!aNULL:!MD5;
      #    ssl_prefer_server_ciphers  on;
  
      #    location / {
      #        root   html;
      #        index  index.html index.htm;
      #    }
      #}
      include servers/extra.conf;
  }
  ~~~

+ 2, 新建自定义配置文件：

  在/usr/local/etc/nginx/servers目录下，运行命令

  新建文件extra.conf：

  ~~~bash
  touch extra.conf
  ~~~

  编辑extra.conf内容：

  ~~~bash
  vim extra.conf
  ~~~

  内容如下：

  ~~~nginx
  server {
    listen       8088;
    server_name  localhost;
    root         html/build/;
  
    #access_log               /webApp/access.log main;
    #error_log                /webApp/error.log warn;
  
  
  	location /coupon/getMemberShipCouponsAtXview/ {
          	proxy_pass  https://rsp.jd.com;
  	}
  
  	location /api/ {
  		proxy_pass https://www.baidu.com/;
  	}
  
    location / {
      index index.html index.htm;
      try_files $uri $uri/ /redirect.html?$query_string;
    }
  
    #error_page 404 /404.html;
  }
  ~~~

  **nginx默认跟目录是html，完整地址是/usr/local/var/www/html**



# 实践1: plus会员的xview项目，需要跨域

## 需求： 

plus会员的xview项目，本地连调的时候，接口需要跨域。但是jdp部署命令不支持里面的域名跨域。

项目线上情况：

~~~text
https://h5.m.jd.com/babelDiy/Zeus/Wmy44GUqYUh5mGjKgX6wytn1w9x/index.html  # xview 弹窗页面

	访问接口： https://rsp.jd.com/coupon/getMemberShipCouponsAtXview/v1?lt=m&an=plus.mobile&_=1627209311014 引起跨域
~~~

**接口需要cookie来作为入参**，出参如下：

~~~json
{"code":"1000","msg":"成功","displayMsg":null,"rs":{"MembershipActivityDto":{"resultCode":"9003","pin":"syy150909","qybid":null,"discount":0,"cheapestAmount":0,"ordinaryBgPic":null,"ordinaryBtnPic":null,"expensiveBgPic":null,"expensiveBtnPic":null,"ordinaryJumpUrl":null,"expensiveJumpUrl":null}}}
~~~

并且可以查看到，**cookie大部分写在.jd.com域名**下。

## 跨域方法：

​				1， webpack-dev-server ： 通过代理字段来进行接口跨域 ；（*不可行，因为webpack-dev-server在jdp框架里面封装了*）

​				2，nginx通过配置代理 （可行）

## 安装

需要安装： nginx 、 switchhost

## 技术方案

1，修改xview项目(plus-xview-coupon)中的**src/js/api/index.js**文件：

​		修改为： *const apiEnvironment = 2;*

2，在xview项目(plus-xview-coupon)下执行打包命令： jdp p dev

​		会在项目跟目录生成一个build文件夹，里面是打包好的html、js、css、image等所有静态资源

3，修改nginx自定义配置文件extra.conf：

​	 将跟目录（root），修改为步骤2中的build文件夹；

​	 为接口请求/coupon/getMemberShipCouponsAtXview/v1，配置代理；

4，自定host

​	通过步骤三，可以访问到链接和接口，但是接口返回的json数据是：“用户未登录”；

​	这是因为登录京东时，cookie写到域名.jd.com下。域名不同，cookie是隔离的。

​	解决办法：**通过配置host，将host自定义为xxxxxx.jd.com， 来读取cookie**

## 实际实现

+ 通过技术方案1，2，生成了build文件夹，结构和地址如下

  绝对地址：/Users/sunyingying23/PlusCodes/plus-source/plus-xview-coupon/build

  ~~~
  build/
  	  index.html
  		plus-xview-coupon/
  				20191224/
  							css/
  									index.css
  							img/
  									bg-btn-close.png
  							js/
  								  common.js
  							  	index.js
  ~~~

+ 修改nginx自定义配置文件extra.conf

  ~~~nginx
  server {
    listen       8088;
    server_name  localhost;
    #root         html/build/;
  
  	root 	/Users/sunyingying23/PlusCodes/plus-source/plus-xview-coupon/build/;
  
  
    #access_log               /webApp/access.log main;
    #error_log                /webApp/error.log warn;
  
  
  	location /coupon/getMemberShipCouponsAtXview/ {
          	proxy_pass  https://rsp.jd.com;
  	}
  
  
    location / {
      index index.html index.htm;
      try_files $uri $uri/ /index.html?$query_string;
    }
  
    #error_page 404 /404.html;
  }
  ~~~

+ 配置host：

  启动nginx，此时访问http://localhost:8088/, 可以正确访问到build/index.html文件，

  **但是，接口**（ http://localhost:8088/coupon/getMemberShipCouponsAtXview/v1?lt=m&an=plus.mobile&_=1627223416144）**返回json：一直是未登录：**{"code":"F10002","msg":"用户未登录"}

  

  即使我们已经通过https://m.jd.com/，登录过账号了，上面接口仍然返回未登录的数据。

  *这是因为，登录时，用户pin等数据，写在了.jd.com域名下，而我们访问的域名是localhost，因为cookie的隔离*，接口访问不到cookie中的pin，所以一直是未登录数据。

  ***

  解决方法，配置switchhost如下：

  **127.0.0.1 xview.m.jd.com**

  此时，访问链接：http://xview.m.jd.com:8088/

  可以看到接口正确返回数据：

  ~~~json
  {"code":"1000","msg":"成功","displayMsg":null,"rs":{"MembershipActivityDto":{"resultCode":"9003","pin":"syy150909","qybid":null,"discount":0,"cheapestAmount":0,"ordinaryBgPic":null,"ordinaryBtnPic":null,"expensiveBgPic":null,"expensiveBtnPic":null,"ordinaryJumpUrl":null,"expensiveJumpUrl":null}}}
  ~~~

  

# 参考

Homebrew国内如何自动安装（国内地址） https://zhuanlan.zhihu.com/p/111014448

使用 Nginx 代理解决前端开发的跨域问题.  https://juejin.cn/post/6862180797005332493

 mac下nginx的安装和配置 	https://www.jianshu.com/p/026d67cc6cb1



              初步介绍几个brew命令
本地软件库列表：brew ls
查找软件：brew search google（其中google替换为要查找的关键字）
查看brew版本：brew -v  更新brew版本：brew update
安装cask软件：brew install --cask firefox 把firefox换成你要安装的
