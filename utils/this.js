// 1, bind
let obj = {
  a: 2
};
function foo(b) {
  console.log(this.a, b);
}

let bar = foo.bind(obj); // bind()返回一个新函数
bar(5); // 2, 5

// 2， bind的源码
Function.prototype.bindTwo = function( context ) {
  let self = this; // 保存原函数
  return function() { // 返回一个新的函数
    return self.apply( context, arguments );//执行新的函数的时候，会把之前传入的context当作新的函数体的this
  }
};
let obj2 = {
  name: 'sven'
};
function func2() {
  console.log ( this.name );// 输出: sven
}
const func2b = func2.bindTwo(obj2);
func2b(); // sevn


// 3， bind的实现
function bind3(fn, context) {
  return function() {
    fn.apply(context, arguments);
  }
}
let obj3 = {
  name: 'sven'
};
function foo3(c) {
  console.log ( this.name, c );
}
let bar3 = bind3(foo3, obj3);
bar3(55);  // foo3.apply(obj3, 55)
