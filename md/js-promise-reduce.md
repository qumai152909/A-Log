https://segmentfault.com/a/1190000016832285
https://css-tricks.com/why-using-reduce-to-sequentially-resolve-promises-works/

https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/Reduce#polyfill

https://juejin.cn/post/6844903582450319373

https://zhuanlan.zhihu.com/p/90850451

https://github.com/logan70/Blog/issues/36

# 基本语法

~~~js
[func1, func2, func3].reduce((p, f) => p.then(f), Promise.resolve())
.then(result3 => { /* use result3 */ });
~~~

​	or

~~~js
let itemIDs = [1, 2, 3, 4, 5];

itemIDs.reduce((promise, itemID) => {
  return promise.then(_ => api.deleteItem(itemID));
}, Promise.resolve());
~~~

通常，我们递归调用一个由异步函数组成的数组时，相当于一个 Promise 链：

```js
Promise.resolve().then(func1).then(func2).then(func3);
```

也可以写成可复用的函数形式，这在函数式编程中极为普遍：

~~~js
const applyAsync = (acc,val) => acc.then(val);
const composeAsync = (...funcs) => x => funcs.reduce(applyAsync, Promise.resolve(x));
~~~

`composeAsync()` 函数将会接受任意数量的函数作为其参数，并返回一个新的函数，该函数接受一个通过 composition pipeline 传入的初始值。这对我们来说非常有益，因为任一函数可以是异步或同步的，它们能被保证按顺序执行：

```js
const transformData = composeAsync(func1, func2, func3);
const result3 = transformData(data);
```

在 ECMAScript 2017 标准中, 时序组合可以通过使用 `async/await` 而变得更简单：

```js
let result;
for (const f of [func1, func2, func3]) {
  result = await f(result);
}
/* use last result (i.e. result3) */
```









