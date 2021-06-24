const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
const prd = require('./prd')

module.exports = () => {
  let result = prd()
  result.plugins.push(
    new BundleAnalyzerPlugin(
      {
        analyzerMode: 'server',
        analyzerHost: '127.0.0.1',
        analyzerPort: 8889,
        reportFilename: 'report.html',
        defaultSizes: 'gzip',
        openAnalyzer: true,
        generateStatsFile: false,
        statsFilename: 'stats.json',
        statsOptions: null,
        logLevel: 'info'
      }
    )
  )
  return result
}