const path = require('path')
const readdirp = require('readdirp')
const run = require('../../utils/run')

const directoryFilter = ['!.git']
const contextPath = path.join(process.cwd(), 'src')

const findFilter = (contextPath, fileFilter = false) =>
  new Promise((resolve) => {
    let result = []
    let options = {
      directoryFilter
    }
    fileFilter && (options.fileFilter = fileFilter)
    readdirp(contextPath, options)
      .on('data', (entry) => {
        const { path } = entry
        result.push({ path })
      })
      .on('end', () => {
        resolve(result)
      })
  })

module.exports = async () => {
  const ret = await findFilter(contextPath, '*.svg')
  for(let v of ret){
    await run(`svgo ${path.join(contextPath, v.path)}`)
  }
}