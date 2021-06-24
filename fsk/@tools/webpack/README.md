## vscode

vscode 需添加以下插件

- Prettier (代码格式化)
- styled-jsx Language Server (css 私有化)
- vscode-styled-jsx (css 私有化)

## css

views 组件里的 css 需在最外层有一个作用域 id, id 名与 views 目录名一致，小写。
只有需要复用的组件才需要把样式写到组件内，组件内的样式采用`css`私有化写法,
详见[styled-jsx](https://github.com/zeit/styled-jsx)

`component`里组件一率采用私有化写法。

同时私有化写法应有固定的命名前缀 `c-`, 原因与`css`私有化的方式有关。

## 路由

路由路径统一在`router/config`里进行配置, webpack 会自动依据路由的 config 文件配置，进行分片打包。
原则上只需要分片的路由，即大页面才需要维护在 config 文件里，如果是页面内小的子路由，则应在 views 的
页面组件内使用 router-dom 设定。
config 配置中会有 hook 回调函数，用来做路由拦截，即在路由发生跳转前，进行一些操作，比如用户权限验证等。

```javascript
  {
    path: '/home',
    title: '首页',
    exact: true,
    hook(props) {
      /*
        resolve(true) 直接加载相应页面
        也可以 resolve(<Com />) 一个组件，将用来展示该组件
        同时hook也可以接收参数，参数是当前路由信息
        也可以做一个跳转  props.history.push('/about')
      */
      return new Promise((resolve) => {
        setTimeout(() => resolve(true), 2000)
      })
    },
    component: () => import(/* webpackChunkName: "Home" */ '@views/Home')
  },
```

你可以有选择性的将路由放在指定容器内，而不是整个页面。
比如，你有一个固定的菜单，不想随路由变化而变化，可以在`router/index.js`自定制

```javascript
const App = () => {
  let location = useLocation() // 通过hook获取location
  if (/^resume\/showresumedetail/.test(location.pathName)) {
    return (
      <>
        <Header type="simple" /> {/* 我是简头 不会随路由的变化而重新加载 */}
        <AsyncRouter config={config} /> {/* 我是通过config配置的路由 */}
      </>
    )
  } else {
    return (
      <>
        <Header />
        <AsyncRouter config={config} />
      </>
    )
  }
}
```

### 可使用命令

```javascript
"scripts": {
  "start": "fet-service start",         // 编译
  "start:source": "fet-service start --source",    // 编译带source-map
  "dev": "fet-service dev",             // 生成文件
  "prd": "fet-service prd"              // 发布到青龙
  "prd:test": "fet-service prd"         // 查看打包情况，只本地编译，不会发布
  "qa": "fet-service qa",               // 发布到qa
  "fix": "fet-service fix",             // 格式化代码
  "svgo": "fet-service svgOptimizer",   // 压缩svg
  "clear": "fet-service clear",         // 清理缓存
  "analyz": "npm_config_report=true fet-service analyzer",    // 打包资源分析工具
},
```

### start

最常用的命令, 编译并预览, 其中所有 ajax 请求会被代理到`webpack.config.js`里配置的后台地址上。
注意: 通过`start, dev`命令，`css`均会打包到`js`中，而不会抽出单独的`css`文件，这是因为`MiniCssExtractPlugin`与缓存插件存在冲突，所以只有在`prd`或 `prd:test`时，才会调用`MiniCssExtractPlugin`形成独立的`css`文件，如果需要测试，可通过`prd:test`方式查看`css`抽取情况。

### start:source

它的作用是在 start 基础上增加 sourcemap。用来查看源码。缺点是会降低编译速度。

可以在 webpack.config.js -> devtool 里配置 source map 的级别

[详见 devtool 官方说明](https://webpack.js.org/configuration/devtool/#devtool)

### dev

生成文件, 用于发布到 qa 环境中
通过 `npm run dev -- watch` 可实现监听功能

### prd

生成带版本号的文件并发布到青龙

### prd:test

在本地生成带版本号的文件，用来查看打包情况，不会进行发布

### qa

将资源发布到 qa, 交互界面会记住你上一次的选择。

```
npm run qa
```

注: 交互界面本来想通过发布最近修改的部份文件来缩减每次发送文件的数量，但实操后发现文件打包后引用规则的复杂性难以实现安全的判断，故只粗暴的进行类型分类, 之后这个可能是要继续优化的。

也可以直接使用命令

```
npm run qa -- 51                                         同步全部文件到qa51
npm run qa -- 51 v6/js/pages/home.js v6/js/About.js      同步指定文件到qa51
```

注: npm 命令传递参数需使用`--`

### fix

使用 prettier 以及 eslint 格式化你的代码到标准格式

### svgo

对 src 目录下所有的 svg 进行压缩。

### clear

系统在编译时使用了缓存以达到下次编译速度更快的目的, 但有些时候缓存会造成你的更改不能及时更新, 目前已知
的情况都可以自动更新缓存, 但不排除有些情况会出现问题, 当你的修改没有生效时, 通过此命令清除缓存, 再
重新编译, 同时可将问题的情况反馈到 maben@liepin.com, 以便从框架层面上去解决类似问题。

### webpack.config

对 webpack 进行配置。

#### entry

若你想增加一项活动页入口, 在 webpack.config.js 里配置为

```javascript
  entry: {
    // 'pages/*': 'pages/*/index.js' 这个是默认配置，不需要写在config.js里面
    'events/*': 'events/*/index.js'
  }
```

入口配置, 相对路径, 根路径是 src。
`key`是打包后的路径, `value`是文件路径。如果`pages`下有多个目录, 用`*`来代表。

如果想完全自定义，即覆盖默认配置， 则需使用 Function

```javascript
  // ...
  entry(defaultConfig){
    // ...
    return defaultConfig
  }
  // ...
```

### output

输出时的一些配置, 默认配置参考`node_modules/@tools/webpack/webpack/output.js`

`output`为对象时代表在默认值的基础上新增值

当`output`为函数时可覆盖默认配置, 如：

```javascript
output({config, isDevj, isPrd, isHot}){
  return config
}
```

#### devtool

生成 source-map 的方式, 需在 chrome 的 devtools 中开启 sourcemap，使用命令`npm run start:source`时, 生成 sourcemap,
可用来展示源码, 这对定位问题非常有用, 配合 react-dev-tools,
但由于 sourcemap 会极大的影响编译速度,
所以只建议在需要的时候使用
[配置项的值参考](https://webpack.js.org/configuration/devtool/#devtool)

注：需要使用命令`npm run start:source`，但这会降低你的编译速度，所以只推荐在
需要精确定位问题时使用

#### esLint

值为 true|false, 在编译时, 是否启用 eslint。

#### watchIgnored

watching 时忽略的目录, 可提高性能, 默认会忽略 node_modules 里除@liepin 下的所有文件。
默认配置

```javascript
{
  watchIgnored: ['node_modules\/(?!@liepin)', 'asset-dev', 'asset'],
}
```

#### babelLoaderInclude

babel 需要解析的目录, 同样这样儿限定也是为了提高性能。
默认只编译`@liepin`下的资源。

如果想编译其它资源

比如百川项目需要编译`@yangtuo`下的资源, 那么可以这么配置

```javascript
{
  // ...
  babelLoaderInclude: ['node_modules/@yangtuo']
  // ...
}
```

#### loader

新增`loader`

```javascript
{
  loader: [
    {
      test: /\.jpg$/,
      use: [
        {
          loader: 'file-loader',
        },
      ],
    },
  ]
}
```

修改默认`loader`, 可使用`function`的形式, 把所有配置项返回再做修改，
`loaders`代表默认`loaders`，每个`loader`会有个`key`属性，可根据`key`属性
覆盖指定`loader`。

默认`loader`配置可参考`node-modules/@tools/webpack/webpack/lib/rules.js`

```javascript
loader(loaders, isPrd, isHot, isDev){
  return loaders
}

```

#### plugins

插件，正常添加一个插件可直接在数组里增加，若想完全覆盖默认的插件配置，可通过函数进行覆盖。

```javascript
/*
  @plugins 当前编译环境下的默认配置,
  @allPlugins 为包含所有内置 plugins 的对象, 你可以根据需求进行自由拼装，然后返回。
  @isPrd,isHot,isDev 为 3 种编译环境(prd，start, dev)
*/
plugins({ plugins, isPrd, isHot, isDev, allPlugins }) {
  if (isPrd || isDev) {
    // 因为此插件会引发两次watch，所以只在生成文件时使用
    return [...plugins, new AntdDayjsWebpackPlugin()]
  }
  return [...plugins]
},
```

#### splitChunks

可设置将配置规则的内容打到一个文件中

你可以将经常用到的包合并到 common 中, 以此来避免重复打包。

同时所有以路由形式拆分打包的，都将遵循默认的 webpack 异步拆包标准。

详见 https://webpack.js.org/plugins/split-chunks-plugin/#optimizationsplitchunks

```javascript
const transfer = (arr) => new RegExp(arr.map((v) => `[\\/]node_modules[\\/]${v}`).join('|'))
// ...

// 这些是默认配置
// {
//   'polyfill-vendors': {
//     chunks: 'all',
//     test: transfer(['core-js']),
//     priority: 10,
//     name: 'polyfill-vendors',
//     enforce: true
//   },
//   'react-vendors': {
//     chunks: 'all',
//     test: transfer([
//       'react',
//       'react-dom',
//       'prop-types',
//       '@hot-loader/react-dom',
//       'react-router-dom',
//       'axios',
//       'classnames',
//       'mobx',
//       'mobx-react-lite'
//     ]),
//     priority: 10,
//     name: 'react-vendors',
//     enforce: true
//   }
// }

splitChunks: {
  commonCss: {
    chunks: 'all',
    name: 'common',
    test: /\/src\/common\/css\/index\.less/,
    enforce: true
  },
  common: {
    chunks: 'all',
    test: transfer(['dayjs', 'nprogress', 'styled-jsx']),
    name: 'common',
    enforce: true
  }
},
```

#### monitor

值为 true|false, 执行`npm run prd`时，是否发送 source-map 到前端日志监控平台。

#### devServer

对本地服务器的一些配置

- host 你后端对应的域名, 用来做 ajax 请求代理。 这个会在创建项目时, 自动填充
- feHost 这个是前端起服务所对应的域名, 默认 fet-proxy.liepin.com, 之所以是域名而不是 localhost 是为了发请求可携带 cookie
- port 项目的端口
- https 是否开启 https，liepin 端都需要开启，lietou 一般不开启
- proxy 书写自己的代理请求

```javascript
proxy: {
  '**/*.json': {
    target: `${prefix}://${host}`,
    changeOrigin: true,
    secure: false
  }
}
```

## eslint

eslint 规则请参考 https://alloyteam.github.io/eslint-config-alloy/
根目录下.eslintrc.js 为 eslint 配置文件, 通过它可实现自己想要的规则。

其中几个规则与参考不同

```javascript
//0 (off)  1(warning)  2(error)
'no-debugger': isPrd() ? 2 : 1,
'no-new': 0,
'no-param-reassign': 0,
'radix': 0,
```
