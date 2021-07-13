# demo1

即使是一个已经变成 resolve 状态的 Promise，传递给 `then()` 的函数也总是会被异步调用：

```js
Promise.resolve().then(() => console.log(2));

console.log(1); 
//结果： 1, 2
```

# demo2

传递到 `then()` 中的函数被置入到一个微任务队列中，而不是立即执行，这意味着它是在 JavaScript 事件队列的所有运行时结束了，且事件队列被清空之后，才开始执行：

```js
const wait = ms => new Promise(resolve => setTimeout(resolve, ms));

wait().then(() => console.log(4));

Promise.resolve().then(() => console.log(2)).then(() => console.log(3));

console.log(1);

// 1, 2, 3, 4
```

# demo3

加载图片：

~~~js
 function imgLoad(url) {

   return new Promise(function(resolve, reject) {
     
      var request = new XMLHttpRequest();
      request.open('GET', url);
      request.responseType = 'blob';
      
      request.onload = function() {
        if (request.status === 200) {
          resolve(request.response);
        } else {
          reject(Error('Image didn\'t load successfully; error code:' + request.statusText));
        }
      };
      request.onerror = function() {
          reject(Error('There was a network error.'));
      };
      // Send the request
      request.send();
    });
  }

  var body = document.querySelector('body');
  var myImage = new Image();
  
  imgLoad('myLittleVader.jpg').then(function(response) {
    var imageURL = window.URL.createObjectURL(response);
    myImage.src = imageURL;
    body.appendChild(myImage);
  }, function(Error) {
    console.log(Error);
  });
~~~











