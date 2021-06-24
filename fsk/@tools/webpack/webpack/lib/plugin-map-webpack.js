const path = require('path')
const { version } = require('../../config')

class MapWebpackPlugin {
  constructor(options) {
    this.options = options
  }
  apply(compiler) {
    const mapJson = {}
    const regPath = /^(static)\//

    compiler.hooks.done.tap('MapWebpackPlugin', (stats) => {
      let assets = stats.toJson().assets
      assets.forEach((v) => {
        let exts = path.extname(v.name)
        if (/\.map$/.test(v.name)) {
          return
        }        
        if (v.chunkNames.length || regPath.test(v.name)) {
          let key = v.name.replace(exts, '').replace(/\.[a-z0-9]+$/, '') + exts
          mapJson[path.join(version, key)] = path.join(version, v.name)
        }
      })
      let targetFile = stats.compilation.compiler.outputFileSystem.join(
        stats.compilation.compiler.outputPath,
        this.options.targetFile
      )
      stats.compilation.compiler.outputFileSystem.writeFile(
        targetFile,
        JSON.stringify(mapJson, '', 2),
        () => {}
      )
    })
  }
}

module.exports = MapWebpackPlugin
