const arr = [99, 1, 8];
arr.reduce(function(actor, cur) {
  // console.log(actor, cur); // 第一次：actor=1，cur=99
  return actor + cur;
}, 1);

// 1, 累加
function sum(arra) {
  return arra.reduce((actor, cur) => actor + cur, 0);
}
console.log(sum(arr)); // 108

// 2, 累加对象数组里的值
const arr2 = [{x: 1}, {x:2}, {x:3}];
function sumObj(arra) {
  return arra.reduce((actor, cur) => actor + cur.x, 0);
}
console.log(sumObj(arr2)); // 6

// 3, 将二维数组转化为一维
const arr3 = [[0, 1], [2, 3], [4, 5]];
function flattened(arra) {
  return arra.reduce((actor, cur) => actor.concat(cur), []);
}
console.log(flattened(arr3)); // [ 0, 1, 2, 3, 4, 5 ]

// 4, 计算数组中每个元素出现的次数
const arr4 = ['Alice', 'Bob', 'Tiff', 'Bruce', 'Alice'];

function countedNames(arra) {
  return arra.reduce((actor, cur) => {
    if (cur in actor) {
      actor[cur] = actor[cur] + 1;
    } else {
      actor[cur] = 1;
    }
    return actor;
  }, {});
}
console.log(countedNames(arr4)); // { Alice: 2, Bob: 1, Tiff: 1, Bruce: 1 }


// 5, 按属性对object分类
const arr5 = [
  { name: 'Alice', age: 21 },
  { name: 'Max', age: 20 },
  { name: 'Jane', age: 20 }
];

// groupedPeople is:
// {
//   20: [
//     { name: 'Max', age: 20 },
//     { name: 'Jane', age: 20 }
//   ],
//   21: [{ name: 'Alice', age: 21 }]
// }

function groupBy(arra, property) {
  return arra.reduce((actor, cur) => {
    const key = cur[property]; // 21
    if (!actor[key]) {
      actor[key] = [];
    }
    actor[key].push(cur);
    return actor;
  }, {});
}
console.log(groupBy(arr5, 'age'));

// 6, 数组去重
let arr6 = [1,2,1,2,3,5,4,5,3,4,4,4,4];
function deDepeat(arra) {
  return arra.reduce((actor, cur) => {
    if (actor.indexOf(cur) < 0) {
      actor.push(cur);
    }
    return actor;
  }, []);
}
console.log(deDepeat(arr6)); // [ 1, 2, 3, 5, 4 ]

// 7, 按顺序运行Promise

function p1(a) { // // promise function 1
  return new Promise((resolve, reject) => {
    resolve(a * 5);
  });
}
function p2(a) {
  return new Promise((resolve, reject) => {
    resolve(a * 2);
  });
}
function f3(a) { // function 3  - will be wrapped in a resolved promise by .then()
  return a * 3;
}
const promiseArr = [p1, p2, f3];

function runPromiseInSequence(arra, input) {
  return arra.reduce((actor, cur) => actor.then(cur), Promise.resolve(input));
}
runPromiseInSequence(promiseArr, 10)
  .then(val => {
    console.log(val);
  });   // 300

// 8, 斐波那契数列 (黄金分割数列) F0=0 F1=1 Fn=F(n-1)+F(n-2)
function fibonacci(len = 2) {
  let result = [];
  function getFib_n(cur, next, n) {
    result.push(cur);
    if (n === 0) {
      return cur;
    } else {
      return getFib_n(next, cur + next, n - 1);
    }
  }
  getFib_n(0, 1, len);
  return result;
}
console.log(fibonacci(6)); // [0, 1, 1, 2, 3, 5, 8]

function fib1(len = 6) {
  const arra = new Array(len).fill(0);
  
  return arra.reduce((actor, cur, idx) => {
    if (idx >= 2) {
      actor.push(actor[idx-1] + actor[idx-2]);
    }
    return actor;
  }, [0, 1]);
}
console.log('fib2 reduce:', fib1(6)); // [ 0, 1, 1, 2, 3, 5 ]

function getFib(n) {
  function getFib_n(cur, next, n) {
    if (n === 0) {
      return cur;
    } else {
      return getFib_n(next, cur + next, n - 1);
    }
  }
  return getFib_n(0, 1, n);
}
console.log(getFib(4)); // 3

// 9, 数组的最大值，最小值 or Math.max()
let arr7 = [12, 44, 22, 65, 38, 80, 33];
function Max(arra) {
  return arra.reduce((actor, cur) => actor > cur ? actor : cur);
}
console.log('max arr7:', Max(arr7)); // 80





