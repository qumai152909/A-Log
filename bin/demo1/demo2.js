const fs = require('fs');
const resolvePath = require('path').resolve;

const inputPromise = require('../utils/inputPromise.js');

function demo2() {
  const jackon = {};
  
  inputPromise('请输入姓名：')
    .then(name => {
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
      process.stdin.pause();
  
  
      const fpath = resolvePath(__dirname, '../data/demo2.json');
  
      fs.writeFile(fpath, JSON.stringify(jackon), 'utf8', err => {
        if (err) {
          throw err;
        }
      });
    })
    .catch(err => console.log(err.message));
}

module.exports = demo2;
