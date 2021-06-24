const inquirer = require('inquirer')
const chalk = require('chalk')

module.exports = () =>
  new Promise((resolve) => {
    inquirer
      .prompt([
        {
          type: 'input',
          name: 'confirm',
          message: `${chalk.bgRed('正在使用分支进行上线，此功能存在较大风险，请务必与你的leader确认。')}\n ${chalk.blue(
            '输入(yes|no)继续或取消: '
          )}`,
          validate(val) {
            if (val === 'yes') {
              return true
            } else {
              process.exit()
            }
          }
        }
      ])
      .then(() => {
        resolve()
      })
  })
