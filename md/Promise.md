https://juejin.cn/post/6844904077537574919 要就来45道Promise面试题一次爽到底(1.1w字用心整理)

https://zhuanlan.zhihu.com/p/99201300 [面试题]实现Promise.all

https://segmentfault.com/a/1190000039775255  [记得有一次面试被虐的题，Promise 完整指南](https://segmentfault.com/a/1190000039775255)



https://segmentfault.com/a/1190000022277560  [挑战大厂第2篇-手动实现promise.all](https://segmentfault.com/a/1190000022277560)



https://github.com/yygmind/blog/issues/43  前端 100 问：能搞懂80%的请把简历给我

 **[ Daily-Interview-Question](https://github.com/Advanced-Frontend/Daily-Interview-Question)**

https://segmentfault.com/t/javascript/questions 技术问答

https://ac.nowcoder.com/discuss/292850 leetcode 高频算法题目



# Catch 的后续链式

**有可能会在一个回调失败之后继续使用链式操作，这对于在链式操作中抛出一个失败之后，再次进行新的操作会很有用。***

请阅读下面的例子：

```js
new Promise((resolve, reject) => {
    console.log('初始化');
    resolve();
})
.then(() => {
    throw new Error('有哪里不对了');

    console.log('执行「这个」”'); // 因为抛出了错误, 所以此处代码不执行
})
.catch(() => {
    console.log('执行「那个」'); // 回调失败
})
.then(() => {
    console.log('执行「这个」，无论前面发生了什么');
});

//初始化
//执行“那个”
//执行“这个”，无论前面发生了什么
```

# 异常抛出

通常，一遇到异常抛出，浏览器就会顺着 Promise 链寻找下一个 `onRejected` 失败回调函数或者由 `.catch()` 指定的回调函数。

```js
doSomething()
.then(result => doSomethingElse(result))
.then(newResult => doThirdThing(newResult))
.then(finalResult => console.log(`Got the final result: ${finalResult}`))
.catch(failureCallback);
```

和以下同步代码的工作原理（执行过程）非常相似：

```js
try {
  let result = syncDoSomething();
  let newResult = syncDoSomethingElse(result);
  let finalResult = syncDoThirdThing(newResult);
  console.log(`Got the final result: ${finalResult}`);
} catch(error) {
  failureCallback(error);
}
```

# Promise.all()

[`Promise.all()`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Promise/all) 和 [`Promise.race()`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Promise/race) 是**并行运行异步操作**的两个组合式工具。



~~~js
const promise1 = Promise.resolve(3);
const promise2 = 42;
const promise3 = new Promise((resolve, reject) => {
  setTimeout(resolve, 100, 'foo');
});

Promise.all([promise1, promise2, promise3]).then((values) => {
  console.log(values);
});
// expected output: Array [3, 42, "foo"]

~~~

Promise.all() 方法接收一个数组作为输入【准确的说是iterable类型（注：Array，Map，Set都属于ES6的iterable类型）的输入】，

数组项的类型都是promise实例对象；

并且最后只返回一个[`Promise`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Promise)实例;

输入项中，所有promise的resolve回调的结果是一个数组。

***

**我们可以发起并行操作，然后等多个操作全部结束后进行下一步操作**，如下：

```js
Promise.all([func1(), func2(), func3()])
.then(([result1, result2, result3]) => { /* use result1, result2 and result3 */ });
```

这个resolve回调执行是在*所有输入的promise的resolve回调都结束*，或者输入的iterable里没有promise了的时候。

它的reject回调执行是，只要任何一个输入的promise的reject回调执行或者输入不合法的promise就会立即抛出错误，并且reject的是第一个抛出的错误信息。

**返回值将会按照参数内的 `promise` 顺序排列，而不是由调用 `promise` 的完成顺序决定。**

## 失败：

失败/拒绝（Rejection）：
如果传入的 `promise` 列表中有一个失败（rejected），`Promise.all` 异步地将失败的那个结果给失败状态的回调函数，*而不管其它 `promise` 是否完成。*



## 实现时序组合🐎🐎🐎：

可以使用一些聪明的 JavaScript 写法实现时序组合：

```js
[func1, func2, func3].reduce((acc, cur) => acc.then(cur), Promise.resolve())
.then(result3 => { /* use result3 */ });
```

相当于一个 Promise 链：

```js
Promise.resolve().then(func1).then(func2).then(func3);
```

改进写法：写成可复用的函数形式，这在函数式编程中极为普遍：

~~~js
const applyAsync = (acc, cur) => acc.then(cur);
const composeAsync = arr => x => arr.reduce(applyAsync, Promise.resolve(x));

// composeAsync() 函数并返回一个新的函数，该函数接受一个初始值。
// 这对我们来说非常有益，因为任一函数可以是异步或同步的，它们能被保证按顺序执行：
const transformData = composeAsync(func1, func2, func3);
const result3 = transformData(data);
~~~

在 ECMAScript 2017 标准中, 时序组合可以通过使用 `async/await` 而变得更简单：

```js
let result;
for (const f of [func1, func2, func3]) {
  result = await f(result);
}
```



# 嵌套

嵌套 Promise 是一种可以限制 `catch` 语句的作用域的控制结构写法。

明确来说，嵌套的 `catch` 仅捕捉在其之前同时还必须是其作用域的 failureres，而捕捉不到在其链式以外或者其嵌套域以外的 error。

如果使用正确，那么可以实现高精度的错误修复。

```js
doSomethingCritical()
.then(result => doSomethingOptional()
  .then(optionalResult => doSomethingExtraNice(optionalResult))
  .catch(e => {console.log(e.message)}))
.then(() => moreCriticalStuff())
.catch(e => console.log("Critical failure: " + e.message));// 没有输出
```

这个内部的 `catch` 语句仅能捕获到 `doSomethingOptional()` 和 `doSomethingExtraNice()` 的失败，`之后就恢复到moreCriticalStuff()` 的运行。

重要提醒：如果 `doSomethingCritical()` 失败，这个错误仅会被最后的（外部）`catch` 语句捕获到。

# 常见错误

```js
// 错误示例，包含 3 个问题！

doSomething().then(function(result) {
  doSomethingElse(result) // 没有返回 Promise ; 以及没有必要的嵌套 Promise
  .then(newResult => doThirdThing(newResult));
}).then(() => doFourthThing());
// 最后，是没有使用 catch 终止 Promise 调用链，可能导致没有捕获的异常
```

下面是修改后的平面化的代码：

```js
doSomething()
.then(function(result) {
  return doSomethingElse(result);
})
.then(newResult => doThirdThing(newResult))
.then(() => doFourthThing())
.catch(error => console.log(error));
```

## 使用场景：

此方法在集合多个 `promise` 的返回结果时很有用。



# 优点

通过捕获所有的错误（catch），Promise 解决了回调地狱的基本缺陷。这对于构建异步操作的基础功能而言是很有必要的。

避免了地狱嵌套，让异步代码更易于阅读。





'





