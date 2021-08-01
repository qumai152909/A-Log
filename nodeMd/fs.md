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



# fs.mkdir(): 异步 创建文件夹

**可以创建层级文件夹**(NodeJS 10以后的版本) ： 异步： Asynchronously creates a directory

语法： `fs.mkdir(path[, options], callback)`

**options.recursive = true**: 即使path指定的文件夹已经存在，创建时，也不会报错；

**options.recursive = false**: 如果path指定的文件夹已经存在，创建时，会报错：

​					*Error: EEXIST: file already exists, mkdir './tmp/a/apple'*

~~~js
const fs = require('fs');


// Creates /tmp/a/apple, regardless of whether `/tmp` and /tmp/a exist.

fs.mkdir('./tmp/a/apple', { recursive: true }, (err) => {
  
  if (err) throw err;
  
});
~~~

上面代码：如果path目录已经存在，且目录中有文件，再次创建时，不会删除文件。

***

https://www.inull.cn/article/94



# fs.copyFile()

目的： *Asynchronously copies `src` to `dest`.*

语法：`fs.copyFile(src, dest[, mode], callback)`

注意：默认，**如果，dest已经存在，会被覆盖**

~~~js
import { copyFile, constants } from 'fs';

function callback(err) {
  if (err) throw err;
  console.log('source.txt was copied to destination.txt');
}

// 默认：覆盖式复制文件： destination.txt will be created or overwritten by default.

copyFile('source.txt', 'destination.txt', callback);


// By using COPYFILE_EXCL, the operation will fail if destination.txt exists.

copyFile('source.txt', 'destination.txt', constants.COPYFILE_EXCL, callback);
~~~

or

~~~js
const fs = require('fs');
const chalk = require('chalk');

function callback(err) {
  if (err) {
    console.log(chalk.redBright(err));
    throw err;
  }
  console.log(chalk.greenBright('拷贝成功： source.txt was copied to destination.txt'));
}

// 默认：覆盖式复制文件： destination.txt will be created or overwritten by default.

fs.copyFile('./bin/data/wow.txt', './tmp/wow.txt', callback);
~~~

**注意： 如果tmp文件夹不存在，则会报错：**

​					Error: ENOENT: no such file or directory, copyfile './bin/data/wow.txt' -> './tmp/wow.txt'




# 复制文件

在一行代码中复制文件的好方法：
~~~js
var fs = require('fs');

fs.createReadStream('test.log').pipe(fs.createWriteStream('newLog.log'));
~~~

在节点v8.5.0中，添加了copyFile
~~~js
const fs = require('fs');

// destination.txt will be created or overwritten by default.

fs.('source.txt', 'destination.txt', (err) => 
    
  if (err) throw err;
  console.log('source.txt was copied to destination.txt');

});
~~~

相同的机制，但这增加了错误处理：
~~~js
function copyFile(source, target, cb) {
  var cbCalled = false;

  var rd = fs.createReadStream(source);
  rd.on("error", function(err) {
    done(err);
  });
  var wr = fs.createWriteStream(target);
  wr.on("error", function(err) {
    done(err);
  });
  wr.on("close", function(ex) {
    done();
  });
  rd.pipe(wr);

  function done(err) {
    if (!cbCalled) {
      cb(err);
      cbCalled = true;
    }
  }
}
~~~

包装为promise的写法：

```js
function copyFile(source, target) {
  var rd = fs.createReadStream(source);
  var wr = fs.createWriteStream(target);
  return new Promise(function(resolve, reject) {
    rd.on('error', reject);
    wr.on('error', reject);
    wr.on('finish', resolve);
    rd.pipe(wr);
  }).catch(function(error) {
    rd.destroy();
    wr.end();
    throw error;
  });
}
```

使用async / await语法：

```js
async function copyFile(source, target) {
  var rd = fs.createReadStream(source);
  var wr = fs.createWriteStream(target);
  try {
    return await new Promise(function(resolve, reject) {
      rd.on('error', reject);
      wr.on('error', reject);
      wr.on('finish', resolve);
      rd.pipe(wr);
    });
  } catch (error) {
    rd.destroy();
    wr.end();
    throw error;
  }
}
```



# 复制文件夹

高版本的node：已经支持**fs.copyFile()**， 下面是**同步**方法：

~~~js
const fs = require('fs');


function copyFolderSync(from, to) {
    fs.mkdirSync(to); // Synchronously creates a directory
  
   // readdirSync ：Reads the contents of the directory. ['css', 'main.html']
  
    fs.readdirSync(from).forEach(element => {
      
        if (fs.lstatSync(path.join(from, element)).isFile()) {
          
            fs.copyFileSync(path.join(from, element), path.join(to, element));
          
        } else {
          
            copyFolderSync(path.join(from, element), path.join(to, element));
        }
    });
}
~~~



# 其他： 文件系统标志

http://nodejs.cn/api/fs.html#fs_file_system_flags

以下标志在 `flag` 选项接受字符串的任何地方可用。

- `'a'`: 打开文件进行追加。 如果文件不存在，则创建该文件。
- `'r'`: 打开文件进行读取。 如果文件不存在，则会发生异常。
- `'w'`: 打开文件进行写入。文件不存在则创建，存在则清空。写的时候会清空。如果不要清空要追加，需要改为a
-








# 参考链接
https://blog.csdn.net/qinlulucsdn/article/details/108608073  node 进行文件夹及文件 复制到另一个文件夹 文件内容替换



https://cloud.tencent.com/developer/article/1499011 nodejs文件操作扩展fs-extra





