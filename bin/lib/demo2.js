const inputPromise = require('../utils/inputPromise.js');

function demo2() {
  const jackon = {
  
  };
  
  inputPromise('请输入姓名：')
    .then(name => {
      //console.log(str);
      if (name) {
        jackon.name = name;
      }
      return inputPromise('请输入年龄：');
    })
    .then(age => {
      if (age) {
        jackon.age = age;
      }
    })
    .then(() => {
      porcess.stdin.pause();
    });
}

module.exports = demo2;
