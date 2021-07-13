https://juejin.cn/post/6844904077537574919 要就来45道Promise面试题一次爽到底(1.1w字用心整理)

https://zhuanlan.zhihu.com/p/99201300 [面试题]实现Promise.all

https://segmentfault.com/a/1190000039775255  [记得有一次面试被虐的题，Promise 完整指南](https://segmentfault.com/a/1190000039775255)

https://segmentfault.com/a/1190000022277560  [挑战大厂第2篇-手动实现promise.all](https://segmentfault.com/a/1190000022277560)

https://github.com/yygmind/blog/issues/43  前端 100 问：能搞懂80%的请把简历给我

 **[ Daily-Interview-Question](https://github.com/Advanced-Frontend/Daily-Interview-Question)**

https://segmentfault.com/t/javascript/questions 技术问答

https://ac.nowcoder.com/discuss/292850 leetcode 高频算法题目

# 状态

个 `Promise` 必然处于以下几种状态之一：

- *待定（pending）*: 初始状态，既没有被兑现，也没有被拒绝。
- *已兑现（fulfilled）*: 意味着操作成功完成。
- *已拒绝（rejected）*: 意味着操作失败。

**一旦状态改变，就不会再变**

# 基本语法

如果函数 `createAudioFileAsync()` 被重写为返回 Promise 的形式，那么我们可以像下面这样简单地调用它：

```js
const promise = createAudioFileAsync(audioSettings); // 返回一个 Promise 对象，使得你可以将你的回调函数绑定在该 Promise 上
promise.then(successCallback, failureCallback);
```

或者简写为：

```js
createAudioFileAsync(audioSettings).then(successCallback, failureCallback);
```

我们把这个称为 *异步函数调用*，这种形式有若干优点，下面我们将会逐一讨论。

# 创建Promise 🍓

**创建一个promise对象**

```js
const myFirstPromise = new Promise((resolve, reject) => {
  // ?做一些异步操作，最终会调用下面两者之一:
  //
  //   resolve(someValue); // fulfilled
  // ?或
  //   reject("failure reason"); // rejected
});
```

**想要某个函数拥有promise功能，只需让其返回一个promise即可。**

~~~js
function myAsyncFunction(url) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", url);
    xhr.onload = () => resolve(xhr.responseText);
    xhr.onerror = () => reject(xhr.statusText);
    xhr.send();
  });
};
~~~

基础示例1: 创建一个promise对象

~~~js
let myFirstPromise = new Promise(function(resolve, reject){
    //当异步代码执行成功时，我们才会调用resolve(...), 当异步代码失败时就会调用reject(...)
    //在本例中，我们使用setTimeout(...)来模拟异步代码，实际编码时可能是XHR请求或是HTML5的一些API方法.
    setTimeout(function(){
        resolve("成功!"); //代码正常执行！
    }, 250);
});

myFirstPromise.then(function(successMessage){
    //successMessage的值是上面调用resolve(...)方法传入的值.
    //successMessage参数不一定非要是字符串类型，这里只是举个例子
    console.log("Yay! " + successMessage);
});
~~~

基础示例2: 创建一个promise函数

~~~js
 function imgLoad(url) {

   return new Promise(function(resolve, reject) {
      // Standard XHR to load an image
      var request = new XMLHttpRequest();
      request.open('GET', url);
      request.responseType = 'blob';
      
      request.onload = function() {
        if (request.status === 200) {
        // If successful, resolve the promise by passing back the request response
          resolve(request.response);
        } else {
        // If it fails, reject the promise with a error message
          reject(Error('Image didn\'t load successfully; error code:' + request.statusText));
        }
      };
      request.onerror = function() {
      // Also deal with the case when the entire request fails to begin with
      // This is probably a network error, so reject the promise with an appropriate message
          reject(Error('There was a network error.'));
      };
      // Send the request
      request.send();
    });
  }

  // Get a reference to the body element, and create a new image object
  var body = document.querySelector('body');
  var myImage = new Image();
  // Call the function with the URL we want to load, but then chain the
  // promise then() method on to the end of it. This contains two callbacks
  imgLoad('myLittleVader.jpg').then(function(response) {
    // The first runs when the promise resolves, with the request.response
    // specified within the resolve() method.
    var imageURL = window.URL.createObjectURL(response);
    myImage.src = imageURL;
    body.appendChild(myImage);
    // The second runs when the promise
    // is rejected, and logs the Error specified with the reject() method.
  }, function(Error) {
    console.log(Error);
  });
~~~



# new Promise

### 语法

```js
new Promise( function(resolve, reject) {...} /* executor */  )
```

- 在 executor 函数中调用 resolve 函数后，会触发 promise.then 设置的回调函数；而调用 reject 函数后，会触发 promise.catch 设置的回调函数。









# 链式调用

```js
doSomething()
.then(result => doSomethingElse(result))
.then(newResult => doThirdThing(newResult))
.then(finalResult => {
  console.log(`Got the final result: ${finalResult}`);
})
.catch(failureCallback);
```

这种方式，可以实现的关键在于以下两个Promise 固有行为特性：

- 每次你对Promise调用then，它都会创建并返回一个新的Promise，我们可以将其链接起来；
- 不管从then调用的完成回调（第一个参数）返回的值是什么，它都会被自动设置为被链接Promise（第一点中的）的完成。

~~~js

let p1 = new Promise((resolve,reject) => {
    resolve(100) // 决定了下个then中成功方法会被执行
})
// 连接p1
let p2 = p1.then(result => {
    console.log('成功1 '+result)
    return Promise.reject(1) // 返回一个新的Promise实例，决定了当前实例是失败的，所以决定下一个then中失败方法会被执行
}, reason => {
    console.log('失败1 '+ reason)
    return 200
})
// 连接p2 
let p3 = p2.then(result => {
    console.log('成功2 '+ result)
}, reason => {
    console.log('失败2 '+ reason)
})
// 成功1 100
// 失败2 1
~~~

p1执行then返回的新实例p2的状态，取决于then中哪一个方法会被执行，有以下几种情况：

- 不论是成功的方法执行，还是失败的方法执行（then中的两个方法），**凡是执行抛出了异常，则都会把实例的状态改为失败**。
- **方法中如果返回一个新的Promise实例**（比如上例中的Promise.reject(1)），返回这个实例的结果是成功还是失败，也决定了当前实例是成功还是失败。
- 剩下的情况基本上都是让实例变为成功的状态，上一个then中方法返回的结果会传递到下一个then的方法中。











# Catch的后续链式

**有可能会在一个回调失败之后，继续使用链式操作，这对于在链式操作中抛出一个失败之后，再次进行新的操作会很有用。***

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

语法：

~~~js
Promise.all([func1(), func2(), func3()])
.then(([result1, result2, result3]) => { /* use result1, result2 and result3 */ });
// [result1, result2, result3]： 返回的结果是按照Array中编写实例的顺序来
~~~

Promise.all() 方法接收一个数组作为输入【准确的说是iterable类型（注：Array，Map，Set都属于ES6的iterable类型）的输入】，

数组项的类型都是promise实例对象；

并且最后只返回一个[`Promise`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Promise)实例;

resolve回调的结果是一个数组。

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

如果参数中的**任何一个promise为reject的话**，则整个Promise.all调用会**立即终止**，并返回一个reject的新的 Promise 对象。

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
doSomething()
.then(function(result) {
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



# 优点

通过捕获所有的错误（catch），Promise 解决了回调地狱的基本缺陷。这对于构建异步操作的基础功能而言是很有必要的。

避免了地狱嵌套，让异步代码更易于阅读。





'





