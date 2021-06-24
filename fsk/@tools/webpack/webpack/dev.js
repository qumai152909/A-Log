const entrys = require('./lib/entrys')
const rules = require('./lib/rules')
const plugins = require('./lib/plugins')
const resolve = require('./lib/resolve')
const output = require('./lib/output')
const optimization = require('./lib/optimization')
const { isSource } = require('../utils/process')
const { externals, watchIgnored, devtool } = require('../config')

const ignoredReg = Array.isArray(watchIgnored)
  ? () => new RegExp(watchIgnored.join('|'), 'i')
  : watchIgnored

module.exports = function() {
  return {
    entry: entrys(),
    output: output(),
    externals,
    watchOptions: {
      aggregateTimeout: 100,
      ignored: ignoredReg()
    },
    stats: { all: false },
    devtool: isSource() ? devtool : false,
    performance: { hints: false },
    module: { rules: rules() },
    resolve: resolve(),
    optimization: {
      minimize: false,
      ...optimization()
    },
    plugins: plugins()
  }
}
