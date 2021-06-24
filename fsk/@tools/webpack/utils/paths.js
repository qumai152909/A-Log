const path = require('path')
const { version, publicPath } = require('../config')
const roots = process.cwd()
const devPath = path.join(roots, 'asset-dev')
const prdPath = path.join(roots, 'asset')
const devVersionPath = path.join(devPath, version)
const prdVersionPath = path.join(prdPath, version)
const srcPath = path.join(roots, 'src')
const staticPath = path.join(roots, 'src/static')

module.exports = {
  version,
  roots,
  devPath,
  prdPath,
  publicPath,
  devVersionPath,
  prdVersionPath,
  srcPath,
  staticPath
}
