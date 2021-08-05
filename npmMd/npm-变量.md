# scripts字段

npm 允许在`package.json`文件里面，使用`scripts`字段定义脚本命令：

~~~json
{
  "scripts": {
    "build": "node build.js"
  }
}
~~~

使用npm run build 命令，就可以执行脚本（执行node下面的build.js文件）

# npm run: 查看所有脚本命令

查看当前项目的所有 npm 脚本命令，可以使用不带任何参数的`npm run`命令

```text
npm run
```

# 配合使用命令

```json
"scripts": {
    "dev": "cross-env NODE_ENV=abc node src/abc.js",
    "start": "npm run dev "
 }
```

npm run dev 会去执行node服务 src目录下的abc.js文件，并可以在node环境中通过process.env.NODE_ENV 获取到abc

# DefinePlugin定义全局变量

**DefinePlugin**可以定义一些全局变量，让我们在模块当中直接使用，不用做任何声明

```js
const webpack = require('webpack');

module.exports = {
    entry: {
        app: './src/app'
    },
    output: {
        path: 'dist',
        filename: 'bundle.js'
    },
    plugins: [
        new webpack.DefinePlugin({
          'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
        })
    ]
};
```

# cross-env

如果没有用cross-env时

在linux或mac中这样定义脚本

```json
NODE_ENV=production node src/abc.js
```

window

```text
set NODE_ENV=production node build.js
```

但是不同电脑上不同的设置肯定是不行的呀，这个时候cross-env赶来救场了。

**cross-env**可以跨平台的设置和使用环境变量

#  Shell 通配符

由于 npm 脚本就是 Shell 脚本，因为可以使用 Shell 通配符。

```json
"lint": "jshint *.js"
"lint": "jshint **/*.js"
```

上面代码中，`*`表示任意文件名，`**`表示任意一层子目录。

如果要将通配符传入原始命令，防止被 Shell 转义，要将星号转义。

```json
"test": "tap test/\*.js"
```

# 执行顺序 🌻

如果 npm 脚本里面需要执行多个任务，那么需要明确它们的执行顺序。

如果是**并行执行**（即同时的平行执行），可以使用`&`符号。

```bash
npm run script1.js & npm run script2.js
```

如果是**继发执行**（即只有前一个任务成功，才执行下一个任务），可以使用`&&`符号

```js
npm run script1.js && npm run script2.js
```



https://zhuanlan.zhihu.com/p/107631483













