# 参考链接

https://zhuanlan.zhihu.com/p/34943332 🌟🌟🌟🌟🌟🌟

https://mp.weixin.qq.com/s/TYM83F2O-keMvn4ZYa5nqw 🍓🍓🍓🍓🍓🍓🍓🍓🍓🍓

https://mp.weixin.qq.com/s/XoqGvYBabW8YBl9xEeNYZw

https://juejin.cn/post/6844904129987526663 安装和介绍

https://www.zhihu.com/question/20235589/answer/516923465 前端 linux

https://juejin.cn/post/6844904135951646733

https://juejin.cn/post/6917975471363719182 docker 和前端

https://blog.csdn.net/qq_31772441/article/details/108023321 docker 和前端

https://juejin.cn/post/6844904003793321998

https://www.jianshu.com/p/0c46e1df75ea

https://www.hi-linux.com/posts/53878.html  try_files

https://lanjingling.github.io/2016/03/14/nginx-access-log/ 日志

[https://nginx.org/en/docs/http/ngx_http_core_module.html#var_status](https://link.jianshu.com/?t=https%3A%2F%2Fnginx.org%2Fen%2Fdocs%2Fhttp%2Fngx_http_core_module.html%23var_status) 官网 内置变量

https://www.jianshu.com/p/38810b49bc29 locatin 匹配规则、顺序、优先级

https://ivweb.io/article.html?_id=100507 location 匹配示例 

https://my.oschina.net/u/4093217/blog/3123257 rewrite 

  [nginx 适配react-router browserRoute 路由问题](https://segmentfault.com/a/1190000020170428)

https://www.fengxianqi.com/index.php/archives/150/

https://segmentfault.com/a/1190000040041002?utm_source=sf-similar-article 常见配置实例

# 概念

“Nginx 是一款轻量级的 HTTP 服务器，采用事件驱动的、异步、非阻塞处理方式框架，这让其具有极好的 IO 性能，

时常用于服务端的**反向代理**和**负载均衡**。”

Nginx 是一款 http 服务器 （或叫web服务器）；

（nginx是一个高性能的反向代理服务器；）

>web服务器：负责处理和响应用户请求，一般也称为http服务器，如 Apache、IIS、Nginx
>
>应用服务器：存放和运行系统程序的服务器，负责处理程序中的业务逻辑，如 Tomcat、Weblogic、Jboss（现在大多数应用服务器也包含了web服务器的功能）.



启动Nginx后，其实就是在80端口启动了Socket服务进行监听http request；



# 代理

代理是在服务器和客户端之间假设的一层服务器，

代理将接收客户端的请求，并将它转发给服务器，然后将服务端的响应转发给客户端。

不管是正向代理还是反向代理，实现的都是上面的功能。



**正向代理：**

由于防火墙的原因，我们并不能直接访问谷歌，那么我们可以借助VPN来实现，这就是一个简单的正向代理的例子；

这里你能够发现，*正向代理“代理”的是客户端*，客户端是知道目标的，但目标是不知道客户端是通过VPN访问的。

正向代理对我们是透明的，对服务端是非透明的，即服务端并不知道自己收到的访问，是来自代理，还是来自真实客户端？



**反向代理：**

当我们在外网访问百度的时候，其实会进行一个转发，代理到内网去，这就是所谓的反向代理，

*即反向代理“代理”的是服务器端*，

反向代理对服务端是透明的，对我们是非透明的，即我们并不知道自己访问的是代理服务器，而服务器知道反向代理在为他服务。

🍓🍓🍓🍓🍓🍓可以实现跨域（号称是最简单的跨域方式）🍓🍓🍓🍓🍓🍓🍓

# server -基本配置

~~~nginx
server {
    listen 8443;                 # 监听的端口号
    server_name localhost;      # 监听的ip地址 配置服务名,若无特殊配置,localhost即指代宿主机的127.0.0.1
    client_max_body_size 100m;   # 定义读取客户端请求头的超时时间
    
    ssl on;
    ssl_certificate test.pem;
    ssl_certificate_key test.key;
    ssl_session_timeout 5m;
    ssl_protocols SSLv3 TLSv1.2;
    ssl_ciphers ECDHE-RSA-AES256-SHA384:AES256-SHA256:RC4:HIGH:!MD5:!aNULL:!eNULL:!NULL:!DH:!EDH:!AESGCM;
    ssl_prefer_server_ciphers on;
    
    
    location / {
        root /test-static-app;                # 静态资源目录
        index index.html index.htm;
        try_files $uri $uri/ /index.html;     # 动态解析目录，配合vue的history模式
    }
    
    location /api {
  		 proxy_pass 						https://b.test.com;			  # 设置代理服务器的协议和地址
  		 proxy_cookie_domain 		b.test.com  a.test.com;   # 修改cookie，针对request和response互相写入cookie
	  } 
}
~~~

+ 其中主要依赖proxy_pass，实现将a.test.com下的/api/x接口转发到了b.test.com下面
+ **其实这是把Nginx作为web server来处理静态资源**



# 配置文件: nginx.conf

我们的主战场：nginx.conf

很多时候，在开发、测试环境下，我们都得自己去配置Nginx，就是去配置nginx.conf。

nginx.conf是典型的分段配置文件



# 常见误区🍓

**1、无用的ACA-Header ？**

 网上很多的nginx跨域设置里面都加了跨域header设置相关的内容，比如

```javascript
add_header 'Access-Control-Allow-Origin' '*';
add_header 'Access-Control-Allow-Credentials' "true"; 
add_header 'Access-Control-Allow-Headers' 'X-Requested-With';
```

nginx反向代理的本质其实就是接口服务的转发，想想这个原理，各位看官觉得这个还有用么？

ACA(Access-Control-Allow-)系列的header本身是为了cors中做协商跨域而配置的，在这里配这个纯属多此一举。

**2、proxy_pass 域名带不带‘斜杠/’ ？ **

```javascript
location /api {
   proxy_pass https://b.test.com;
   proxy_pass https://b.test.com/;
}       
...
```

看到这个我们来想一想哈，proxy_pass的作用是转发，加了斜杠意味着所有的**/api**请求都会转发到根目录下，也就是说 **/api** 会被 **/** 替代，这个时候接口路径就变了，少了一层**/api**。

而不加斜杠的时候呢？这代表着转发到**b.test.com** 的域名下，**/api**的路径不会丢失。

针对这种情况，如果后端接口统一有了规定前缀，比如**/api**，那你这里就不要配置斜杠了。另一种情况，后端接口shit一样，没有统一前缀，这边又要区分，那就在前端所有接口都加一个统一前缀，比如**/api**，然后通过加**斜杠**来替换掉好了～



**3，nginx配置文件中的127.0.0.1**

~~~nginx
  location /domain/creative/imp/ {
    proxy_pass http://127.0.0.1:80/; 

			# 反代 IP 127.0.0.1 是 nginx 所在的主机,也就是容器内的本地IP，就是 nginx 所在容器内环境
  }


~~~



# 跨域🌟

## 反向代理-解决跨域

**Nginx的反向代理功能，解决跨域问题：**

Nginx作为反向代理服务器，就是把接口请求转发到另一个或者一些后端应用服务器上。

通过把本地一个url前缀映射到要跨域访问的web服务器上，就可以实现跨域访问。

对于浏览器来说，访问的就是同源服务器上的一个url。而Nginx通过检测url前缀，把http请求转发到后面真实的物理服务器。并通过rewrite命令把前缀再去掉。这样真实的服务器就可以正确处理请求，并且浏览器并不知道这个请求是来自代理服务器的。

~~~http
server { 
        location / { 
            root   html; 
            index  index.html index.htm; 
            //允许cros跨域访问 
            add_header 'Access-Control-Allow-Origin' '*'; 
 
        } 
        //自定义本地路径 
        location /apis { 
            rewrite  ^.+apis/?(.*)$ /$1 break; 
            include  uwsgi_params; 
            proxy_pass   http://www.binghe.com; 
       } 
} 
~~~





***



## CORS 解决跨域（需要删除此处）

（CORS跨域：需要在服务器端设置header：Access-Control-Allow-Origin）

只需要在Nginx的配置文件中配置以下参数：

```http
location / {  
    add_header Access-Control-Allow-Origin *;  // 接受所有跨域的请求。
    
    add_header Access-Control-Allow-Origin $http_origin;
    
    add_header Access-Control-Allow-Credentials true; 
    add_header Access-Control-Allow-Methods 'GET, POST, OPTIONS';
    add_header Access-Control-Allow-Headers 'DNT,X-Mx-ReqToken,Keep-Alive,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,Authorization';

    if ($request_method = 'OPTIONS') {
        return 204;
    }
} 
```

 1, Access-Control-Allow-Origin: 该字段是必须的。它的值要么是请求报文中`Origin`字段的值，要么是一个`*`，表示接受任意域名的请求。

2，Access-Control-Allow-Credentials = true;  可选。它的值是一个布尔值，表示是否允许发送Cookie。

​		默认情况下，Cookie不包括在CORS请求之中。

​		设为`true`，即表示Cookie可以包含在请求中，一起发给服务器。

   **同时，发送时，必须设置XMLHttpRequest.withCredentials为true， cookie跨域发送才有效**

3，withCredentials： 上面说到，CORS请求默认不发送Cookie。

​	**如果要把Cookie发到服务器，一方面要服务器同意，指定`Access-Control-Allow-Credentials`字段为true；另一方面，开发者必须在AJAX请求中打开`withCredentials`属性**

​	否则，即使服务器同意发送Cookie，浏览器也不会发送。

```javascript
var xhr = new XMLHttpRequest();
xhr.withCredentials = true;
```

**注意**，如果要发送Cookie，`Access-Control-Allow-Origin`就不能设为星号，必须指定明确的、与请求网页一致的域名。

同时，Cookie依然遵循同源政策，只有用服务器域名设置的Cookie才会上传，其他域名的Cookie并不会上传，且（跨源）原网页代码中的`document.cookie`也无法读取服务器域名下的Cookie。



# Master-Worker模式

启动Nginx后，其实就是在80端口启动了Socket服务进行监听，监听http request，如图所示，Nginx涉及Master进程和Worker进程。

https://zhuanlan.zhihu.com/p/34943332

# 文件路径

经常要用到的几个文件路径：

1. `/usr/local/etc/nginx/nginx.conf` （nginx配置文件路径）
2. `/usr/local/var/www` （nginx服务器默认的根目录）
3. `/usr/local/Cellar/nginx/1.17.9` （nginx的安装路径）
4. `/usr/local/var/log/nginx/error.log` (nginx默认的日志路径)





# 内置变量

内置变量，nginx 各个模块都**将请求的一些参数进行变量化**，通过 `$ + 变量名` 即可使用。每个模块或多或少都有自己的变量。着重介绍下核心模块的 [内置变量](http://nginx.org/en/docs/http/ngx_http_core_module.html#variables)：

```nginx
# 通过arg_<name>的方式可取出相关参数，若请求 /foo?name=Tony&age=2，则 arg_name=tony arg_age=2
$arg_name
$args

# 客户端IP地址
$remote_addr

# 客户端端口
$remote_port

# 使用 Basic auth 的用户名
$remote_user

# 完整的请求行
$request

# 响应状态
$status

# 发送到客户端的字节数，不包括响应头
$body_bytes_sent

# 通用日志格式的本地时间
$time_local

# 连接序列号
$connection

# 用户代理
$http_user_agent

# 优先级：请求行中的 host name，请求头中的 Host，请求匹配的 server name
$host

# host name
$hostname

# 若请求 /foo?a=1&b=2，则 uri=/foo
$uri

```

# include

目的： 优化nginx配置文件。

（主配置文件nginx.conf中，用include指定包含其他*扩展配置文件*，从而简化nginx主配置文件，实现多个站点功能）

如果我们用nginx搭建好虚拟主机，虚拟主机太多（*每一个 server 配置对应这一个虚拟主机*），我们不能把所有配置放置在nginx.conf中吧？那样这个配置文件就太大了，看起来很乱，所有这时就产生了include参数；

nginx的主配置文件为nginx.conf；

~~~nginx
#include实战例子：

worker_processes  1;
events {
    worker_connections  1024;
}

http {
    include       mime.types;
    default_type  application/octet-stream;
    sendfile        on;
    keepalive_timeout  65;
  
    include extra/www.conf;
    include extra/bbs.conf;
    include extra/blog.conf;

}
# 或者上面三句话用一句话代替： include extra/*.conf; 或 include extra/*;

~~~



# server_name

server_name指令主要用于配置基于域名的虚拟主机；





# location

[location](http://nginx.org/en/docs/http/ngx_http_core_module.html#location) 是用来干嘛的，它是用来根据 URI 进行配置设置的，如：

```nginx
server {
    listen 80;
    server_name example.com;

    location / { # 普通请求网页
        root /usr/share/nginx/html;
        index index.html index.htm;
    }

    location /api { # API请求代理
        proxy_pass http://dynamic;
        health_check;
    }
}

```

## 匹配规则

Location 匹配的目标是path， 也就是window.location.pathname

例如： https://ivweb.io/article.html?id=100507	则pathname = /article.html

~~~nginx
location  = / {
  # 精确匹配 / ，主机名后面不能带任何字符串
  [ configuration A ]
}
location  / {
  # 因为所有的地址都以 / 开头，所以这条规则将匹配到所有请求
  # 但是正则和最长字符串会优先匹配
  [ configuration B ]
}
location /documents/ {
  # 匹配任何以 /documents/ 开头的地址，匹配符合以后，还要继续往下搜索
  # 只有后面的正则表达式没有匹配到时，这一条才会采用这一条
  [ configuration C ]
}
location ~ /documents/Abc {
  # 匹配任何以 /documents/Abc 开头的地址，匹配符合以后，还要继续往下搜索
  # 只有后面的正则表达式没有匹配到时，这一条才会采用这一条
  [ configuration CC ]
}
location ^~ /images/ {
  # 匹配任何以 /images/ 开头的地址，匹配符合以后，停止往下搜索正则，采用这一条。
  [ configuration D ]
}
location ~* \.(gif|jpg|jpeg)$ {
  # 匹配所有以 gif,jpg或jpeg 结尾的请求
  # 然而，所有请求 /images/ 下的图片会被 config D 处理，因为 ^~ 到达不了这一条正则
  [ configuration E ]
}
location /images/ {
  # 字符匹配到 /images/，继续往下，会发现 ^~ 存在
  [ configuration F ]
}
location /images/abc {
  # 最长字符匹配到 /images/abc，继续往下，会发现 ^~ 存在
  # F与G的放置顺序是没有关系的
  [ configuration G ]
}
location ~ /images/abc/ {
  # 只有去掉 config D 才有效：先最长匹配 config G 开头的地址，继续往下搜索，匹配到这一条正则，采用
    [ configuration H ]
}
location ~* /js/.*/\.js {
  # 不区分大小写匹配
  [ configuration I ]
}

~~~



~~~
= 开头表示精确匹配; 
^~ 开头表示uri以某个常规字符串开头，不是正则匹配;
~ 开头表示区分大小写的正则匹配;
~* 开头表示不区分大小写的正则匹配;
/ 通用匹配, 如果没有其它匹配,任何请求都会匹配到;

~~~

## 顺序

> (location =) > (location 完整路径) > (location ^~ 路径) > (location ~,~* 正则顺序) > (location 部分起始路径) > (/) 	

~~~
- / -> config A  
    精确完全匹配，即使/index.html也匹配不了
    
- /downloads/download.html -> config B  
    匹配B以后，往下没有任何匹配，采用B  
    
- /images/1.gif -> configuration D  
    匹配到F，往下匹配到D，停止往下
    
- /images/abc/def -> config D  
    最长匹配到G，往下匹配D，停止往下
    你可以看到 任何以/images/开头的都会匹配到D并停止，FG写在这里是没有任何意义的，H是永远轮不到的，这里只是为了说明匹配顺序
    
- /documents/document.html -> config C  
    匹配到C，往下没有任何匹配，采用C
    
- /documents/1.jpg -> configuration E  
    匹配到C，往下正则匹配到E    
    
- /documents/Abc.jpg -> config CC  
    最长匹配到C，往下正则顺序匹配到CC，不会往下到E

~~~



# React-Router and Nginx

Demo1: https://stackoverflow.com/questions/36304302/how-can-i-configure-react-router-to-with-nginx-cherrypy-and-my-current-reactjs-a

```jsx
ReactDOM.render(
    (<Router history={browserHistory}>
        <Route path="/" component={AppMainNewNav}>
            <Route path="users" component={UsersPage}/>
            <Route path="about" component={About}/>
        </Route>
        <Route path="*" component={NoMatch}/>
    </Router>)
    , document.getElementById('navbar'));

```

And in AppMainNewNav render() I modified the navigation to something like this:

```jsx
<nav>
    <ul role="nav">
        <li><Link to="/videos">Videos</Link></li>
        <li><Link to="/about">About</Link></li>
    </ul>
</nav>

```



```nginx
upstream app_servers {
    server 127.0.0.1:9988;
}

# Configuration for Nginx
server {

    # Any route that doesn't have a file extension (e.g. /devices)
    location / {
        root /var/www;
        index index.html;
        try_files $uri $uri/ /index.html;
    }

    # Proxy connections to the application servers
    # app_servers
    location /api {
        proxy_pass         http://app_servers/api;
        proxy_redirect     off;
        proxy_set_header   Host $host;
        proxy_set_header   X-Real-IP $remote_addr;
        proxy_set_header   X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header   X-Forwarded-Host $server_name;
    }
}

```

Demo2:

https://stackoverflow.com/questions/45598779/react-router-browserrouter-leads-to-404-not-found-nginx-error-when-going-to

~~~nginx
server {
  listen 80 default_server;
  server_name /var/www/example.com;

  root /var/www/example.com;
  index index.html index.htm;      

  location ~* \.(?:manifest|appcache|html?|xml|json)$ {
    expires -1;
    # access_log logs/static.log; # I don't usually include a static log
  }

  location ~* \.(?:css|js)$ {
    try_files $uri =404;
    expires 1y;
    access_log off;
    add_header Cache-Control "public";
  }

  # Any route containing a file extension (e.g. /devicesfile.js)
  location ~ ^.+\..+$ {
    try_files $uri =404;
  }

  # Any route that doesn't have a file extension (e.g. /devices)
  location / {
    try_files $uri $uri/ /index.html;
  }
}

~~~



***

Demo3: 

有效

https://stackoverflow.com/questions/43555282/react-js-application-showing-404-not-found-in-nginx-server/64815076#64815076

~~~nginx
location / {
            root /var/www/myapp/build;
            index index.html;
            try_files $uri /index.html$is_args$args =404;
    }

~~~



```nginx
location / {
    root /var/www/mysite;
    set $fallback_file /index.html;
    if ($http_accept !~ text/html) {
        set $fallback_file /null;
    }
    try_files $uri $fallback_file;
}

```



# rewrite

在`location`里一旦返回`break`则直接生效并停止后续的匹配`location`

```nginx
server {
    location / {
        rewrite /last/ /q.html last;
        rewrite /break/ /q.html break;
    }
    location = /q.html {
        return 400;
    }
}

```

- 访问`/last/`时重写到`/q.html`，然后使用新的`uri`再匹配，正好匹配到`locatoin = /q.html`然后返回了`400`
- 访问`/break`时重写到`/q.html`，由于返回了`break`，则直接停止了

https://my.oschina.net/u/4093217/blog/3123257

https://blog.csdn.net/weixin_44580977/article/details/99655747

***

## break和last在location {}外

```
格式：rewrite xxxxx  break;

```

当配置文件中有location时，它还会去执行location{}段的配置（请求要匹配该location）。

示例3（break后面还有location段）：

```nginx
server{
    listen 80; 
    server_name www.a.com;
    root /data/wwwroot/www.a.com;

    rewrite /1.html /2.html break; # break后面还有location, 会匹配loaction
    rewrite /2.html /3.html;
    
    location /2.html {
        return 403;
    }
}

```

当请求1.html时，最终会返回403状态码，说明它去匹配了break后面的location{}配置。

## break和last在location{}里

```nginx
server{
    listen 80; 
    server_name www.a.com;
  
    root /data/wwwroot/www.a.com;
    
    location / {
        rewrite /1.html /2.html break;;
        rewrite /2.html /3.html;
    }
  
    location /2.html {
        rewrite /2.html /a.html;
    }
  
    location /3.html {
        rewrite /3.html /b.html;
    }
}

```

当请求/1.html，最终会访问/2.html。 如果没有break，当请求/1.html，最终会访问/b.html。

在location{}内部，遇到break，本location{}内以及后面的所有location{}内的所有指令都不再执行。

****

示例6（增加last）:

```nginx
server{
    listen 80; 
    server_name www.a.com;
    root /data/wwwroot/www.a.com;
    
    location / {
        rewrite /1.html /2.html last;
        rewrite /2.html /3.html;
    }
    location /2.html
    {
        rewrite /2.html /a.html;
    }
    location /3.html
    {
        rewrite /3.html /b.html;
    }
}

```

当请求/1.html，最终会访问/a.html
在location{}内部，遇到last，本location{}内后续指令不再执行，而重写后的url再次从头开始，从头到尾匹配一遍规则。

***

## 结论：

结论

- 当rewrite规则在location{}外，break和last作用一样，遇到break或last后，其后续的rewrite/return语句不再执行。但后续有location{}的话，还会近一步执行location{}里面的语句,当然前提是请求必须要匹配该location。
- 当rewrite规则在location{}里，遇到break后，本location{}与其他location{}的所有rewrite/return规则都不再执行。
- 当rewrite规则在location{}里，遇到last后，本location{}里后续rewrite/return规则不执行，但重写后的url再次从头开始执行所有规则，哪个匹配执行哪个。



# Alias、 rewrite

~~~
1，
location /abc/ {
	alias /home/html/abc/;
}
在这段配置下，http://test/abc/a.html 就指定的是 http://test/home/html/abc/a.html, 等价于：

2，
location /abc/ {
	root /home/html/; 		# nginx就会去找/home/html/目录下的abc目录了
}

3，
location /abc/ {
	alias /home/html/def/;
}
# 那么nginx将会从/home/html/def/取数据，
~~~





# 配置参数

## server_name

[server_name](http://nginx.org/en/docs/http/ngx_http_core_module.html#server_name)，设置虚拟主机的名称。

形式如下：

```
默认值 server_name "";
server_name name1 name2 ...; # name1: primary server name

```

例1，穷举域名

```
server {
    server_name example.com www.example.com;
}

```

例2，通配符写法

```
server {
    server_name example.com *.example.com www.example.*;
}

```

Server names can include an asterisk (“`*`”) replacing the first or last part of a name:

更多匹配规则请查阅：http://nginx.org/en/docs/http/server_names.html

***

之前有一个印象很深的需求，领导要求在浏览器输入zipeiyi.com能够自动跳转到[www.zipeiyi.com](http://www.zipeiyi.com/) ,想了很久，开始无从下手，后来是用硬件负载均衡搞定的，其实nginx有两种方式可以搞定:(https://blog.51cto.com/zhouxinyu1991/1827474)

1.虚拟主机别名配置很轻松的就能实现，下面我们来看一下整个配置过程 :

~~~nginx
        server_name  www.zipeiyi.com zipeiyi.com;

~~~

*所谓虚拟主机别名就是为 虚拟主机设置除了主域名以外的一个或者多个域名*







## expires缓存

对于网站的图片,尤其是新闻站, 图片一旦发布, 改动的可能是非常小的.我们希望 能否在用户访问一次后, 图片缓存在用户的浏览器端,且时间比较长的缓存。可以, 用到 nginx的expires设置 。nginx中设置过期时间,非常简单。在location或if段里,来写。

设置格式

```
expires 30s;#30秒
expires 30m;#30分钟
expires 2h;#2个小时
expires 30d;#30天

```





## Log、log_format 日志格式

1、log_format 语法：
log_format name（格式名字） 格式样式（即想要得到什么样的日志内容）

示例： 默认格式

```nginx
log_format   main   
'$remote_addr - $remote_user [$time_local] "$request" '
'$status $body_bytes_s ent "$http_referer" '
'"$http_user_agent" "$http_x_forwarded_for"'

```

2, access_log

用了log_format 指令设置了日志格式之后，需要用access_log指令指定日志文件的存放路径；

语法：
access_log path(存放路径) format (自定义日志名称)

示例:

> access_log logs/access.log main;

3,  error_log：
配置错误日志，例如上例。

~~~nginx
# 错误日志保存路径和级别
error_log  /var/log/nginx/error.log warn;

~~~



# server：虚拟主机

```bash
vim /usr/local/nginx/conf/nginx.conf
```

nginx.conf是典型的分段配置文件，下面我们来分析下。

## 基本配置

http的server端:

我们使用 nginx 的 http 服务，在配置文件 nginx.conf 中的 http 区域内，配置无数个 server ，**每一个 server 对应这一个虚拟主机或者域名。**

当Nginx在某个端口收到一个HTTP请求时，会交给监听该端口的server处理。

一个 server 可以出现多个 location ，我们对不同的访问路径进行不同情况的配置。

~~~nginx
# 配置虚拟主机
server {
  listen         80;
  server_name    localhost; # 设置localhost就是指向本地？？？
  
  location / {
    root      html;
    index     index.html;
  }
  
  location /bbs {
    root      html;
    index     index.html;
  }
  
  location /sports {
    root      html;
    index     index.html;
  }
  
}

~~~

其实这是把Nginx作为web server来处理静态资源。

第一：location可以进行正则匹配，应该注意正则的几种形式以及优先级。（这里不展开）

*第二：Nginx能够提高速度的其中一个特性就是：动静分离，就是把静态资源放到Nginx上，由Nginx管理，动态请求转发给后端。*

**第三：我们可以在Nginx下把静态资源、日志文件归属到不同域名下（也即是目录），这样方便管理维护。**

>listen 80                          #监听端口;
>
>location / {                       #访问首页路径
>
>​	root /xxx/xxx/index.html       #默认目录
>
>​	index index.html index.htm     #默认文件
>
>}  

~~~nginx
# 当nginx接到请求后，会匹配其配置中的server模块
# 匹配方法就是将请求携带的host和port去跟配置中的server_name和listen相匹配
server {
  listen         8080;
  server_name    localhost;  # 定义当前虚拟主机（站点）匹配请求的主机名
  
  location / {
    root      html; # Nginx默认值
     # 设定Nginx服务器返回的文档名 先找根目录下的index.html，如果没有再找index.htm
    index     index.html index.htm; 
  }
}
# server{ } 其实是包含在 http{ } 内部的。每一个 server{ } 是一个虚拟主机（站点）。

# 上面代码块的意思是：当一个请求叫做localhost:8080请求nginx服务器时，该请求就会被匹配进该代码块的 server{ } 中执行。

~~~

## alias vs root

 [Nginx虚拟目录alias和root目录](https://www.cnblogs.com/kevingrace/p/6187482.html)

***

最终指向的文件路径区别
root指向的文件实际路径：pathname =>	root+pathname
alias指向的文件实际路径：pathname =>	alias



***

nginx是通过alias设置虚拟目录，在nginx的配置中，alias目录和root目录是有区别的：

1）alias指定的目录是准确的，即location匹配访问的path目录下的文件直接是在alias目录下查找的；

2）root指定的目录是location匹配访问的path目录的上一级目录,这个path目录一定要是真实存在root指定目录下的；

3）使用alias标签的目录块中不能使用rewrite的break（具体原因不明）；**另外，alias后面指定的目录后面必须要加上"/"符号！！**

4）alias配置中，location匹配的path目录如果后面不带"/"，那么访问的url地址中这个path目录后面加不加"/"不影响访问，访问时它会自动加上"/"；
  但是如果location匹配的path目录后面加上"/"，那么访问的url地址中这个path目录必须要加上"/"，访问时它不会自动加上"/"。如果不加上"/"，访问就会失败！
5）root目录配置中，location匹配的path目录后面带不带"/"，都不会影响访问。

***

*举例说明*（比如nginx配置的域名是www.wangshibo.com）：

 如果访问 www.wangshibo.com/i/test.png

示例一

~~~nginx
location /i/ {
    alias /data/w3/;
}
# 最终pathname为： /data/w3/
### 最后返回的结果为  www.wangshibo.com/data/w3/test.png
### alias配置最后的/一定是要的，否则返回结果会变成  /data/w3test.png  而返回的404

~~~

注意：alias指定的目录后面必须要加上"/"，即/data/w3/不能改成/data/w3。

示例二

~~~nginx
location /i/ {
    root /data/w3/;
}
# 最终pathname为： /data/w3/i/
### 如果访问 www.wangshibo.com/i/test.png 最后返回的结果为 www.wangshibo.com/data/w3/i/test.png, root配置最后的/要不要都行

~~~

https://www.cnblogs.com/kevingrace/p/6187482.html

## server root

 server root , location root 区别: https://www.shuzhiduo.com/A/q4zV4r8G5K/

root 指的是请求的根目录，引用nginx官网的解释：

> Sets the root directory for requests . A path to the file is constructed by merely adding a URI to the value of the root directive 翻译：设置请求的根目录，设置的文件路径要加上root后面匹配的URI
>
> Note that the root directive is placed in the server context. Such root directive is used when the location block selected for serving a request does not include own root directive. 如果匹配的location里面没有自己的root指令，才用server里面的root指令

 总结：location里面的root优先级高于server root

```

```



## try_files

Nginx的配置语法灵活，可控制度非常高。

在0.7以后的版本中加入了一个try_files指令，配合命名location，可以部分替代原本常用的rewrite配置方式，提高解析效率。

try_files指令说明：

```nginx
try_files指令
语法：try_files file ... uri 或 try_files file ... = code
默认值：无
作用域：server location

```

查找路径是按照给定的root或alias为根路径来查找的;

其作用是按顺序检查文件是否存在，返回第一个找到的文件或文件夹(结尾加斜线表示为文件夹)，如果所有的文件或文件夹都找不到，会进行一个内部重定向到最后一个参数。

***

需要注意的是，只有最后一个参数可以引起一个内部重定向，之前的参数只设置内部URI的指向。最后一个参数是回退URI且必须存在，否则会出现内部500错误。命名的location也可以使用在最后一个参数中。与rewrite指令不同，如果回退URI不是命名的location那么$args不会自动保留，如果你想保留$args，则必须明确声明。

```nginx
try_files $uri $uri/ /index.php?q=$uri&$args;

```

当用户请求 http://localhost/example 时，这里的 $uri 就是 /example。

try_files 会到硬盘里尝试找这个文件。如果存在名为 /$root/example（其中 $root 是项目代码安装目录）的文件，就直接把这个文件的内容发送给用户。

显然，目录中没有叫 example 的文件。然后就看 $uri/，增加了一个 /，也就是看有没有名为 /$root/example/ 的目录。
又找不到，就会 fall back 到 try_files 的最后一个选项 /index.php，发起一个内部 “子请求”，也就是相当于 nginx 发起一个 HTTP 请求到 http://localhost/index.php。

***

## docker 和 nginx

首先你需要安装 Docker，不同的操作系统有不同的 [安装](https://docs.docker.com/install/) 方式。

环境就位后，我们新建一个项目 `nginx-quick`，在根目录新建一个 `docker-compose.yml` 文件，这是 Docker-Compose 的配置文件：

```nginx
version: "3"

services:
  nginx: # 服务的名称
    image: nginx
    volumes: # 文件夹映射
      - ./nginx/nginx.conf:/etc/nginx/nginx.conf # nginx 配置文件
    ports: # 端口转发
      - "8080:80"


```

我们定义了一组服务 nginx，用于启动一个 docker 容器。

**容器对应的镜像**是 `nginx`，在容器内 Nginx 服务的启动端口是 80，外部访问端口是 8080，同时，我们把本地自定义的 Nginx 配置文件 `./nginx/nginx.conf` 对应同步到容器中的 `/etc/nginx/nginx.conf` 路径。

~~~nginx
# 全局配置
user  nginx;         # 配置用户或者组
worker_processes  1; # 允许生成的进程数

error_log  /var/log/nginx/error.log warn; # 错误日志路径，warn 代表日志级别，级别越高记录越少
pid        /var/run/nginx.pid;            # Nginx 进程运行文件存放地址

events {
  accept_mutex on;          # 设置网路连接序列化，防止惊群现象发生
  multi_accept on;          # 设置一个进程是否同时接受多个网络连接
  worker_connections  1024; # 每个进程的最大连接数，因此理论上每台 Nginx 服务器的最大连接数 = worker_processes * worker_connections
}

# HTTP 配置
http {
  include       /etc/nginx/mime.types;    # 文件扩展名与文件类型映射表
  default_type  application/octet-stream; # 默认文件类型

  log_format  main  '$remote_addr - $remote_user [$time_local] "$request" '
                    '$status $body_bytes_sent "$http_referer" '
                    '"$http_user_agent" "$http_x_forwarded_for"'; # 日志格式

  access_log  /var/log/nginx/access.log  main; # 访问日志路径

  sendfile        on; # 允许 sendfile 方式传输文件

  keepalive_timeout  65; # 连接超时时间

  server {
    listen       80;         # 监听端口
    server_name  localhost;  # 监听地址

    location / {                    # 请求的url过滤，正则匹配
      root   /usr/share/nginx/html; # 根目录
      index  index.html index.htm;  # 默认页
    }
  }
}

~~~

这里我们简单配置了一个 `localhost:80` 的访问监听（注意这里的 localhost 不是本地，是容器内部）。

https://juejin.cn/post/6844904003793321998



## 其他配置

~~~nginx
----------------------------------------

user                    #设置nginx服务的系统使用用户
worker_processes        #工作进程数 一般情况与CPU核数保持一致
error_log               #nginx的错误日志
pid                     #nginx启动时的pid

events {
    worker_connections    #每个进程允许最大连接数
    use                   #nginx使用的内核模型
}

----------------------------------------

http {
    sendfile  on                  #高效传输文件的模式 一定要开启
    keepalive_timeout   65        #客户端服务端请求超时时间
    log_format  main   XXX        #定义日志格式 代号为main
    access_log  /usr/local/access.log  main     #日志保存地址 格式代码 main
}


~~~







## 反向代理 - proxy_pass

所谓反向代理，很简单，其实就是在location这一段配置中的root替换成**proxy_pass**即可。

**root说明是静态资源，可以由Nginx进行返回；**

而proxy_pass说明是动态请求，需要进行转发，比如代理到Tomcat上。

反向代理，上面已经说了，过程是透明的，比如说request -> Nginx -> Tomcat，那么对于Tomcat而言，请求的IP地址就是Nginx的地址，而非真实的request地址，这一点需要注意。

不过好在Nginx不仅仅可以反向代理请求，还可以由用户**自定义设置HTTP HEADER**。



# proxy_pass

https://www.cnblogs.com/kevingrace/p/8269955.html

https://www.jianshu.com/p/b010c9302cd0

Nginx proxy_set_header：**即允许重新定义或添加字段传递给代理服务器的请求头。该值可以包含文本、变量和它们的组合。**

在没有定义proxy_set_header时会继承之前定义的值

proxy_set_header 就是可设置请求头-并将头信息传递到代理服务器端，不属于请求头的参数中也需要传递时，重定义下即可！

例如： 访问http://aaa-bbb.com/pfApi/getName

~~~nginx
    location /pfApi/ {
        proxy_set_header 		Host $host; # proxy_set_header重新定义或添加字段，传递给代理服务器的请求头
        proxy_set_header 		X-Real-Ip $remote_addr; # $remote_addr=客户端IP地址
        proxy_set_header		X-Forwarded-For $remote_addr;
        proxy_pass				  http://tomcat_okr-ui.com/;      # 最终URL=http://tomcat_okr-ui.com/getName
  			proxy_pass				  http://tomcat_okr-ui.com;       # 最终URL=http://tomcat_okr-ui.com/pfApi/getName
 			  proxy_pass				  http://tomcat_okr-ui.com/add/;  # 最终URL=http://tomcat_okr-ui.com/add/getName
   			proxy_pass				  http://tomcat_okr-ui.com/add;  # 最终URL=http://tomcat_okr-ui.com/add/pfApi/getName
  
    }

~~~

>⚠️：
>
>在nginx中配置proxy_pass代理转发时，如果在proxy_pass后面的url加/，表示绝对根路径；
>
>如果没有/，表示相对路径，把匹配的路径部分也给代理走。
>
>







# 负载均衡【upstream】

目的：将流量均衡的分配给后台服务器以平衡各个服务器的负载压力

上面的反向代理中，我们通过proxy_pass来指定Tomcat的地址，很显然我们只能指定一台Tomcat地址，那么我们如果想指定多台来达到负载均衡呢？

第一，通过**upstream**来定义一组Tomcat，并指定负载策略（IPHASH、加权论调、最少连接），健康检查策略（Nginx可以监控这一组Tomcat的状态）等。

第二，将proxy_pass替换成upstream指定的值即可。

***



~~~nginx
upstream <name> { # 命名
    server <address> [parameters]; # 服务
    server <address> weight=10 max_fails=2 fail_timeout=30s;
    ...
}

~~~

[parameters] 参数可选以下值：

- weight=number，default 1，设置 server 的权重
- max_conns=number，default 0，限制 server 的活跃连接数，0 代表不限制
- max_fails=number，default 1，设置在 fail_timeout 时间内失败的最大次数，可由 `proxy_next_upstream`，`fastcgi_next_upstream`，`uwsgi_next_upstream`，`scgi_next_upstream`，`memcached_next_upstream`，`grpc_next_upstream` 指定下组 upstream，0 值代表不启用
- fail_timeout=time，default 10s，设置多长时间判定无连接服务器失败
- backup，标记 server 为备用 server，当 primary server 不可用时启用
- down，标记 server 下线不可用
- resolve，用来监视与服务器域名对应IP地址的更改，它会自动更改上游配置，`upstream` 必须驻留在共享内存中，必须写在 `http` 标签中。



***

如果请求数过大，单个服务器解决不了，我们增加服务器的数量，然后将请求分发到各个服务器上，将原先请求集中到单个服务器的情况改为请求分发到多个服务器上，就是负载均衡。

Upstream 指定后端服务器地址列表，在 server 中拦截响应请求，并将请求转发到 Upstream 中配置的服务器列表。

~~~nginx
# 定义一个负载均衡， 名称为balanceServer， 可供proxy_pass使用
upstream balanceServer {
    server 10.1.22.33:12345 weight=10;
    server 10.1.22.34:12345;
    server 10.1.22.35:12345;
}

# http服务
server { 
 	  listen       80;
    server_name  fe.server.com;
    
    # 反向代理
    location /api {
        proxy_pass http://balanceServer;
  	}
  
    # 静态服务
    location / {
        root /usr/share/nginx/html;
        index index.html index.htm;
    }
  
  	location / {
        rewrite https://$host; # 重定向到https
    }
}

~~~

上面的配置只是指定了 nginx 需要转发的服务端列表，并没有指定分配策略。

默认情况下采用的是轮询策略，将所有客户端请求轮询分配给服务端。这种策略是可以正常工作的，但是如果其中某一台服务器压力太大，出现延迟，会影响所有分配在这台服务器下的用户。

***

**Nginx支持的负载均衡调度算法方式如下：**

*weight轮询(默认，常用)：*

*fair：*智能调整调度算法



***

**负载均衡可能带来的问题？**

负载均衡所带来的明显的问题是，一个请求，可以到A server，也可以到B server，这完全不受我们的控制，当然这也不是什么问题，只是我们得注意的是：**用户状态的保存问题，如Session会话信息，不能在保存到服务器上。**

# 动静分离

Nginx能够提高速度的其中一个特性就是：动静分离，就是把静态资源放到Nginx上，由Nginx管理，动态请求转发给后端。

***

动静分离其实就是 Nginx 服务器将接收到的请求分为**动态请求**和**静态请求**。

静态请求直接从 nginx 服务器所设定的根目录路径去取对应的资源，动态请求转发给真实的后台（前面所说的应用服务器，如图中的Tomcat）去处理。

**这样做不仅能给应用服务器减轻压力，将后台api接口服务化，还能将前后端代码分开并行开发和部署。**

~~~nginx
server {  
        listen       8080;        
        server_name  localhost;

        location / {
            root   html; # Nginx默认值
            index  index.html index.htm;
        }
        
        # 静态化配置，所有静态请求都转发给 nginx 处理，存放目录为 my-project
        location ~ .*\.(html|htm|gif|jpg|jpeg|bmp|png|ico|js|css)$ {
            root /usr/local/var/www/my-project; # 静态请求所代理到的根目录  # 设置为个人项目的根目录路径
        }
        
        # 动态请求匹配到path为'api'的就转发到其他服务器处理
        location /api/ {  
            proxy_pass http://xxxxxxx; # 充当服务代理
        }
}

~~~



# 常用命令

```bash
sudo nginx # 启动


# 快速关闭Nginx，可能不保存相关信息，并迅速终止web服务
nginx -s stop
# 平稳关闭Nginx，保存相关信息，有安排的结束web服务
nginx -s quit

# 因改变了Nginx相关配置，需要重新加载配置而重载
nginx -s reload
# 重新打开日志文件
nginx -s reopen

# 为 Nginx 指定一个配置文件，来代替缺省的
nginx -c filename
# 不运行，而仅仅测试配置文件。nginx 将检查配置文件的语法的正确性，并尝试打开配置文件中所引用到的文件
nginx -t
#  显示 nginx 的版本
nginx -v
# 显示 nginx 的版本，编译器版本和配置参数
nginx -V

```



# 反向代理服务器

客户的所有请求都交给代理服务器处理。

反向代理：用一台服务器，代理真实服务器，用户访问时，不再是访问真实服务器，而是代理服务器。

利用Nginx可以实现反向代理web服务器；

反向代理，是指以代理服务器来接受internet上的连接请求，然后将请求转发给内部网络上的服务器，并将从服务器上得到的结果返回给internet上请求连接的客户端，此时代理服务器对外就表现为一个反向代理服务器。

反向代理是代理的是服务端，主要用于服务器集群分布式部署的情况下，反向代理对外隐藏了服务器的信息。





# j-dos 的配置

http://test.jdos.jd.com/views/index.html#/?ip=11.50.79.70

## 容器实例： 

+ 容器IP ： 11.50.79.70

+ 查看容器具体内容：操作 -- 常用工具 -- 容器目录查询

  http://test.jdos.jd.com/views/index.html#/?ip=11.50.79.70

  >--export
  >
  >	--App
  >
  >​			--bin
  >
  >​			--css
  >
  >​			--js
  >
  >​					--app.js
  >
  >​					--1.chunk.js
  >
  >​					--bomList.chunk.js
  >
  >​			favicon.ico
  >
  >​			index.html
  >
  >​	--Data
  >
  >​	--Logs
  >
  >​			access.log
  >
  >​			error.log
  >
  >​			node_install.log
  >
  >​	--Shell
  >
  >​	--data
  >
  >​	--home
  >
  >​	--tiger

## 编译打包

​		工程编码： UTRF-8

​		编译语言:   node-v12.16.2

​		应用类型：application_worker

​		打包类型：make

​		Git信息： Git Branch version1.0

## 镜像

+ 镜像名称： intelligent-manufacturing/imp-web:v20210126.180616.331 （下面是镜像详情）

+ 编译信息：

  > 源码地址 :     https://coding.jd.com/intelligent-manufacturing/imp-web.git	
  >
  > Git Branch： version 1.0
  >
  > Git Reversion： cc524f0a2aeaef42bc974c0ba5ffc85440504155
  >
  > 自定义命令： 
  >
  > ​		npm config set registry http://registry.m.jd.com 
  >
  > ​		npm install
  >
  > ​		npm run build
  >
  > ​	   cp -r ./dist/* bin $BUILD

+ 构建信息

  >镜像名:      intelligent-manufacturing/imp-web
  >
  >镜像版本:       v20210126.180616.331
  >
  >打包文件版本 : 	125
  >
  >基础镜像: 	intelligent-manufacturing/cbimg18294:node-v12.19.0-pm2-nginx-y_imp-web
  >
  >TomcatServer: 	数量1

## 系统文件-nginx

容器服务 -- 配置管理 -- 高级配置 -- 系统文件 --**/opt/nginx/conf/domains**

+ 文件路径： /opt/nginx/conf/domains/portal.conf

+ 文件内容：

  ~~~nginx
  server {
    listen          80; # 监听的端口号
    server_name     localhost;
    access_log               /export/Logs/access.log main; #日志保存地址 格式代码 main
    error_log                /export/Logs/error.log warn;
  
    location /domain/creative/imp/ {
      proxy_pass http://127.0.0.1:80/; 
      # 反代 IP 127.0.0.1 是 nginx 所在的主机,也就是容器内的本地IP，就是 nginx 所在容器内环境
    }
     
    location /domain/creative/imp/images/ {
      alias /export/App/images/;
      index  index.html index.htm;
      try_files $uri $uri/ /index.html;
    }
    location /domain/creative/imp/api/ {
      proxy_pass http://11.50.77.228/api/;
      expires 0;
      proxy_send_timeout 5000;
      proxy_read_timeout 5000;
    }
    location / {
      alias /export/App/;
      index  index.html index.htm;
      try_files $uri $uri/ /index.html;
    }
  }
  ~~~

# j-one 配置

## 定制中心POP-预发-nginx

http://lt-desktop.jd.com/#?ip=10.181.21.49

~~~nginx
upstream tomcat_cdz.shop {
    server 127.0.0.1:1601  weight=10 max_fails=2 fail_timeout=30s ;

}

upstream tomcat_yip_upload {
        server  11.26.190.208:1601  weight=10 max_fails=2 fail_timeout=30s;
        server  10.191.190.40:1601  weight=10 max_fails=2 fail_timeout=30s;
 }

log_format realaddr_41790           '$remote_addr - $remote_user [$time_local] "$http_x_forwarded_for" "$http_j_forwarded_for" '
                                '"$request" $status $bytes_sent '
                                '"$http_referer" "$http_user_agent" '
                                '"$gzip_ratio" '
                                '$request_time $upstream_response_time';

server {
    listen          80;
    server_name     cdz.shop.jd.com cdz.shop.360buy.com cdz.shop.jd.local;
    access_log      /export/servers/nginx/logs/cdz.shop.jd.com/cdz.shop.jd.com_access.log realaddr_41790;
    error_log       /export/servers/nginx/logs/cdz.shop.jd.com/cdz.shop.jd.com_error.log warn;

    chunkin on;      # HTTP协议有一种分块传输编码的机制(Chunked Transfer Encoding)

    error_page 411 = @my_error;

    location @my_error {
        chunkin_resume;
    }
  
    root /export/Packages/yip-customized-shop/latest/dist/;

    location / {
        expires                 0;
    }
    
    location /customcenter {
            proxy_set_header        X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_pass              http://wg.jd.local;
            expires                 0;
    }
    
        location /routercenter {
            proxy_set_header        X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_pass              http://wg.jd.local;
            expires                 0;
    }


    location /yip_pub {
            proxy_set_header        X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_pass             http://wg.jd.local;
            expires                 0;
    }
        
    location /yip_pub_vcp {
      
        proxy_set_header        X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_pass              http://wg.jd.local;
        expires                 0;
    }
    
    location /yip_pub_shop {
     
        proxy_set_header        X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_pass              http://wg.jd.local;
        expires                 0;
    }
    
    location /yip_pub/file/upload {
      
        proxy_set_header        X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_pass              http://tomcat_yip_upload;
        expires                 0;
    }
    
    location /yip_pub/image/upload {
        proxy_set_header        X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_pass              http://tomcat_yip_upload;
        expires                 0;
    }
    
    location /yip_pub/file/image {
        proxy_set_header        X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_pass              http://tomcat_yip_upload;
        expires                 0;
    }

    location /logs/ {
        autoindex       off;
        deny all;
    }
    
     rewrite ^/dashboard  / redirect; 
}
~~~



## 生产中心-预发、线上-nginx

### 预发：

 http://lt-desktop.jd.com/#?ip=11.18.19.37

~~~nginx
upstream tomcat_pc_open_service {
        server 	wg.p.jd.com  weight=10 max_fails=2 fail_timeout=30s;
}

upstream tomcat_yip_upload {
        server 	11.26.190.208:1601 weight=10 max_fails=2 fail_timeout=30s;
 }

upstream tomcat_c2mweb {
    server 127.0.0.1:1601  weight=10 max_fails=2 fail_timeout=30s;
    server wg.jd.local  weight=10 max_fails=2 fail_timeout=30s;
}

log_format realaddr_40554       '$remote_addr - $remote_user [$time_local] "$http_x_forwarded_for" "$http_j_forwarded_for" '
                                '"$request" $status $bytes_sent '
                                '"$http_referer" "$http_user_agent" '
                                '"$gzip_ratio" '
                                '$request_time $upstream_response_time'
                                '$upstream_addr $upstream_response_time $request_time ';

server {
    listen          80;
    server_name      afsyf.jd.com yfc2mweb.jd.com yfc2mweb.360buy.com yfc2mweb.jd.local;
    access_log      /export/servers/nginx/logs/c2mweb.jd.local/c2mweb.jd.local_access.log realaddr_40554;
    error_log       /export/servers/nginx/logs/c2mweb.jd.local/c2mweb.jd.local_error.log notice;
  
    rewrite_log on;
  
    root /export/Packages/yip-production-center-portal/latest/dist;
	   index index.html index.htm;
  
    location / {
      
    }

   location /prodcenter {
            proxy_set_header        Host  $host;
            proxy_set_header        X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_pass              http://tomcat_pc_open_service;
            expires                 0;
    }
    
    location /customcenter {
            proxy_set_header        Host  $host;
            proxy_set_header        X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_pass              http://tomcat_pc_open_service;
            expires                 0;
    }
    
     location /yip_pub {
            proxy_set_header        Host  $host;
            proxy_set_header        X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_pass              http://tomcat_pc_open_service;
            expires                 0;
        }
     location /yip_pub/file/upload {
            proxy_set_header        Host  $host;
            proxy_set_header        X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_pass               http://tomcat_yip_upload;
            expires                 0;
        }    
    location /yip_pub/image/upload {
            proxy_set_header        Host  $host;
            proxy_set_header        X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_pass               http://tomcat_yip_upload;
            expires                 0;
        }
        
        location /yip_pub/file/image {
            proxy_set_header        Host  $host;
            proxy_set_header        X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_pass              http://tomcat_yip_upload;
            expires                 0;
        }
    
    location /logs/ {
        autoindex       off;
        deny all;
    }
    
    rewrite ^/sub_procenter/Home              /index.html last;
    rewrite ^/sub_procenter/OrderManage       /index.html last;
    rewrite ^/sub_procenter/ReturnOrderPre    /index.html last;
    rewrite ^/sub_procenter/SerialNumber      /index.html last;
    rewrite ^/sub_procenter/Stock             /index.html last;
    rewrite ^/sub_procenter/DeliveryAddress   /index.html last;
    rewrite ^/sub_procenter/CarriersManage    /index.html last;
    rewrite ^/sub_procenter/(.*)              /$1 last;
    
}
~~~

### 线上

http://lt-desktop.jd.com/#?ip=11.27.142.36

~~~nginx
# 负载均衡
upstream tomcat_c2mweb {
    server 127.0.0.1:1601  weight=10 max_fails=2 fail_timeout=30s;
    server wg.jd.local  weight=10 max_fails=2 fail_timeout=30s ;
}

upstream tomcat_yip_upload {
        server  11.26.190.208:1601  weight=10 max_fails=2 fail_timeout=30s;
        server  10.191.190.40:1601  weight=10 max_fails=2 fail_timeout=30s;
 }

# 日志格式
log_format realaddr_40554     '$remote_addr - $remote_user [$time_local] "$http_x_forwarded_for" "$http_j_forwarded_for" '
                                '"$request" $status $bytes_sent '
                                '"$http_referer" "$http_user_agent" '
                                '"$gzip_ratio" '
                                '$request_time $upstream_response_time';

server {
    listen          80;
    server_name     vcp.jd.com;
    access_log      /export/servers/nginx/logs/c2mweb.jd.local/c2mweb.jd.local_access.log realaddr_40554;
    error_log       /export/servers/nginx/logs/c2mweb.jd.local/c2mweb.jd.local_error.log warn;

    error_page 506 = http://www.jd.com/error2.aspx;

    root /export/Packages/yip-production-center-portal/latest/dist;
    index index.html index.htm;
  
    location / {
        #index index.html index.htm;
        #try_files index.html index.htm;
    }

    location /prodcenter {
            proxy_set_header        X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_pass              http://wg.jd.local;
            expires                 0;
    }
    
    location /customcenter {
            proxy_set_header        X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_pass              http://wg.jd.local;
            expires                 0;
    }
    
     location /yip_pub {
            proxy_set_header        X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_pass             http://wg.jd.local;
            expires                 0;
        }
     location /yip_pub/file/upload {
            proxy_set_header        X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_pass              http://tomcat_yip_upload;
            expires                 0;
        }    
    location /yip_pub/image/upload {
            proxy_set_header        X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_pass              http://tomcat_yip_upload;
            expires                 0;
        }
        
    location /yip_pub/file/image {
      proxy_set_header        X-Forwarded-For $proxy_add_x_forwarded_for;
      proxy_pass              http://tomcat_yip_upload;
      expires                 0;
    }
    
    location /logs/ {
        autoindex       off;
        deny all;
    }
    
    rewrite ^/sub_procenter/Home              /index.html last;
    rewrite ^/sub_procenter/OrderManage       /index.html last;
    rewrite ^/sub_procenter/ReturnOrderPre    /index.html last;
    rewrite ^/sub_procenter/SerialNumber      /index.html last;
    rewrite ^/sub_procenter/Stock             /index.html last;
    rewrite ^/sub_procenter/DeliveryAddress   /index.html last;
    rewrite ^/sub_procenter/CarriersManage    /index.html last;
    rewrite ^/sub_procenter/(.*)              /$1 last;
    
}
~~~



## 智能生产-imp

~~~nginx
    # 日志格式
    log_format  main  '$remote_addr - $remote_user [$time_local] "$request" '
                      '$status $body_bytes_sent "$http_referer" '
                      '"$http_user_agent" "$http_x_forwarded_for"';


	log_format main2              '$remote_addr - $remote_user [$time_local] "$http_x_forwarded_for" "$http_j_forwarded_for" '
                                '"$request" $status $bytes_sent '
                                '"$http_referer" "$http_user_agent" '
                                '"$gzip_ratio" '
                                '$request_time';

server {
  listen          80;
  server_name     localhost;
  
  access_log               /export/Logs/access.log main; #日志保存地址 格式代码 main
  error_log                /export/Logs/error.log warn; # 错误日志保存路径和级别
  
  root /export/Packages/intelligent-manufacturing-web/latest/dist;

  location /domain/creative/imp/ {
    proxy_pass http://localhost:80/;
  }
   
  location /domain/creative/imp/images/ {
    # alias /images/;
    alias /export/Packages/intelligent-manufacturing-web/latest/dist/images/;
    index  index.html index.htm;
    try_files $uri $uri/ /index.html;
  }
  location /domain/creative/imp/api/ {
    proxy_set_header        Host  $host;
    proxy_pass 							http://11.26.105.100/api/;
    expires 								0;
    proxy_send_timeout 			5000;
    proxy_read_timeout			5000;
  }
  
  location / {
    alias /export/Packages/intelligent-manufacturing-web/latest/dist/;
    index  index.html index.htm;
    try_files $uri $uri/ /index.html;
  }
}

~~~

最终格式？

~~~nginx
server {
  		listen        						80;
  		server_name   			      localhost;
  		access_log                /export/Logs/access.log main; 
 	    error_log                 /export/Logs/error.log warn;
  
  		# root /export/Packages/intelligent-manufacturing-web/latest/dist;

 		 location /domain/creative/imp/ {
  			  proxy_pass http://localhost:80/;
  		}
   
  		location /domain/creative/imp/images/ {
  			  alias						/export/Packages/intelligent-manufacturing-web/latest/dist/images/;
  			  index  			   	index.html index.htm;
    		  try_files			  $uri $uri/ /index.html;
 		 }
         
      location /domain/creative/imp/api/ {
            proxy_set_header      		Host  $host;
            proxy_pass      			    http://11.26.105.100/api/;
            expires        		  			0;
            proxy_send_timeout  		  5000;
            proxy_read_timeout 			  5000;
      }
  
      location / {
      		alias /export/Packages/intelligent-manufacturing-web/latest/dist/;
   		    index  index.html index.htm;
    	  	try_files $uri $uri/ /index.html;  
     }
      
}

~~~





