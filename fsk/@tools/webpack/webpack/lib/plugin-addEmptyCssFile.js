// 在npm run dev时填加空的css文件，以解决前端通过dev不会生成css文件，因而html里引用不到的问题。
const path = require('path')
const fs = require('fs-path')

class AddEmptyCssFilePlugin {
  apply(compiler) {
    compiler.hooks.done.tap('AddEmptyCssFilePlugin', (stats) => {
      const { entrypoints, outputPath } = stats.toJson()
      const arr = ['common']
      Object.keys(entrypoints)
        .concat(arr)
        .forEach((v) => {
          fs.writeFileSync(path.join(outputPath, 'css', `${v}.css`), '')
        })
    })
  }
}

module.exports = AddEmptyCssFilePlugin
