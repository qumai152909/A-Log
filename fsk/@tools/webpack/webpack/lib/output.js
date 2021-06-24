const { devVersionPath, publicPath, prdVersionPath } = require('../../utils/paths')
const { isPrd, isDev, isHot } = require('../../utils/process')
const { output, version } = require('../../config')

module.exports = function () {
  const isProd = isPrd()
  const config = {
    publicPath,
    path: isProd ? prdVersionPath : devVersionPath,
    filename: isProd ? 'js/[name].[contenthash:8].js' : 'js/[name].js',
    chunkFilename: isProd ? 'js/[name].[chunkhash:8].js' : 'js/[name].js',
    pathinfo: false,
    crossOriginLoading: 'anonymous',
    // 注意，需要在plugin里的clean plugin里清除sourcemap文件，避免重复生成
    sourceMapFilename: `../source-map-${version}/[file].map`,
  }

  if (typeof output === 'function') {
    return output({
      config,
      isDev: isDev(),
      isPrd: isPrd(),
      isHot: isHot(),
    })
  } else {
    return {
      ...config,
      ...output,
    }
  }
}
