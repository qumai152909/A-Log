const webpack = require('webpack')
const fs = require('fs')
const path = require('path')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const FriendlyErrorsPlugin = require('@tools/friendly-errors-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const HardSourceWebpackPlugin = require('hard-source-webpack-plugin')
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const MapWebpackPlugin = require('./plugin-map-webpack')
const MonitorWebpackPlugin = require('./plugin-monitor-webpack')
const AddEmptyCssFilePlugin = require('./plugin-addEmptyCssFile')
const WebpackBar = require('webpackbar')
const { getPort } = require('../../utils/process')
const {
  version,
  plugins,
  html,
  monitor,
  devServer: { feHost, https },
} = require('../../config')
const { roots, srcPath, devVersionPath, prdVersionPath } = require('../../utils/paths')
const packageFile = require(path.join(roots, 'package.json'))
const { isPrd, isHot, isDev, isTest, isSource } = require('../../utils/process')

const configure = () => {
  const isProd = isPrd()
  return {
    CopyWebpackPlugin: new CopyWebpackPlugin([
      {
        from: path.join(srcPath, 'static'),
        to: path.join(
          isProd ? prdVersionPath : devVersionPath,
          isProd ? 'static/[path][name].[contenthash:8].[ext]' : 'static/[path][name].[ext]'
        ),
        ignore: ['.*', '*/common/*.json', !isProd ? '*.prd*.js' : '*.dev.js'],
        transformPath(targetPath) {
          if (/\/common\/.*\.(dev|prd).*?\.js$/.test(targetPath)) {
            return targetPath.replace(/\.prd|\.dev/, '')
          }
          return targetPath
        },
      },
    ]),
    MiniCssExtractPlugin: new MiniCssExtractPlugin({
      filename: isProd ? 'css/[name].[contenthash:8].css' : 'css/[name].css',
      chunkFilename: isProd ? 'css/[name].[contenthash:8].css' : 'css/[name].css',
      ignoreOrder: true,
    }),
    FriendlyErrorsPlugin: new FriendlyErrorsPlugin({
      compilationSuccessInfo: {
        messages: [
          ` 运行项目: ${packageFile.client ? packageFile.client.projectName : packageFile.name}`,
          ` 访问地址: ${https ? 'https' : 'http'}://${feHost}:${getPort()}\n`,
        ],
      },
    }),
    CleanWebpackPlugin: new CleanWebpackPlugin({
      cleanOnceBeforeBuildPatterns: ['**/*', path.join(roots, 'asset/source-map-*/**/*')],
    }),
    HtmlWebpackPlugin: new HtmlWebpackPlugin({
      inject: false,
      template: path.join(srcPath, 'pages/main/index.html'),
    }),
    HtmlWebpackPluginForHot: new HtmlWebpackPlugin({
      inject: false,
      templateContent() {
        let html = fs.readFileSync(path.join(srcPath, 'pages/main/index.html'), 'utf-8')
        let reg = new RegExp(`\/\/concat\.lietou-static\.com\/.+?\/${version}`, 'gim')
        return html.replace(reg, '')
      },
    }),
    HtmlWebpackPluginForPrd() {
      let result = fs.readdirSync(path.join(srcPath, 'pages'))
      return result.reduce((a, b) => {
        if (!/^\./.test(b)) {
          a.push(
            new HtmlWebpackPlugin({
              inject: false,
              filename: `${b}.html`,
              templateContent(arg) {
                let mapJson = createMapJson(arg.webpack.assets)
                let htmlSnippets = fs.readFileSync(
                  path.join(srcPath, `pages/${b}/index.html`),
                  'utf-8'
                )
                return htmlReplaceUrlHash(htmlSnippets, mapJson)
              },
            })
          )
        }
        return a
      }, [])
    },
    WebpackBar: new WebpackBar(),
    OptimizeCSSAssetsPlugin: new OptimizeCSSAssetsPlugin(),
    MapWebpackPlugin: new MapWebpackPlugin({ targetFile: 'map.json' }),
    MonitorWebpackPlugin: new MonitorWebpackPlugin(),
    HashedModuleIdsPlugin: new webpack.HashedModuleIdsPlugin(),
    ProgressPlugin: new webpack.ProgressPlugin(),
    AddEmptyCssFilePlugin: new AddEmptyCssFilePlugin(),
    HardSourceWebpackPlugin: new HardSourceWebpackPlugin({
      configHash(webpackConfig) {
        try {
          const babelConfig = require(path.join(roots, 'babel.config.js'))
          return require('node-object-hash')({ sort: false }).hash({
            babelConfig,
            webpackConfig,
          })
        } catch (e) {
          return require('node-object-hash')({ sort: false }).hash(webpackConfig)
        }
      },
    }),
    HardSourceWebpackPluginExcludeModulePlugin: new HardSourceWebpackPlugin.ExcludeModulePlugin([
      {
        // HardSource works with mini-css-extract-plugin but due to how
        // mini-css emits assets, assets are not emitted on repeated builds with
        // mini-css and hard-source together. Ignoring the mini-css loader
        // modules, but not the other css loader modules, excludes the modules
        // that mini-css needs rebuilt to output assets every time.
        test: /mini-css-extract-plugin[\\/]dist[\\/]loader/,
      },
    ]),
    SourceMapDevToolPluginForHot: new webpack.SourceMapDevToolPlugin({
      exclude: ['*.js'],
    }),
  }
}

function createMapJson(assets) {
  const regPath = /^(static)\//
  let mapJson = {}
  assets.forEach((v) => {
    let exts = path.extname(v.name)
    if (v.chunkNames.length || regPath.test(v.name)) {
      let key = v.name.replace(exts, '').replace(/\.[a-z0-9]+$/, '') + exts
      mapJson[path.join(version, key)] = path.join(version, v.name)
    }
  })
  return mapJson
}

function htmlReplaceUrlHash(htmlSnippets, mapJson) {
  return Object.keys(mapJson).reduce((html, key) => {
    html = html.replace(new RegExp('("|\'|=|/)' + key, 'g'), `$1${mapJson[key]}`)
    return html
  }, htmlSnippets)
}

module.exports = function () {
  const config = configure()
  let result
  if (isDev()) {
    result = [
      config.CleanWebpackPlugin,
      config.CopyWebpackPlugin,
      config.MiniCssExtractPlugin,
      config.WebpackBar,
      config.FriendlyErrorsPlugin,
      config.HtmlWebpackPlugin,
      config.HardSourceWebpackPlugin,
      config.HardSourceWebpackPluginExcludeModulePlugin,
      config.AddEmptyCssFilePlugin,
    ]
  } else if (isHot()) {
    result = [
      config.CopyWebpackPlugin,
      config.MiniCssExtractPlugin,
      config.WebpackBar,
      config.FriendlyErrorsPlugin,
      config.HtmlWebpackPluginForHot,
      config.HardSourceWebpackPlugin,
      config.HardSourceWebpackPluginExcludeModulePlugin,
    ]
    if (!isSource()) {
      result.push(config.SourceMapDevToolPluginForHot)
    }
  } else if (isPrd()) {
    result = [
      config.CleanWebpackPlugin,
      config.CopyWebpackPlugin,
      config.MiniCssExtractPlugin,
      config.OptimizeCSSAssetsPlugin,
      config.MapWebpackPlugin,
      config.WebpackBar,
    ]
    if (monitor === true && isTest() === false) {
      result.push(config.MonitorWebpackPlugin)
    }
    if (html === true) {
      result = result.concat(config.HtmlWebpackPluginForPrd())
    }
  }

  if (Array.isArray(plugins)) {
    result = result.concat(plugins)
  } else if (typeof plugins === 'function') {
    result =
      plugins({
        plugins: result,
        isPrd: isPrd(),
        isHot: isHot(),
        isDev: isDev(),
        allPlugins: config,
      }) || result
  }

  return result
}
