http://nodejs.cn/api/fs.html#fs_file_access_constants

fs.access(path[, mode], callback)
https://www.cnblogs.com/starof/p/5038300.html

# fs模块

fs模块： 对系统*文件及目录*进行读写操作。

## 同步和异步

载入模块： require('fs')；

载入的模块中，所有方法都有同步和异步两种形式；



异步方法中，回调函数的第一个参数总是留给异常参数（error），如果方法成功完成，该参数（error）为null或undefined。

**异步写法demo：**

~~~js
var fs = require('fs'); // 载入fs模块

// 异步方法: unlink
// 第二个参数：是一个回调函数
fs.unlink('/tmp/shiyanlou', function(err) {
    if (err) {
        throw err;
    }
    console.log('成功删除了 /tmp/shiyanlou');
});
~~~

**同步写法demo：**

```js
var fs = require('fs');

fs.unlinkSync('/tmp/shiyanlou'); // Sync 表示是同步方法

console.log('成功删除了 /tmp/shiyanlou');
```

同步方法执行完、并返回结果后，才能执行后续的代码。

而异步方法采用回调函数接收返回结果，可以立即执行后续代码。

# fs.readdirSync()

`fs.readdirSync(path[, options])` ： 同步方法，读取目录里的所有内容；

参数：

	path： 类型：string | URL | Buffer； 文件名或文件描述符；
	option： 类型：string | object；encoding默认为‘utf8’

返回值是一个数组；

例如src目录下结构：

~~~
---src/
		--images/
				a.png
				b.png
		--index.html		
~~~

fs.readdirSync('srcPath'); 返回值： ['images', 'index.html']

# fs.readFile(): 读取文件

语法：

~~~js
fs.readFile(filepath,[option],callback)
~~~

参数：

	filepath： 类型：string | URL | Buffer； 文件名或文件描述符；
	option： 类型：string | object；可以设置编码格式（encoding），默认值是null；...
	Callback:  (err, data) => null;   data是从文件读取数据；data的默认类型是Buffer；如果想data的类型是字符串，需要在option中设置encoding为‘utf8’ 或者 data.toString();

**demo: 异步读取文件内容：**

1， 有一个文本文件text.txt， 内容如下

```
line one
line two
```

2， 和text.txt相同目录中，有一个readfile.js，内容如下

```js
var fs = require('fs');

fs.readFile('./test.txt', function(err, data) {
    // 读取文件失败/错误
    if (err) {
        throw err;
    }
    // 读取文件成功 ： 这是原始二进制数据在缓冲区中的内容。
    console.log(data); // <Buffer 6c 69 6e 65 20 6f 6e 65 0a 6c 69 6e 65 20 74 77 6f 0a> 
 
    console.log(data.toString()); // line one  line two
});

// fs.readFile('./test.txt', 'utf8', callback);
```

readFile同步的写法就是没有回调函数：fs.**readFileSync**(filename,[options])。如下

### fs.readFileSync() :同步方法

同步方法，没有回调函数，直接返回结果：返回值类型： string or buffer

# fs.writeFile()

写入内容到文件:

~~~
fs.writeFile(file, data, [options], callback)
~~~

参数：

- file :  	类型：string | URL | Buffer； 文件名或文件描述符；
- data :       类型：String**|**buffer;     要写入的数据
- option ： 类型：string | object
  - encoding:  类型： string | null;       **默认值utf-8'**
  - flag：  类型： string；文件系统标志； 默认值‘w’ (打开文件进行写入)

- callback:  (error) => null

## 注意：

当 `file` 是文件名时，将数据异步写入文件，**如果文件已存在则替换该文件。**

当 `file` 是文件描述符时，其行为类似于直接调用 `fs.write()`（推荐）。

如果 `data` 是缓冲区（Buffer类型的数据），则忽略 `encoding` 选项。 

如果 `data` 是普通对象，则它必须具有 `toString` 方法。

如果文件不存在，会创建一个文件；

**默认值：写入时会先清空文件 **

## demo：

```js
import { writeFile } from 'fs';

writeFile('message.txt', 'Hello Node.js', 'utf8', callback);
```



```js
var fs = require('fs');

// 写入文件内容（如果文件不存在会创建一个文件）
// 写入时会先清空文件({ flag: 'w' })
fs.writeFile('./test2.txt', 'test test', function(err) {
    if (err) {
        throw err;
    }

    console.log('Saved.');

    // 写入成功后读取测试
    fs.readFile('./test2.txt', 'utf-8', function(err, data) {
        if (err) {
            throw err;
        }
        console.log(data);
    });
});
```



# fs.read()



# fs.write()



# fs.fstatSync() :同步

fs.fstatSync(fd[, options])： 同步的方法

- `fd` [](http://url.nodejs.cn/SXbo1v)

- ```
  options 
  ```

  - `bigint` [](http://url.nodejs.cn/jFbvuT) 返回的 [](http://nodejs.cn/api/fs.html#fs_class_fs_stats) 对象中的数值是否应为 `bigint`。 **默认值:** `false`。

- 返回: fs.stat

获取文件描述符的属性；

## fs.stat：提供文件信息

是一个对象；



# fs.stat()：异步

`fs.stat(path[, options], callback)`

参数： callback(err, stats)

Demo:

~~~js
import { stat } from 'fs';

const pathsToCheck = ['./txtDir', './txtDir/file.txt'];

for (let i = 0; i < pathsToCheck.length; i++) {
  stat(pathsToCheck[i], (err, stats) => {
    console.log(stats.isDirectory());
    console.log(stats);
  });
}
~~~

https://blog.csdn.net/younglao/article/details/77046830





















# 其他： 文件系统标志

http://nodejs.cn/api/fs.html#fs_file_system_flags

以下标志在 `flag` 选项接受字符串的任何地方可用。

- `'a'`: 打开文件进行追加。 如果文件不存在，则创建该文件。
- `'r'`: 打开文件进行读取。 如果文件不存在，则会发生异常。
- `'w'`: 打开文件进行写入。文件不存在则创建，存在则清空。写的时候会清空。如果不要清空要追加，需要改为a
- 



















