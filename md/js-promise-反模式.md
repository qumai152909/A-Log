# 反模式

https://zhuanlan.zhihu.com/p/29783901

## **重回回调地狱**

当我第一次从回调函数转到 Promise 时，发现很难摆脱一些旧习惯，仍像使用回调函数一样嵌套 Promise：

```js
api.getItem(1)
  .then(item => {
    item.amount++;
    api.updateItem(1, item)
      .then(update => {
        api.deleteItem(1)
          .then(deletion => {
            console.log('done!');
          })
      })
  })
```

这种嵌套是完全没有必要的。有时，一两层嵌套可以帮助组合相关任务，但是最好总是使用 .then() 重写成 Promise 垂直链 。

## **返回缺失**

我遇到的一个经常会犯的错误是在一个 Promise 链中忘记 return 语句。你能发现下面的 bug 吗？

```js
api.getItem(1)
  .then(item => {
    item.amount++;
    api.updateItem(1, item); // 缺少返回promsise
  })
  .then(update => {
    return api.deleteItem(1);
  })
  .then(deletion => {
    console.log('done!');
  })
```

因为我们没有在第4行的 api.updateItem() 前面写 return，所以所在then() 代码块会立即 resolove，导致 api.deleteItem()可能在 api.updateItem() 完成之前就被调用。

在我看来，这是 ES6 Promise 的一个大问题，往往会引发意想不到的行为。**问题是， .then() 可以返回一个值，也可以返回一个新的 Promise，undefined 完全是一个有效的返回值。*

就个人而言，如果我负责 Promise API，我会在 .then() 返回 undefined 时抛出运行时错误，但现在我们需要特别注意 return 创建的 Promise。

## **多次调用 .then()**

根据规范，在同一个 Promise 上多次调用 then() 是完全有效的，并且回调将按照其注册顺序被调用。但是，我并未见过需要这样做的场景，并且在使用返回值和错误处理时可能会产生一些意外行为：

```js
// 1，反模式：在同一个promise上，多次调用then()
let p = Promise.resolve('a');

p.then(_ => 'b');

p.then(result => {
  console.log(result) // 'a' 完全不会看到‘b’值
})

// *****************************************

let q = Promise.resolve('a');
q = q.then(_ => 'b');
q = q.then(result => {
  console.log(result) // 'b'
})
```

在这个例子中，因为我们在每次调用 then() 不更新 p 的值，所以我们看不到 'b' 返回。

但是每次调用 then() 时更新 q，所以其行为更可预测。

这也适用于错误处理：

```js
let p = Promise.resolve();
p.then(_ => {throw new Error("whoops!")})
p.then(_ => {
  console.log('hello!'); // 'hello!'
})

let q = Promise.resolve();
q = q.then(_ => {throw new Error("whoops!")})
q = q.then(_ => {
  console.log('hello'); // We never reach here
})
```

在这里，我们期望的是抛出一个错误来打破 Promise 链，但由于没有更新 p 的值，所以第二个 then() 仍会被调用。

## **混合使用回调和 Promise**

很容易进入一种陷阱，在使用基于 Promise 库的同时，仍在基于回调的项目中工作。**始终避免在 then() 或 catch() 使用回调函数 ，否则 Promise 会吞噬任何后续的错误**，将其作为 Promise 链的一部分。例如，以下内容看起来是一个挺合理的方式，使用回调函数来包装一个 Promise：

```js
function getThing(callback) {
  api.getItem(1)
    .then(item => callback(null, item))
    .catch(e => callback(e));
}

getThing(function(err, thing) {
  if (err) throw err;
  console.log(thing);
})
```

这里的问题是，如果有错误，我们会收到关于“Unhandled promise rejection”的警告，即使我们添加了一个 catch() 代码块。这是因为，callback() 在 then() 和 catch() 都会被调用，使之成为 Promise 链的一部分。



**如果必须使用回调来包装 Promise，可以使用 setTimeout （或者是 NodeJS 中的 process.nextTick）来打破 Promise：**

```js
function getThing(callback) {
  api.getItem(1)
    .then(item => setTimeout(_ => callback(null, item)))
    .catch(e => setTimeout(_ => callback(e)));
}

getThing(function(err, thing) {
  if (err) throw err;
  console.log(thing);
})
```

## **不捕获错误**

JavaScript 中的错误处理有点奇怪。虽然支持熟悉的 try/catch 范例，但是没有办法强制调用者以 Java 的方式处理错误。然而，使用回调函数，使用所谓的“errbacks”，即第一个参数是一个错误回调变得很常见。这迫使调用者至少承认错误的可能性。例如，fs库：

```js
fs.readFile('index.html', 'utf8', (err, data) => {
  if (err) throw err;
  console.log(data);
})
```

使用 Promise，又将很容易忘记需要进行错误处理，特别是对于敏感操作（如文件系统和数据库访问）。目前，如果没有捕获到 reject 的 Promise，将在 NodeJS 中看到非常丑的警告：

```text
(node:29916) UnhandledPromiseRejectionWarning: Unhandled promise rejection (rejection id: 1): Error: whoops!
(node:29916) DeprecationWarning: Unhandled promise rejections are deprecated. In the future, promise rejections that are not handled will terminate the Node.js process with a non-zero exit code.
```

确保在主要的事件循环中任何 Promise 链的末尾添加 catch() 以避免这种情况。





## 断掉的promise链

先看一段[代码](http://www.fly63.com/tag/代码):

```js
    function anAsyncCall() {
        var promise = doSomethingAsync();
        promise.then(function() {
            somethingComplicated();
        })
        
        return promise;
    }
```

这种写法的问题是当somethingComplicated方法中抛出错误无法被捕获。Promise应当是链式的，每次调用then()方法后都会返回一个新的promise。

上面的[代码](http://www.fly63.com/tag/代码)中，你最后返回的是第一个promise, 而非这个promise调用then()方法后的结果，那么promise链也随即断掉。

To Fix:

```js
    function anAsyncCall() {
        var promise = doSomethingAsync();
        return promise.then(function() {
            somethingComplicated()
        });   
}
```























