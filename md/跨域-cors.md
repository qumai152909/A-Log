

 # 参考链接

```
1， http://expressjs.com/en/resources/middleware/body-parser.html

2， https://expressjs.com/en/resources/middleware/cors.html

3, http://expressjs.com/en/api.html#app.settings.table (app set header)

4, https://segmentfault.com/a/1190000022512695 (Node设置cors,后端解决跨域问题)
```



# 方式1: 直接使用cors包

方式一: 直接使用npm里面的cors包,简单粗暴：

```js
**安装包:   npm install cors  -S**


const app=express(); // 基于node里面的express服务器

const cors=require("cors"); //我这边使用了中间件cors

app.use(cors());  // 允许所有请求跨域

// 后面的代码会引入我后端的接口,类似于一个react.js,通过express路由引入后,服务端接口配置完毕,
// 此方式太暴力, 解决了所有请求头和方式设置的繁琐问题, 缺点如何要携带cookie这种方式显然不适合
```

# 方式二: set header

 方式2:  也是基于express中间件设置, 只不过会设置具体请求头, 请求方式, 可以携带Cookie：

```js
const express = require('express')
const app = express();

app.use((req, res, next) => {
//判断路径
  if(req.path !== '/' && !req.path.includes('.')){
    res.set({
      'Access-Control-Allow-Credentials': true, //允许发送cookie
      'Access-Control-Allow-Origin': req.headers.origin || '*', //任意域名都可以访问,或者基于我请求头里面的域
      'Access-Control-Allow-Headers': 'X-Requested-With,Content-Type', //设置请求头格式和类型
      'Access-Control-Allow-Methods': 'PUT,POST,GET,DELETE,OPTIONS',//允许支持的请求方式
      'Content-Type': 'application/json; charset=utf-8'//默认与允许的文本格式json和编码格式
    })
  }
  req.method === 'OPTIONS' ? res.status(204).end() : next()
})
```



# 实践1:

```js
const cors = require('cors');

app.use(cors());

app.all('*', function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header('Access-Control-Allow-Headers', "*");
  res.header("Access-Control-Allow-Methods", "*");
  res.header("Access-Control-Allow-Credentials", true);
  next();
});
```

























