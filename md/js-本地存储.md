http://www.chenfangxu.com/nodejs/basic.html nodej s

https://juejin.cn/post/6844903541463580686#heading-22 （10）

https://segmentfault.com/a/1190000004743454 （9）

# 本地存储信息方式： 常用3种

localStorage, sessionStorage, cookie

（当然，还有其他的方式，例如IndexedDB）

**简介**

如果你想要操作一个域名的会话存储，可以使用 [`Window.sessionStorage`](https://developer.mozilla.org/zh-CN/docs/Web/API/Window/sessionStorage)；

如果想要操作一个域名的本地存储，可以使用 [`Window.localStorage`](https://developer.mozilla.org/zh-CN/docs/Web/API/Window/localStorage)。

sessionStorage和localStorage都是html5后才出现的，所以用法以及场景都差不多;  两者最大区别是**存储数据的时长不同，前者时间短，仅在当前会话下有效**，关闭tab标签或浏览器后就失效，后者如果不去手动清除，永远保存。



## 三者区别

- 相同：在本地（浏览器端）存储数据

- 不同：

  - localStorage、sessionStorage 

    localStorage只要在相同的协议、相同的主机名、相同的端口下，就能读取/修改到同一份localStorage数据。 

    sessionStorage比localStorage更严苛一点，除了协议、主机名、端口外，还要求在同一窗口（也就是浏览器的标签页）下。 

    localStorage是永久存储，除非手动删除。 

    sessionStorage当会话结束（当前页面关闭的时候，自动销毁） 

    cookie的数据会在每一次发送http请求的时候，同时发送给服务器，而localStorage、sessionStorage不会。

    

# 各自使用场景

## cookie

1. 主要用于浏览器和服务器端的通讯；
2. **可设置失效时间（过期时间），默认是浏览器关闭后失效**
3. 存放数据大小为**4K**左右（*大小有限制*, 所有cookie加起来不超过4K）
4. 每次都会携带在HTTP头中，如果使用Cookie保存过多数据会带来性能的问题（*不宜太多*）
5. cookie值是纯文本(字符串)，

## localStorge

1. 仅在客户端（即浏览器）中保存，不参与和服务器的通信
2. *除非被清除，否则存储的数据可以长期保留* （但是：localstorage 中如果超过5M，或者长期不使用还是会清理）
3. 存放数据大小一般为**5MB**
4. 浏览器可以设置是否可以访问数据，如果设置不允许会访问失败
5. **总是存储字符串类型的键值对，需要转成字符串存储**

***

同源策略限制。若想在不同页面之间对同一个localStorage进行操作，这些页面必须在同一协议、同一主机名和同一端口下。

## sessionStorage

1. 仅在客户端（即浏览器）中保存，不参与和服务器的通信
2. 仅在**当前会话下**有效，关闭tab或浏览器后被清除 ()
3. 存放数据大小一般为**5MB **
4. 打开多个（相同的URL的）Tabs页面，会创建各自的`sessionStorage`。
5. 也是存储字符串类型的数据

***

sessionStorage不是一种持久化的本地存储，仅仅是会话级别的存储。

# 注意⚠️

存储在sessionStorage或localStorage中的数据**特定于页面的协议**。也就
是说`**http**://example.com` 与 `**https**://example.com`的sessionStorage相互隔离。

被存储的键值对总是以UTF-16 [DOMString](https://developer.mozilla.org/zh-CN/docs/Web/API/DOMString) 的格式所存储，其使用两个字节来表示一个字符。对于对象、整数key值会自动转换成字符串形式。

# cookie

HTTP最大的特点是*无连接无状态*，使用Cookie和Session的技术就是为了解决这个问题，简单来说，就是让浏览器在一段时间内认识你。

## api

~~~js
document.cookie = 'username=cfangxu;domain=baike.baidu.com'   // 并且设置了生效域

// 设置 (一次只能添加一个, 多余的会被截取)
document.cookie = "a=100;b=200";

// 读取
console.log(document.cookie); // "a=100"

//(修改)
docment.cookie = "a=101“;

//(读取)
document.cookie     // "a=101"
 

// **************** 服务器端 *********

// response header中有一项叫set-cookie，是服务端专门用来设置cookie的。
Set-Cookie 消息头是一个字符串，其格式如下（中括号中的部分是可选的）：
Set-Cookie: value[; expires=date][; domain=domain][; path=path][; secure]
~~~

## 请求中携带cookie

当网页要发http请求时，浏览器会先检查是否有相应的cookie，有则自动添加在request header中的cookie字段中。这些是浏览器自动帮我们做的，而且每一次http请求浏览器都会自动帮我们做。

这个特点很重要，因为这关系到**“什么样的数据适合存储在cookie中”？**

存储在cookie中的数据，每次都会被浏览器自动放在http请求中，如果这些数据并不是每个请求都需要发给服务端的数据，浏览器这设置自动处理无疑增加了网络开销；但如果这些数据是每个请求都需要发给服务端的数据（比如身份认证信息），浏览器这设置自动处理就大大免去了重复添加操作。**所以对于那种设置“每次请求都要携带的信息（最典型的就是身份认证信息）”就特别适合放在cookie中，其他类型的数据就不适合了。**

## 特征🍓

1. *不同浏览器*存放的cookie位置不一样，也是不能通用的。
2. *不同的域下*，存储的cookie是独立的。
3. 我们可以设置cookie生效的域（当前设置cookie所在域的子域），也就是说，**我们能够操作的cookie是当前域以及当前域下的所有子域**
4. 一个域名下存放的cookie的个数是有限制的，不同的浏览器存放的个数不一样,一般为20个。
5. 每个cookie存放的内容大小也是有限制的，不同的浏览器存放大小不一样，一般为4KB。

## 设置 cookie

客户端设置`cookie`的格式：

```js
document.cookie = "test1=myCookie1;"
document.cookie = "test2=myCookie2; domain=.google.com.hk; path=/webhp"
document.cookie = "test3=myCookie3; domain=.google.com.hk; expires=Sat, 04 Nov 2017 16:00:00 GMT; secure"
document.cookie = "test4=myCookie4; domain=.google.com.hk; max-age=10800;"
```

若想要添加多个cookie，只能重复执行 `document.cookie`（如上）。



## 修改 cookie

要想修改一个cookie，只需要重新赋值就行，旧的值会被新的值覆盖。

但要注意一点，在设置新cookie时，path/domain这几个选项一定要旧cookie 保持一样。否则不会修改旧值，而是添加了一个新的 cookie。



## 删除 cookie🌊

如何删除： 把要删除的cookie的**过期时间设置成已过去的时间**,

 【path/domain/这几个选项一定要旧cookie 保持一样】

方式1: 将expires的时间设为过去的时间；

方式2: 将max-age的时间设为0；

>expires 是 http/1.0协议中的选项;
>
>max-age 是 http/1.1协议中的选项
>
>max-age 的默认值是 -1 (即有效期为会话 )，max-age有三种可能值：负数、0、正数。
>负数：默认值，会话内有效 还是 直接过期？？？？？？？；
>0：     使 cookie 直接过期；
>正数：有效期为创建时刻+ max-age



## 过期时间🌊

**expires、 max-age**

我们可以在设置cookie的时候，同时设置它的过期时间。否则，会使用默认情况：关闭浏览器的时候自动销毁cookie；

~~~~js
document.cookie = '名称=值;expires=' + GMT(格林威治时间)格式的日期型字符串; 

Set-Cookie: <cookie-name>=<cookie-value>; Max-Age=<non-zero-digit>


Set-Cookie: id=a3fWa; Expires=Wed, 21 Oct 2015 07:28:00 GMT; Secure; HttpOnly
~~~~

一般设置天数：new Date().setDate( oDate.getDate() + 5 ); 比当前时间多5天

Demo:

~~~js
Date.prototype.setDate() // 设置月份中的第几天
Date.prototype.getDate() // 返回月份中的第几天（1-31）

let a = new Date(); // Sat Jun 26 2021 19:11:25 GMT+0800 (中国标准时间)
console.log(a);
~~~

完整：

~~~js
function setCookie(name, value, expiresDays) {
  const newDays = new Date().getDate() + expiresDays;
  const newDate = new Date();
  newDate.setDate(newDays);
  
 document.cookie = `${name}=${value}` + (!expireDays ? '' : `;expires=${newDate.toGMTString()}`);
}

// setCookie('age', '22', 5);
~~~

## 路径（path）

path指定一个 URL 路径，这个路径，必须出现在，请求资源的路径中时， 才能携带cookie

（例如，如果 path=/docs，那么 "/docs", "/docs/Web/" 或者 "/docs/Web/HTTP" 都满足匹配的条件）

```js
Set-Cookie: <cookie-name>=<cookie-value>; Path=<path-value>
```

 最常用的例子就是让 cookie 在根目录下,这样不管是哪个子页面创建的 cookie，所有的页面都可以访问到了。

```js
document.cookie = "username=cfangxu; path=/"
```

>cookie 一般都是由于用户访问页面而被创建的，可是并不是只有在创建 cookie 的页面才可以访问这个 cookie。
>
>
>因为安全方面的考虑,默认情况下，只有与创建 cookie 的页面在同一个目录或子目录下的网页才可以访问。
>
>即path属性可以**为服务器特定资源指定cookie ？？？**

注意，只有在 domain 选项核实完毕之后才会对 path 属性进行比较。



## 域名（domain）🍓🍓

domain指定了 cookie 将送达到哪个域中:

~~~js
Set-Cookie: <cookie-name>=<cookie-value>; Domain=<domain-value>
~~~

默认情况下，domain 会被设置为创建该 cookie 的页面（*当前页面*）所在的域名，当给相同域名发送请求时该 cookie 会被发送至服务器。

浏览器会把 domain 的值与请求的域名做一个尾部比较（即从字符串的尾部开始比较），并将匹配的 cookie 发送至服务器。

**假如指定了域名，那么相当于各个子域名也包含在内了。**

### domain 和 path总结

domain是域名，path是路径，两者加起来就构成了 URL，**domain和path一起来限制 cookie 能被哪些 URL 访问。**

 *domain和path，这2个选项共同决定了cookie何时被浏览器自动添加到请求头部中发送出去。*

如果没有设置这两个选项，则会使用默认值。domain的默认值为设置该cookie的网页所在的域名，path默认值为设置该cookie的网页所在的目录。

## 安全（Secure）

一个设置了安全属性（secure）的cookie，只有当请求使用了HTTPS协议或其他安全协议的时候，这个cookie才能被携带。

```js
document.cookie = "username=cfangxu; secure"
```

*然而，保密or敏感信息永远不要在cookie 中存储或传输，因为整个机制从本质上来说都是不安全的*

设置secure，只保证 cookie 与服务器之间的*数据传输过程*加密，而保存在本地的 cookie文件并不加密。就算设置了secure ，也并不代表别人不能看到你机器本地保存的 cookie 。机密且敏感的信息绝不应该在 cookie 中存储或传输，因为 cookie 的整个机制原本都是不安全的 

**注意：**非安全站点（http:）已经不能再在 cookie 中设置 secure 指令了（在http协议的网页中，是无法设置secure类型cookie的）

## HttpOnly

这个选项用来设置是否能通过 js 去访问cookie。

设置了 HttpOnly 属性的 cookie， （*不能使用js的相关接口访问cookie*）不能使用 JavaScript 经由  [`Document.cookie`](https://developer.mozilla.org/zh-CN/docs/Web/API/Document/cookie) 、[`XMLHttpRequest`](https://developer.mozilla.org/zh-CN/docs/Web/API/XMLHttpRequest) 和  [`Request`](https://developer.mozilla.org/zh-CN/docs/Web/API/Request) APIs 进行访问，以防范跨站脚本攻击（[XSS (en-US)](https://developer.mozilla.org/en-US/docs/Glossary/Cross-site_scripting)）。

***

默认情况下，cookie不会带httpOnly选项(即为空)，所以默认情况下，客户端是可以通过js代码去访问（包括读取、修改、删除等）这个cookie的。当cookie带httpOnly选项时，客户端则无法通过js代码去访问（包括读取、修改、删除等）这个cookie。 

**在客户端是不能设置一个httpOnly类型的cookie的，只能在服务器端来设置； (而secure可以在客户端设置)**

~~~js
document.cookie = "username=cfangxu; httpOnly" // 错误 ！！！！！！
~~~



## cookie的编码

cookie其实是个字符串，但这个字符串中*等号、分号、空格*被当做了特殊符号。所以当cookie的 key 和 value 中含有这3个特殊字符时，需要对其进行额外编码，一般会用escape进行编码，读取时用unescape进行解码；

当然也可以用`URL`编码： **encodeURIComponent/decodeURIComponent**或者encodeURI/decodeURI，[查看关于编码的介绍](http://www.cnblogs.com/season-huang/p/3439277.html)

```js
document.cookie = encodeURIComponent("test") + "=" + encodeURIComponent("myCookie") + "; max-age=3600";
```



## 缺点

- 安全性：由于cookie在HTTP中是明文传递的，其中包含的数据都可以被他人访问，可能会被篡改、盗用。
- 大小限制：cookie的大小限制在4KB左右，若要做大量存储显然不是理想的选择
- 增加流量：cookie每次请求都会被自动添加到Request Header中，无形中增加了流量。cookie信息越大，对服务器请求的时间也越长。
- ﻿因此要**慎用**cookie，不要在cookie中存储重要和敏感的数据。



# cookie 和 session

- **存储位置不同：**`cookie`是保存在浏览器端，`session`是保存在服务器上。

- **存储方式不同：**`cookie`是保存字符串，`session`是保存对象。

- **安全性不同：**`cookie`是保存在浏览器端，如果不加密，很容易被获取到。`session`是保存在服务器上的，相对安全一些。

- **有效期限不同：**`cookie`是可以设置缓存时间的，用户可以手动清除，`session`在浏览器关闭的时候就会清空掉。

- **对服务器的压力不同：**`cookie`保管在客户端，不占用服务器资源。假如并发阅读的用户十分多，`cookie`是很好的选择。
   `session`是保管在服务器端的，每个用户都会产生一个`session`。假如并发访问的用户十分多，会产生十分多的`session`，耗费大量的内存。

  

# localStorage

## api

`storage.removeItem(keyName);`方法： 接受一个键名作为参数，会从给定的Storage对象中删除该键名。

~~~js
 localStorage.clear() // (清除所有的值) 

 localStorage.removeItem('keyName')  // (移除) 

 localStorage.setItem("key","value")  // (设置)  
 localStorage.key="value"; 
  
 localStorage.getItem("key"); //  (读取)
 localStorage.key; // 读取所有键名；返回值： 所有键名构成的数组

 localStorage.length        // 获取所有键值对的数量

 localStorage.valueOf()  // (获取所有的值) 

// (获取所有的key) 
 for(var key in localStorage){ console.log(key); } 


~~~

## 特点

- 生命周期：持久化的本地存储，除非主动删除数据，否则数据是永远不会过期的。
- 存储的信息在**同一域中**是共享的。
- 当本页操作（新增、修改、删除）了localStorage的时候，本页面不会触发storage事件,但是别的页面会触发storage事件。
- 大小：据说是5M（跟浏览器厂商有关系）
- localStorage本质上是对字符串的读取，如果存储内容多的话会消耗内存空间，会导致页面变卡
- localStorage受同源策略的限制























