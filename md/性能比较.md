# （开放题）a.b.c.d和a['b']['c']['d']，哪个性能更高 ?

别看这题，题目上每个字都能看懂，但是里面涉及到的知识，暗藏杀鸡

这题要往深处走，会涉及ast抽象语法树、编译原理、v8内核对原生js实现问题

我觉得这个题是这篇文章里最难的一道题，所以我放在了开放题中的最后一题.

## 答案：

应该是 a.b.c.d 比 a['b']['c']['d'] 性能高点；
后者还要考虑 [ ] 中是变量的情况，再者，从两种形式的结构来看，显然编译器解析前者要比后者容易些，自然也就快一点。

这个题从AST角度看就很简单了，a['b']['c']和a.b.c，转换成AST，前者的的树是含计算的，后者只是string literal，天然前者会消耗更多的计算成本，时间也更长

## 简单使用js来比较：
```js
function compare(times) {
  let a = { key: {} };
  let temp = a;
  for (let i = 0; i < times; i++) {
    let tmp = temp['key'];
    tmp['key'] = {};
    temp = tmp;
  }
  temp['key']['key'] = 'surprise';

  let d0 = new Date();
  let i = a;
  while (i['key'] !== 'surprise') {
    i = i['key'];
  }
  console.log('[] time', new Date() - d0);

  let d1 = new Date();
  let ii = a;
  while (ii.key !== 'surprise') {
    ii = ii.key;
  }
  console.log('. time', new Date() - d1);
}
```
