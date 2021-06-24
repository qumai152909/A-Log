const path = require('path')
const inquirer = require('inquirer')
const chalk = require('chalk')
const fs = require('fs-extra')
const readdirp = require('readdirp')
const dayjs = require('dayjs')
const run = require('../../utils/run')

const directoryFilter = ['!.git']
const contextPath = path.join(process.cwd(), 'src')
const assetPath = path.join(process.cwd(), './asset-dev')
const packageJson = require(path.join(process.cwd(), './package.json'))
const { projectName } = packageJson.client || packageJson.name

const findLastModify = (total) =>
  new Promise((resolve) => {
    let result = []
    readdirp(contextPath, {
      fileFilter: '!.*',
      alwaysStat: true,
      directoryFilter,
    })
      .on('data', (entry) => {
        const { path, stats } = entry
        result.push({
          mtime: dayjs(stats.mtime).format('YYYY-MM-DD HH:mm:ss'),
          path,
        })
      })
      .on('end', () => {
        result = result.sort((a, b) => {
          return a.mtime > b.mtime ? -1 : 1
        })
        resolve(result.splice(0, total))
      })
  })

const findFilter = (fileFilter = false) =>
  new Promise((resolve) => {
    let result = []
    let options = {
      assetPath,
      directoryFilter,
    }
    fileFilter && (options.fileFilter = fileFilter)
    readdirp(assetPath, options)
      .on('data', (entry) => {
        const { path } = entry
        result.push({ path })
      })
      .on('end', () => {
        resolve(result)
      })
  })

function cacheFunc() {
  let filePath = path.join(process.cwd(), 'node_modules/.cache/')
  let fileName = 'fsk-sync-cache.json'
  const get = () => {
    try {
      return require(path.join(filePath, fileName))
    } catch (e) {
      return {
        server: 51,
        list: 'all',
      }
    }
  }
  return {
    get,
    set(obj = {}) {
      fs.ensureDir(filePath, () =>
        fs.writeJsonSync(path.join(filePath, fileName), { ...get(), ...obj })
      )
    },
  }
}

function validServer(server) {
  if (!/^[a-z0-9]+$/i.test(server)) {
    throw Error(`需同步的服务器编号错误 ${server}`)
  }
}

const cache = cacheFunc()
const ip = '10.110.15.1'
const suffix = `-h ${ip} -p qa -u qa --localroot asset-dev --pub`

module.exports = async (param = []) => {
  if (param.length > 0) {
    let server = param[0]
    let files = param.slice(1)
    if (server === '--help') {
      console.log('通过命令同步代码')
      console.log(
        `${chalk.blue(
          'npm run qa -- 51'
        )}                                         同步全部文件到qa51`
      )
      console.log(
        `${chalk.blue(
          'npm run qa -- 51 v6/js/pages/home.js v6/js/About.js'
        )}      同步指定文件到qa51`
      )
    } else if (files.length > 0) {
      files = files.map((v) => `-f ${v}`).join(' ')
      validServer(server)
      await run(`fsk-sync ${files} -r /data/static/QA${server}/${projectName} ${suffix}`, assetPath)
    } else {
      validServer(server)
      await run(`fsk-sync -d ./ -r /data/static/QA${server}/${projectName} ${suffix}`, assetPath)
    }
    return
  }

  console.log('通过命令 npm run qa -- --help 来获取帮助\n')
  console.log('注: 灰色括号内的值为上次输入的值，如果正确则无须重复输入')
  return new Promise((resolve) => {
    inquirer
      .prompt([
        {
          type: 'input',
          name: 'server',
          message: chalk.cyanBright('输入你要发布的qa环境编号(number|pub|qpub): '),
          default: cache.get().server,
          validate(val) {
            if (val === '') {
              return '请输入编号'
            } else {
              return true
            }
          },
        },
        {
          type: 'list',
          name: 'list',
          message: chalk.cyanBright('请选择要发送的文件: '),
          default: cache.get().list,
          choices: [
            {
              name: 'asset-dev下所有文件',
              value: 'all',
            },
            {
              name: 'asset-dev下的所有js',
              value: 'fileJs',
            },
            {
              name: 'asset-dev下的所有css',
              value: 'fileCss',
            },
            {
              name: 'asset-dev下的所有img|svg',
              value: 'fileJsImg',
            },
          ],
        },
      ])
      .then(async (answers) => {
        const { server, list } = answers
        cache.set({ server, list })
        // cd asset-dev && fsk-sync -d ./ -r /data/static/QA29/fe-h2-pc -h 10.110.15.1 -p qa -u qa --localroot asset-dev --pub
        let result
        switch (list) {
          case 'all':
            await run(
              `fsk-sync -d ./ -r /data/static/QA${server}/${projectName} ${suffix}`,
              assetPath
            )
            break
          case 'fileJs':
            result = await findFilter('*.js')
            result = result.map((v) => `-f ${v.path}`).join(' ')
            await run(
              `fsk-sync ${result} -r /data/static/QA${server}/${projectName} ${suffix}`,
              assetPath
            )
            break
          case 'fileCss':
            result = await findFilter('*.css')
            result = result.map((v) => `-f ${v.path}`).join(' ')
            await run(
              `fsk-sync ${result} -r /data/static/QA${server}/${projectName} ${suffix}`,
              assetPath
            )
            break
          case 'fileJsImg':
            result = await findFilter('*.(svg|ico|png|jpg|jpeg|gif)')
            result = result.map((v) => `-f ${v.path}`).join(' ')
            await run(
              `fsk-sync ${result} -r /data/static/QA${server}/${projectName} ${suffix}`,
              assetPath
            )
            break
        }
      })
  })
}
