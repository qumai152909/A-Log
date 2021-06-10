/*
 用两个指针，分别指向字符串的头尾节点
 如果头尾相等则 l++, r--，执行完后如果 r <= l, 则说明 s 是回文字符串，返回 true
 否则说明 s 不是回文字符串，此时我可以删除一个头节点的字符，或者尾节点的字符，再对其进行检测是否是回文字符串
 因为只能删一个字符，所以我们只能删一次，可以使用一个 flag 进行过滤
* */
const validPalindrome3 = function(s, flag = true) {
  let l = 0, r = s.length - 1;
  while (l < r && s[l] === s[r]) l++, r--;
  if (r <= l) return true;
  if (flag == true) return validPalindrome3(s.slice(l, r), false) || validPalindrome3(s.slice(l + 1, r + 1), false);
  return false;
};


const longestPalindrome2 = function(s) {
  let ans = '';
  let n = s.length;
  let dp = Array.from(new Array(n), () => new Array().fill(0));
  for(let i = n-1; i >=0; i--) {
    for(let j = i; j < n; j++) {
      dp[i][j] = s[i] === s[j] && ( j - i < 2 || dp[i+1][j-1])
      if(dp[i][j] && j - i + 1 > ans.length) {
        ans = s.substr(i,j - i + 1);
      }
    }
  }
  return ans;
};

// 解法一：暴力循环
const longestPalindrome1 = function(s) {
  let str = "";
  for(let i = 0; i < s.length; i++) {
    for(let j = i + 1; j <= s.length; j++) {
      const temp = s.slice(i, j);
      if(temp == temp.split("").reverse().join("") && temp.length > str.length) {
        str = temp;
      }
    }
  }
  return str;
};
