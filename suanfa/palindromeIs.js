// https://ac.nowcoder.com/discuss/292850
// 微软面试100题之后
//Longest palindromic substring
//回文的左边是右边的镜像
//（情况1）如“dacabacad”中有三个回文。整体是第一个，左侧“aca”是第二个，右侧“aca”是三个。可总结规律：如果一个回文串中有三个回文子串（包括自身），且小回文串没有触碰到大回文的边界，那么其中两个小回文串长度相等。
//对于偶数长度的回文，回文中心在中间两个字母之间。

/*
回文，英文palindrome，指一个顺着读和反过来读都一样的字符串，垂直轴对称，比如madam、我爱我
那么，我们的第一个问题就是：判断一个字串是否是回文？
 解法1
 同时从字符串头尾开始向中间扫描字串，如果所有字符都一样，那么这个字串就是一个严格意义上的回文。
 采用这种方法的话，我们只需要维护头部和尾部两个扫描指针即可。
 
 解法2
 上述解法一从两头向中间扫描，那么是否还有其它办法呢？我们可以先从中间开始、然后向两边扩展查看字符是否相等。
 
 解法3
 翻转字符串，然后将翻转后的字符串与原始字符串比较
 
 解法4
 将字符串分成两部分，将第二部分字符串翻转，比较第一部分字符串和翻转后的第二部分字符串
 注意在将字符串分割成两半的时候，由于字符串长度可能为奇数或者偶数，所以我们使用//的取整除法，就可以得到每一半的长度。
 */

/*
 解法1
 同时从字符串头尾开始向中间扫描字串，如果所有字符都一样，那么这个字串就是一个严格意义上的回文。
 采用这种方法的话，我们只需要维护头部和尾部两个扫描指针即可。
 */
function isPalindrome1(str) {
  for(let i= 0, j = str.length - 1; i < j; i++, j--) {
    if(str.charAt(i) !== str.charAt(j)) {
      return false;
    }
  }
  return true;
}
function isPalindrome12(str, sIdx, eIdx) {
  let i = sIdx ? sIdx : 0;
  let j = eIdx ? eIdx : str.length - 1;
  while (i < j) {
    if (str.charAt(i) !== str.charAt(j)) {
      return false;
    }
    i++;
    j--;
  }
  return true;
}
console.log(11, isPalindrome12('abba')); // true
console.log(12, isPalindrome12('aa893raa')); // false
console.log(13, isPalindrome12('acaca')); // true

/*
 解法3
 翻转字符串，然后将翻转后的字符串与原始字符串比较。如果相等，那么这个字串就是一个严格意义上的回文。
 reverse(): 将数组中元素的位置颠倒，并返回该数组。数组的第一个元素会变成最后一个，数组的最后一个元素变成第一个。该方法会改变原数组。
 这种方法方便，但是效率不高，字符串分割，倒置，聚合都需要很多额外的操作。
 */
function isPalindrome3(str){
  return str === str.split("").reverse().join("");
}
console.log(31, isPalindrome3('sab'));
console.log(32, isPalindrome3('ababa'));

/*

给定一个非空字符串 s，最多删除一个字符。判断是否能成为回文字符串。

示例 1:
  输入: "aba"
  输出: True
  
示例 2:
  输入: "abca"
  输出: True
  
解释: 你可以删除c字符。

注意:  字符串只包含从 a-z 的小写字母。字符串的最大长度是50000。

思路：
 以"abdda"这个串为例，此时i指向'b'，j指向'd'，发现不对了。
 但是有一次删除的机会，我们自己写几个case其实就能发现，
 此时子串范围为(i+1, j)或(i, j-1)的俩子串只要有任意一个是回文串，则结果就是回文串，否则就不是。
 
思路简单化：
 判断是否是回文串，用「双指针」肯定没错：
    设置头尾指针，如果指向的字符相同，则指针内移，继续检查。
    如果指向的字符不同，还不能判死刑，看看能否通过删一个字符（要么删左指针指向的字符，要么删右指针指向的字符），
    判断剩下的字串是否是回文串，如果是就是
 写一个判断回文串的辅助函数 isPali，去判断「删去一个字符后」的子串，是否是回文串。
*/
const validPalindromeDel = function (str) {
  let l = 0;
  let r = str.length - 1; // 头尾指针
  
  while (l < r) {
    if (str[l] !== str[r]) { // 指向的字符不一样，还不能死刑
      return isPalindrome12(str, l + 1, r) || isPalindrome12(str, l, r - 1); //转为判断删掉一个字符后，是否回文
    }
    l++;
    r--;
  }
  return true;
};
console.log('del-1:  ', validPalindromeDel('admma')); // true
console.log('del-2:  ', validPalindromeDel('admccma')); // true
console.log('del-3:  ', validPalindromeDel('admbcma')); // false
