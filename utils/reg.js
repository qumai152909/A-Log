/* 正则 */

// 1， 括号--分组
let str1 = 'ababa abbb ababab';

let regex1 = /(ab)+/g; // 全局，返回的信息少  [ 'abab', 'ab', 'ababab' ]
let regex2 = /(ab)+/; // 非全局，细节多 ['abab','ab',index: 0,input: 'ababa abbb ababab',groups: undefined]
console.log(str1.match(regex1));
console.log(str1.match(regex2));


// 2, 括号 -- 引用分组
let regex3 = /(\d{4})-(\d{2})-(\d{2})/; // \d ：匹配一个数字字符； {n}: 匹配n次
let string2 = '2017-06-12';
console.log( string2.match(regex3) ); // ['2017-06-12', '2017','06','12',index: 0,'2017-06-12']

// 3, 把yyyy-mm-dd格式，替换成mm/dd/yyyy怎么做？
// $n: 第n个括号匹配的结果 ($1至$9来获取)
let string4 = "2017-06-12";
let regex4 = /(\d{4})-(\d{2})-(\d{2})/;
let result4 = string4.replace(regex4, '$2/$3/$1'); // 06/12/2017
let result41 = string4.replace(regex4, '$1年$2月$3日'); // 2017年06月12日
console.log(result4, result41);

// 4, 反向引用
let string5 = '2017-06-12';
let string51 = '2017/06/12';
let string52 = '2017.06.12';
let regex5 = /\d{4}(-|\/|\.)\d{2}\1\d{2}/; // \1 = (-|\/|\.)
console.log(regex5.test(string5)); // true
console.log(regex5.test(string51)); // true
console.log(regex5.test(string52)); // true

// 5, 将每个单词的首字母转换为大写："my name is syy"
// \s	匹配任何空白字符 ; \w	匹配包括下划线的任何单词字符
function firstUp(str) {
  return str.toLowerCase().replace(/(^|\s)\w/g,  function(c) {
    console.log(c.toUpperCase());
    return c.toUpperCase();
  });
}
console.log('首字母转换为大写', firstUp('my name is syy')); // My Name Is Syy

// 6, 反向引用 匹配成对标签
// /<([^>]+>)[\d\D]*<\/\1/.test("<p>laoyao bye bye</p>”); // true
let result6 = /<([^>]+>)[\d\D]*<\/\1/.test('<p>laoyao bye bye</p>'); // 反向引用: p>
console.log(result6); // true



