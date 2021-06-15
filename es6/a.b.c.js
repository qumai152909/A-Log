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

 // 解2： reduceRight
'a,b,c'.split(',').reduceRight((p,c)=>({[c]:p}),{});



 // 题目描述二 : a.b.c如何转换成对象 {a:{b:{c:null}}}}

 
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
