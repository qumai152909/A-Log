const enmu = {
  source: 'source',
  test: 'test',
  prdBranches: 'prdBranches',
  developmentHot: 'developmentHot',
  development: 'development',
  production: 'production',
}

module.exports = {
  setProcessMode(name) {
    let result = enmu[name]
    if (result) {
      let arr = process.env.mode ? process.env.mode.split(',') : []
      arr.push(name)
      process.env.mode = [...new Set(arr)]
    } else {
      throw new Error('process.env.mode 没有预置此字段')
    }
  },
  setPort(port) {
    return (process.env.__PORT = port)
  },
  getPort() {
    return process.env.__PORT || require('../config').devServer.port
  },
  isTest() {
    return process.env.mode ? process.env.mode.split(',').includes('test') : false
  },
  isHot() {
    return process.env.mode ? process.env.mode.split(',').includes('developmentHot') : false
  },
  isPrd() {
    return process.env.mode ? process.env.mode.split(',').includes('production') : false
  },
  isDev() {
    return process.env.mode ? process.env.mode.split(',').includes('development') : false
  },
  isSource() {
    return process.env.mode ? process.env.mode.split(',').includes('source') : false
  },
  isPrdBranches() {
    return process.env.mode ? process.env.mode.split(',').includes('prdBranches') : false
  },
}
