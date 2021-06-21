// https://github.com/yygmind/blog/issues/43
// https://github.com/Advanced-Frontend/Daily-Interview-Question/issues?page=2&q=is%3Aissue+is%3Aopen


// 题目描述一 : a.b.c如何转换成对象 {a:{b:{c:null}}}}

const str = 'a.b.c';
const strReverse = str.split('.').reverse();
console.log(strReverse); // [ 'c', 'b', 'a' ]

 // 解1： 简单循环
let result = {};
strReverse.forEach((i, idx) => {
  if (idx === 0) {
    result = {[i]: null};
  } else {
      result = { [i]: result }
  }
});
console.log(result);

 // 解2： reduce
let result2 = strReverse.reduce((acc, cur, idx) => {
  return { [cur]: idx === 0 ? null : acc };
}, {});
console.log(result2);

 // 解3： reduceRight
'a,b,c'.split(',').reduceRight((p,c)=>({[c]:p}),{});


 // 题目描述二 : 对象 {a:{b:{c:{}}}}}如何转换成a.b.c这种形式
 function oToStr(obj, result = []) {
  Object.keys(obj).forEach(key => {
    if (key) {
      result.push(key);
      oToStr(obj[key], result);
    }
  });
  return result.join('.');
 }
 let obj2 = {a:{b:{c:{}}}};
 console.log(oToStr(obj2), ': oToStr');
 
 

 
 // 题目描述三： 多层嵌套的对象转换成一级对象
/*
涉及知识点主要还是reduce，并有对象的遍历、函数循环等
 {
   a:{b:1,c:2},
   d:3
 }
 想转换成
 {
   b:1,
   c:2,
   d:3
 }
*/
function flatObj(obj, result = {}) {
  Object.keys(obj).forEach(i => {
    if (obj[i] && typeof obj[i] === 'object') {
      return flatObj(obj[i], result);
    } else {
      result[i] = obj[i];
    }
  });
  return result;
}
const obj = {
  a: {b: 1, c: 2},
  d: 3
};
console.log(flatObj(obj));


 // 题目描述四 : https://segmentfault.com/q/1010000040174800
/*
 将如下对象转换成数组的优雅方式
  将 const obj = { a1: 1, b1: 2, a2: 3, b2: 4 }
 转换成
 const arr = [{ a: 1, b: 2 }, { a: 3, b: 4 }]
*/

// 解1: 蠢方法
function objToArr(obj, num = 2) {
  let result = [];
  let tempNum = 0;
  let tempObj = {};
  Object.keys(obj).forEach(i => {
    if (tempNum < num) {
      if (tempNum === 0) {
        tempObj.a = obj[i];
      }
      if (tempNum === 1) {
        tempObj.b = obj[i];
      }
    } else {
      result.push(tempObj);
      tempNum = 0;
      tempObj = { a: obj[i] };
    }
    tempNum++;
  });
  result.push(tempObj);
  return result;
}
 const obj4 = { a1: 1, b1: 2, a2: 3, b2: 4, a3: 5, b3: 6 };
console.log('objToArr 4 ', objToArr(obj4));
console.log(Object.entries(obj4));

 // 解2： 优雅
 //var res = Object.values(Object.entries(obj).reduce((acc, [key, val]) => (Object.assign(acc[[key.match(/\d/)]] ||= {}, {[key.replace(/\d/, '')]: val}), acc), {}))


 
 
 
 
 
 
 
 
