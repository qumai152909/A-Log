console.log(typeof Symbol()); // symbol

let info1 = {
  name: '婷婷',
  age: 24,
  job: '公司前台',
  [Symbol('description')]: '平时喜欢做做瑜伽，人家有男朋友，你别指望了'
};
let info2 = {
  [Symbol('description')]: '这小姑娘挺好的，挺热情的，嘿嘿嘿……'
};
const target = {...info1, ...info2};
console.log(target);
console.log(Symbol('description') === Symbol('description')); // false 因为Symbol()返回值是唯一的
console.log(Object.keys(target)); // [ 'name', 'age', 'job' ]
console.log(Object.getOwnPropertySymbols(target)); // [ Symbol(description), Symbol(description) ]



