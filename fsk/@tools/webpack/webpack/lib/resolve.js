const path = require('path')
const { roots, srcPath } = require('../../utils/paths')
const { resolve } = require('../../config')

module.exports = function () {
  const extensions = [...new Set(resolve.extensions)]
  const alias = Object.keys(resolve.alias).reduce(
    (a, b) => {
      if (/^\//.test(resolve.alias[b])) {
        a[b] = resolve.alias[b]
      } else {
        a[b] = path.join(srcPath, resolve.alias[b])
      }
      return a
    },
    {
      '@': path.join(srcPath),
      '@root': roots,
      'react-dom': '@hot-loader/react-dom',
    }
  )
  return {
    ...resolve,
    extensions,
    alias,
  }
}
