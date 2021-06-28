function setCookie(name, value, expireDays) {
  const newDays = new Date().getDate() + expireDays;
  const newDate = new Date();
  newDate.setDate(newDays);
  
  console.log(newDays); // 31
  console.log(newDate); // 2021-07-01T11:25:55.575Z
  console.log(newDate.toUTCString()); // Thu, 01 Jul 2021 11:25:55 GMT
  console.log(encodeURIComponent(value));
  
  document.cookie = `${name}=${encodeURIComponent(value)}` + (!expireDays ? '' : `;expires=${newDate.toUTCString()}`);
}

setCookie('name', '孙莹莹', 5);


function getCookie(key) {
  const cookies = document.cookie; // 1.获取本地cookie字符串  字符串key=value;...
  const arr = cookies.split(';');  // 2.字符串转数组: ["username=aa22%E5%BC%A0%E4%B8%8966", " password=123"]
  
  for(let i = 0; i < arr.length; i++) {
    const newArr = arr[i].trim().split('='); // 3, 数组的每一项转数组 [key,value], [username,aa22%E5%BC%A0%E4%B8%8966],...

    if(key === newArr[0]){  // 4.获取参数key  key==newArr[0] 输出newArr[1]
      return decodeURIComponent(newArr[1]);//中文解码
    }
  }
}
