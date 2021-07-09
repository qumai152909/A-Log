# path.basename()

`path.basename(path[, ext])`

参数：

​		path： 字符串类型

​		ext： 字符串类型

`path.basename()` 方法返回 `path` 的最后一部分，类似于 Unix `basename` 命令。 尾随的目录分隔符被忽略，见 [`path.sep`](http://nodejs.cn/api/path.html#path_path_sep)。

```js
path.basename('/foo/bar/baz/asdf/quux.html');
// 返回: 'quux.html'

path.basename('/foo/bar/baz/asdf/quux.html', '.html');
// 返回: 'quux'

path.win32.basename('C:\\foo.html', '.html');
// 返回: 'foo'

path.win32.basename('C:\\foo.HTML', '.html');
// 返回: 'foo.HTML'
```