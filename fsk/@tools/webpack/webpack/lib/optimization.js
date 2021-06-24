const { splitChunks } = require('../../config')

const transfer = (arr) => new RegExp(arr.map((v) => `[\\/]node_modules[\\/]${v}`).join('|'))

module.exports = function() {
  let group = {
    'polyfill-vendors': {
      chunks: 'all',
      test: transfer(['core-js']),
      priority: 10,
      name: 'polyfill-vendors',
      enforce: true
    },
    'react-vendors': {
      chunks: 'all',
      test: transfer([
        'react',
        'react-dom',
        'prop-types',
        '@hot-loader/react-dom',
        'react-router-dom',
        'axios',
        'classnames',
        'mobx',
        'mobx-react-lite'
      ]),
      priority: 10,
      name: 'react-vendors',
      enforce: true
    }
  }
  let splitChunksOptions

  if (typeof splitChunks === 'function') {
    splitChunksOptions = splitChunks(group)
  } else if (typeof group === 'object') {
    splitChunksOptions = {
      chunks: 'async',
      cacheGroups: {
        ...group,
        ...splitChunks
      }
    }
  }

  return {
    splitChunks: splitChunksOptions,
    runtimeChunk: 'single'
  }
}
