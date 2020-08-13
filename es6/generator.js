function* gen() {
  yield 10;
  let x = yield 'foo';
  yield x;
}

const genObj = gen(); // 返回一个有next方法的对象
console.log(genObj.next()); // 返回一个对象：{ value: 10, done: false }
console.log(genObj.next()); // { value: 'foo', done: false }
console.log(genObj.next(66)); // { value: 66, done: false }
console.log(genObj.next()); // { value: undefined, done: true }


console.log('***************');

function* anotherGen(i) {
  yield i + 1;
  yield i + 2;
}
function* gen2(j) {
  yield j;
  yield* anotherGen(j); // // 移交执行权给另一个函数
  yield j + 10;
}
let genObj2 = gen2(10);
console.log(genObj2.next()); // { value: 10, done: false }
console.log(genObj2.next()); // { value: 11, done: false }
console.log(genObj2.next()); // { value: 12, done: false }
console.log(genObj2.next()); // { value: 20, done: false }
console.log(genObj2.next()); // { value: undefined, done: true }


