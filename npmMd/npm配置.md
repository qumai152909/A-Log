## 1.查看原本的镜像地址

**查看原本的镜像地址**

```
npm get registry
```

## 2.设置镜像地址

**设置镜像地址**

```
npm config set registry http://registry.m.jd.com/
npm config set registry http://registry.npm.taobao.org/
npm config set registry https://registry.npmjs.org
```

## 3.安装nrm

**安装nrm**

```
npm install -g nrm
```

## 4.使用nrm

**使用nrm**

```
// 查看所有的源
nrm ls
// 切换源
nrm use taobao
```



## 5.常用相关npm源头

**相关npm源**

```
npm -------- https://registry.npmjs.org/
yarn ------- https://registry.yarnpkg.com/
cnpm ------- http://r.cnpmjs.org/
taobao ----- https://registry.npm.taobao.org/
nj --------- https://registry.nodejitsu.com/
npmMirror -- https://skimdb.npmjs.com/registry/
edunpm ----- http://registry.enpmjs.org/
jdnpm ------ http://registry.m.jd.com/
jrnpm ------ http://npm.cbpmgt.com/
```

## 6, n管理多个node版本

> 安装的node在`/usr/local/n/versions/node/`文件夹下

### 安装 n

```ruby
$ npm install -g n

npm uninstall n -g # 卸载n
```

### 安装指定版本node

```ruby
$ n 版本号   

sudo n 12.22.1 # 安装指定版本
```

### 列出Node 版本

```ruby
$ n ls  # 列出所有的Node版本

n ls-remote # 列出最新的版本

n ls-remote 11  # 列出11.x的版本
```

### 下载最新版本

```ruby
$ n latest
```

### 删除某个版本

```ruby
$ n rm 4.4.4 
```

###  查看当前 node 版本

```ruby
$ node -v
```

### 以指定的版本来执行脚本

```php
$ n use 7.4.0 index.js
```







