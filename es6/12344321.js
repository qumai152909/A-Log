/*
题目1:
  用 JavaScript 写一个函数，输入 int 型，返回整数逆序后的字符串。
  如：输入整型 1234，返回字符串“4321”。要求必须使用递归函数调用，不能用全局变量，
  输入函数必须只有一个参数传入，必须返回字符串。
*/

// 解法1： 不符合要求
function reverseNum(num) {
  let numStr = `${num}`;
  return numStr.split('').reverse().join('');
}
console.log(reverseNum(230));


// 解法2： 符合要求

/*
  思路：
    用%10来取最后一位，用/10来减少位数
*/

function reverseNum2(n){
  return n ? (n % 10 + reverseNum2(Math.floor((n / 10)))) : ''
}
console.log(reverseNum2(1123));
