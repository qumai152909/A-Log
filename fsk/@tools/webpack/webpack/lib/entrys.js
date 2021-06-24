const path = require('path')
const glob = require('glob')
const { srcPath } = require('../../utils/paths')
const { entry } = require('../../config')

/*
  将
  {
    'common/common': 'common/index.js',
    'pages/*': 'pages/*\/index.js'
  }
  转换为
  {
    'common/common': '/Users/maben/work/test/fet-cli/fe-msk-pc/v5/src/common/index.js',
    'pages/about': '/Users/maben/work/test/fet-cli/fe-msk-pc/v5/src/pages/about/index.js',
    'pages/home': '/Users/maben/work/test/fet-cli/fe-msk-pc/v5/src/pages/home/index.js',
  }
*/

module.exports = function entrys() {
  let result = Object.keys(entry).reduce((files, item) => {
    if (item.includes('*')) {
      if (!/^\//.test(entry[item])) {
        files = {
          ...files,
          ...spread(item, glob.sync(path.join(srcPath, entry[item])))
        }
      } else {
        files = {
          ...files,
          ...spread(item, glob.sync(entry[item]))
        }
      }
    } else {
      if (!/^\//.test(entry[item])) {
        files[item] = path.join(srcPath, entry[item])
      } else {
        files[item] = entry[item]
      }
    }
    return files
  }, {})
  return result
}

function spread(key, val) {
  let arr = Array.isArray(val) ? val : [val]
  return arr.reduce((a, b) => {
    let folder = b.replace(new RegExp(`^.*${key.replace(/\*/, '')}([^/]+).*$`), '$1')
    return (a[key.replace('*', folder)] = [b]), a
  }, {})
}
