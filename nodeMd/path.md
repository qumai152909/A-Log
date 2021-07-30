# path.basename()

**path.basename(path[, ext])**

参数：

​		path： 字符串类型

​		ext： 字符串类型

返回 `path` 的最后一部分，类似于 Unix `basename` 命令。 尾随的目录分隔符被忽略，见 [`path.sep`](http://nodejs.cn/api/path.html#path_path_sep)。

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

# path.join()

使用平台特定的分隔符把全部给定的 path 片段**连接**到一起，并**规范化**生成的路径。

例如：path.join('foo', 'baz', 'bar');     // 返回 'foo/baz/bar'

>注：如果连接后的路径字符串是一个长度为零的字符串，则返回 '.'，表示当前工作目录。

# path.resolve()



会把一个路径或路径片段的序列解析为一个**绝对路径**。

例如： 当前工作目录为 /home/myself/node

~~~
1、path.resolve('/foo/bar', './baz');     // 返回: '/foo/bar/baz'

2、path.resolve('/foo/bar', '/tmp/file/');     // 返回: '/tmp/file'
~~~

## join() 和 resolve()区别：

**1、join是把各个path片段连接在一起， resolve把  / 当成根目录**

path.join('/a', '/b')         // Outputs '/a/b'

path.resolve('/a', '/b')    // Outputs '/b'

**2、join直接拼接字段，resolve解析路径并返回**

path.join("a", "b1", "..", "b2")

console打印会得到"a/b2"

path.resolve("a", "b1", "..", "b2")

console打印得到"/home/myself/node/a/b2"





