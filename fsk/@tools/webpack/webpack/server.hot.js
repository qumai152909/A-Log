const merge = require('webpack-merge')
const devConfig = require('./dev')
const opn = require('better-opn')
const { getPort } = require('../utils/process')
const {
  localHost,
  devServer: { feHost, host, proxy, https, openPage },
} = require('../config')

const prefix = https === true ? 'https' : 'http'
module.exports = (env, argv) => {
  return merge(devConfig(env, argv), {
    output: {
      publicPath: '/',
    },
    devServer: {
      historyApiFallback: {
        rewrites: [
          {
            from: /\.(json|png|svg|gif|jpg|jpeg|css|js)$/,
            to: '',
          },
          {
            from: /.*/g,
            to: '/',
          },
        ],
      },
      https,
      compress: true,
      headers: { 'Access-Control-Allow-Origin': '*' },
      public: `${feHost}:${getPort()}`,
      disableHostCheck: true,
      clientLogLevel: 'none',
      host: localHost,
      openPage,
      stats: 'none',
      overlay: false,
      port: getPort(),
      quiet: true,
      transportMode: 'ws',
      setup(app) {
        app.get('/css/common.css', function (req, res) {
          res.set('Content-Type', 'text/css')
          res.send('')
        })
      },
      before(app, server) {
        const { https, public, openPage = '' } = server.options
        const prefix = https === true ? 'https' : 'http'
        setTimeout(() => opn(`${prefix}://${public}${openPage}`), 0)
      },
      proxy: {
        '**/*.json': {
          target: `${prefix}://${host}`,
          changeOrigin: true,
          secure: false,
        },
        ...proxy,
      },
    },
  })
}
