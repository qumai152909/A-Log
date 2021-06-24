const path = require('path')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const { srcPath, roots } = require('../../utils/paths')
const { isHot, isPrd, isDev } = require('../../utils/process')
const { babelLoaderInclude, esLint, loader, esLintInclude } = require('../../config')

module.exports = function () {
  let isServerHot = isHot()

  let group = [
    {
      key: 'img',
      test: /\.(png|jpg|jpeg|gif|eot|woff|ttf)$/,
      use: [
        {
          loader: 'file-loader',
          options: {
            name() {
              return 'images/[name].[contenthash:8].[ext]'
            },
            esModule: false,
          },
        },
      ],
    },
    {
      key: 'svg',
      test: /\.svg$/,
      oneOf: [
        {
          issuer: {
            test: /\.[tj]sx?$/,
          },
          use: [
            'babel-loader',
            {
              loader: '@svgr/webpack',
              options: {
                babel: false,
                svgoConfig: {
                  plugins: {
                    removeViewBox: false,
                  },
                },
              },
            },
          ],
        },
        {
          use: [
            {
              loader: 'file-loader',
              options: {
                name() {
                  return 'images/[name].[contenthash:8].[ext]'
                },
                esModule: false,
              },
            },
          ],
        },
      ],
    },
    {
      key: 'css&less',
      test: /\.(less|css)$/,
      use: [
        isPrd()
          ? {
              loader: MiniCssExtractPlugin.loader,
              options: {
                hmr: isServerHot,
                reloadAll: true,
                esModule: true,
              },
            }
          : 'style-loader',
        'css-loader',
        {
          loader: 'postcss-loader',
          options: {
            plugins: [require('autoprefixer'), require('cssnano')],
          },
        },
        {
          loader: 'less-loader',
          options: {
            javascriptEnabled: true,
          },
        },
      ],
    },
    {
      key: 'styled-jsx',
      test: /\._less$/,
      use: [
        'babel-loader',
        {
          loader: require('styled-jsx/webpack').loader,
          options: {
            type: 'scoped',
          },
        },
      ],
    },
    {
      key: 'babel-loader',
      test: /\.(jsx?|tsx?)$/,
      include: [...babelLoaderInclude.map((v) => path.resolve(roots, v))],
      use: (function () {
        let defaultArr = [
          {
            loader: 'babel-loader',
            options: {
              cacheDirectory: true,
            },
          },
        ]
        if (isServerHot) {
          defaultArr.push('react-hot-loader/webpack')
        }
        return defaultArr
      })(),
    },
  ]

  if (esLint) {
    group.push({
      test: /\.(jsx?|tsx?)$/,
      include: [...esLintInclude.map((v) => path.resolve(srcPath, v))],
      use: [
        {
          loader: 'eslint-loader',
          options: {
            cache: true,
            failOnError: false,
          },
        },
      ],
    })
  }

  if (typeof loader === 'function') {
    group =
      loader({
        loaders: group,
        isHot: isHot(),
        isPrd: isPrd(),
        isDev: isDev(),
      }) || group
  } else if (Array.isArray(loader)) {
    loader.forEach((v) => {
      if (v.key) {
        group.forEach((val, index) => {
          if (val.key === v.key) {
            group[index] = val
          }
        })
      } else {
        group.push(v)
      }
    })
  }

  return group.map((v) => {
    delete v.key
    return v
  })
}
