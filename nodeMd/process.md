process: 用于描述当前 Node.js 进程状态的对象，提供了一个与操作系统的简单接口。

# process.argv

process.argv : 返回一个数组:

 第一个元素为解释器的绝对路径；

第二个元素为当前执行的文件路径；

剩余的元素为其他命令行参数。

```js
node index.js 1991 name=chenfangxu --v "lalla"

[ '/usr/local/Cellar/node/7.9.0/bin/node',
  '/Users/cfangxu/project/demo/myNEapp/site/index.js',
  '1991',
  'name=chenfangxu',
  '--v',
  'lalla' ]
```

# process.nextTick(callback) 

异步任务，

# process.chdir()

切换工作目录到指定目录。

# process.cwd()

- 返回运行当前脚本的工作目录的路径。



# process.exit([code])

退出当前进程。

如果未提供code ，此 exit 方法要么使用'success' 状态码 0，要么使用 process.exitCode 属性值，前提是此属性已被设置。 Node.js 在所有['exit']事件监听器都被调用了以后，才会终止进程。



