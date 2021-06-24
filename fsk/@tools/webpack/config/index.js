const path = require('path')
const packageJson = require(path.join(process.cwd(), 'package.json'))
const utils = require('../utils/func')
const version = 'v6'
const projectName = (packageJson.client && packageJson.client.projectName) || ''

let defaultConfig = {
  localHost: '0.0.0.0',
  projectName,
  version,
  entry: {
    'pages/*': 'pages/*/index.js',
  },
  output: {},
  publicPath: `//concat.lietou-static.com/${projectName}/${version}/`,
  esLint: true,
  html: false,
  monitor: true,
  devtool: 'source-map',
  externals: {},
  watchIgnored: ['node_modules/(?!@liepin)', 'asset-dev', 'asset'],
  esLintInclude: ['components', 'common', 'pages', 'views', 'hooks'],
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
    alias: {
      '@components': 'components',
      '@views': 'views',
      '@static': 'static',
      '@common': 'common',
    },
  },
  babelLoaderInclude: ['src', 'node_modules/@liepin'],
  loader: {}, // loader在rules.js里处理
  plugins: [], // plugin在plugin.js里处理
  splitChunks: {},
  devServer: {
    host: '',
    https: true,
    openPage: '',
    feHost: '',
    port: '3000',
    proxy: {},
  },
}

let userConfig = require(path.join(process.cwd(), 'webpack.config'))

// 处理兼容
;['extensions', 'alias'].forEach((v) => {
  if (userConfig[v]) {
    userConfig.resolve = userConfig.resolve || {}
    userConfig.resolve[v] = userConfig.resolve[v] || userConfig[v]
    delete userConfig[v]
  }
})

// 针对特殊类型特殊处理
;['output', 'loader', 'plugins', 'splitChunks'].forEach((v) => {
  if (userConfig[v]) {
    defaultConfig[v] = userConfig[v]
    delete userConfig[v]
  }
})

utils.overwrite(defaultConfig, userConfig)

module.exports = defaultConfig
