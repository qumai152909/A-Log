# Promise.all概念

**Promise.all()是一个并行运行 promise 数组的方法，也就是说是同时运行。**

例如，我们有一个要从磁盘读取文件的列表，使用上面创建的 readFilePromise 函数，将如下所示：

*返回一个promise对象的函数：*

~~~js
function readFilePromise(filename) {
  if (!filename) {
    return Promise.reject(new Error("Filename not specified"));
  }
  if (filename === 'index.html') {
    return Promise.resolve('<h1>Hello!</h1>');
  }
  return new Promise((resolve, reject) => {
    fs.readFile(filename, 'utf8', (err, data) => {
      if (err) reject(err);
      else resolve(data);
    });
  });
}
~~~

**并行运行：**

~~~js
let filenames = ['index.html', 'blog.html', 'terms.html'];

Promise.all(filenames.map(readFilePromise))
  .then(files => {
    console.log('index:', files[0]);
    console.log('blog:', files[1]);
    console.log('terms:', files[2]);
  })
~~~

**串行运行**

有时同时运行一堆 Promise 可能会出现问题。

比如，如果尝试使用 Promise.all 的 API 去检索一堆资源，则可能会在达到速率限制时开始响应[429错误](https://link.zhihu.com/?target=https%3A//httpstatuses.com/429)。

一种解决方案是串行运行 Promise，也就是一个接一个地运行。

但是在 ES6 中没有提供类似方法（为什么？），但我们可以使用 [Array.reduce](https://link.zhihu.com/?target=https%3A//developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/Reduce%3Fv%3Db) 来实现：

```js
let itemIDs = [1, 2, 3, 4, 5];

itemIDs.reduce((promise, itemID) => {
  return promise.then(_ => api.deleteItem(itemID));
}, Promise.resolve());

// 需要等待每次调用 api.deleteItem() 完成之后才能进行下一次调用
```

等价于：

~~~js
Promise.resolve()
  .then(_ => api.deleteItem(1))
  .then(_ => api.deleteItem(2))
  .then(_ => api.deleteItem(3))
  .then(_ => api.deleteItem(4))
  .then(_ => api.deleteItem(5));
~~~





~~~js
    function workMyCollection(arr) {
        return arr.reduce(function(promise, item) {
            return promise.then(function(result) {
                return doSomethingAsyncWithResult(item, result);
            }, q());
        });
    }
~~~









