require('console.table')
const path = require('path')
const { roots } = require('../utils/paths')
const packageFile = require(path.join(roots, 'package.json'))
const run = require('../utils/run')
const chalk = require('chalk')
console.log('[@liepin/modules]版本号检查...')

let modules = Object.keys(packageFile.dependencies).filter((key) => key.startsWith('@liepin'))

;(async () => {
  if (modules.length > 0) {
    let ret = await run(`cnpm outdated ${modules.join(' ')}`, { stdio: false })
    ret = ret.stdout

    if (ret) {
      let retJson = toJson(ret)
      let todo = []
      let delay = []
      retJson.forEach(v => {
        if (v.current !== v.wanted) {
          todo.push(v)
        } else {
          delay.push(v)
        })
      })
      if (todo.length > 0) {
        console.log('')
        console.log(chalk.bgRed(' [@liepin/modules]依赖模块有新版本, 正在自动更新, 如不想自动更新, 请写死版本 '))
        console.log('')
        console.table(todo)
        for (let v of todo) {
          console.log(`正在更新${v.package}`
          await run(`npm update ${v.package}`)
          console.log('')
        }
      }
      if (delay.length > 0) {
        console.log('')
        console.log(chalk.bgRed(` [@liepin/modules]依赖模块有新版本, 与你的leader确认是否需要升级 `))
        console.table(delay)
      }
    }
  }
  console.log('[@liepin/modules]检测完毕, 开始编译')
})()

function toJson(str) {
  let arr = str.match(/[^\n\r]+/gi) || [];
  if (arr.length === 0) return;
  arr.shift();
  return arr.map(v => {
    let _arr = v.match(/[^\s]+/gi) || [];
    return {
      package: _arr[0],
      current: _arr[1],
      wanted: _arr[2],
      latest: _arr[3]
    }
  });
}


