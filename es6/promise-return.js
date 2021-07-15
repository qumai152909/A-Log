const p1 = Promise.resolve(42);

p1.then(value1 => {
  // 返回一个Promise
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(value1 + 1); // 43
    }, 3000);
  }).then(value2 => {
    console.log('value2');
    return value2 + 1; // 44
  });
}).then(value3 => console.log(value3, 'value3'));
// value2
// 44 value3
