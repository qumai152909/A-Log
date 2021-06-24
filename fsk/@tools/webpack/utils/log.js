const chalk = require('chalk')

class Log {
  info(msg, align = 'center') {
    const size = 70
    const splitLine = new Array(size).fill('-').join('')
    const realLength = (data) => {
      let totalSize = 0
      for (let i = 0, len = data.length; i < len; i++) {
        if (/[^\u0000-\u00FF]/.test(data.charAt(i))) {
          totalSize += 2
        } else {
          totalSize += 1
        }
      }
      return totalSize
    }
    msg = Array.isArray(msg) ? msg : [msg]
    if (align === 'center') {
      msg = msg.reduce((a, b) => {
        const space = new Array(parseInt(size / 2 - realLength(b) / 2)).fill(' ').join('')
        return (a += `${space + b}\n`)
      }, '')
    } else {
      msg = msg.join('\n')
    }

    console.log(chalk.green(`${splitLine}\n\n${msg}\n${splitLine}\n`))
  }
  success(text) {
    console.log(chalk.greenBright(text))
  }
  warn(text) {
    console.log(chalk.yellowBright(text))
  }
  error(msg) {
    console.log(chalk.redBright(`\n${msg}\n`))
  }
}

module.exports = new Log()
