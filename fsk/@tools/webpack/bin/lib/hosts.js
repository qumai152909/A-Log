const fs = require('fs')
const {
  localHost,
  devServer: { feHost }
} = require('../../config')

module.exports = function () {
  const hosts = fs.readFileSync('/private/etc/hosts', 'utf-8')
  if (hosts.indexOf(feHost) === -1) {
    console.log('***************************************************\n')
    console.log('请在hosts里添加\n')
    console.log(`${localHost} ${feHost}\n`)
    console.log('***************************************************\n')
    process.exit()
  }
}
