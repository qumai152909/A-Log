// 1, URL参数转为对象
let url = 'https://www.cc.com?age=22&name=Anny#time=2321';

function parseUrlToObj(url) {
  let nUrl = url || (window.location.href + '');
  let obj = {};
  if (nUrl.indexOf('#') > -1) {
    nUrl = nUrl.replace(/#\S*/g, ''); // https://www.cc.com?age=22&name=Anny=2321
    console.log('nUrl----1: ', nUrl);
  }
  if (url.indexOf('?') > -1) {
    nUrl = nUrl.replace(/\S*\?/g, ''); // age=22&name=Anny
    console.log('nUrl----2: ', nUrl);
  }
  console.log(nUrl.split('&')); // [ 'age=22', 'name=Anny' ]
  nUrl.split('&').forEach(v => {
    const item = v.split('=');
    if (item.length >= 2) {
      obj[item[0]] = decodeURIComponent(item[1]); // { age: '22', name: 'Anny' }
    }
  });
}
parseUrlToObj(url); // { age: '22', name: 'Anny' }


// 2, 获取URL地址中的指定键值
// [^xyz] : 取反， 匹配未包含的任意字符
// * ： 0次或多次
// 'https://www.cc.com?age=22&name=Anny#time=2321';

function getQuery(key, url) {
  let nurl = url || (window.location.href + '');
  if (nurl.indexOf('#') > -1) {
    nurl = nurl.substring(0, nurl.indexOf('#')); // https://www.cc.com?age=22&name=Anny
  }
  let queryReg = new RegExp('(\\?|&)' + key + '=([^&]*)(&|$)');
  
  const result = nurl.match(queryReg);
  return result[2];
}
console.log('get url query: ', getQuery('age', url));


