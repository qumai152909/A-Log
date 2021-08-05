const entrys = require('./lib/entrys');
const rules = require('./lib/rules');
const plugins = require('./lib/plugins');
const resolve = require('./lib/resolve')
const output = require('./lib/output')
const TerserPlugin = require('terser-webpack-plugin')
const optimization = require('./lib/optimization')
const { externals, devtool } = require('../config')

module.exports = () => {
  return {
    mode: 'production',
    entry: entrys(),
    output: output(),
    stats: {
      assets: true,
      cachedAssets: false,
      children: false,
      errors: true,
      chunks: false,
      modules: false,
    },
    devtool,
    externals,
    performance: {
      hints: 'warning',
    },
    module: {
      rules: rules(),
    },
    resolve: resolve(),
    optimization: {
      minimize: true,
      minimizer: [
        new TerserPlugin({
          parallel: true,
          sourceMap: true,
          extractComments: false,
          cache: true,
        }),
      ],
      ...optimization(),
    },
    plugins: plugins(),
  }
}
