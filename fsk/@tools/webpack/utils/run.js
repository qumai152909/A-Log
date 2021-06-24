const execa = require('execa')

module.exports = async function(command, options = {}) {
  if (typeof options === 'string') {
    options = {
      cwd: options
    }
  }
  if (/^c?npm outdated .*$/.test(command)) {
    let result
    try {
      result = execa.shellSync(command, {
        cwd: process.cwd(),
        stdio: 'inherit',
        ...options
      })
    } catch (e) {
      result = e
    }
    return Promise.resolve(result)
  } else {
    return await execa.shellSync(command, {
      cwd: process.cwd(),
      stdio: 'inherit',
      ...options
    })
  }
}
