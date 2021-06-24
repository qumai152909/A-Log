const fs = require('fs')
const os = require('os')
const path = require('path')
const chalk = require('chalk')
const webpack = require('webpack')
const webpackConfig = require('../webpack/prd')
const { exec } = require('child_process')
const { roots, prdVersionPath, prdPath, version } = require('../utils/paths')
const zipFilePath = path.join(os.tmpdir() || './', 'asset.zip')
const svn = require(path.join(roots, 'package.json'))
const request = require('request')
const zipdir = require('zip-dir')
const { isPrdBranches } = require('../utils/process')

const logger = (text, color = 'green') => console.log(chalk[color](text))
const zipFileName = `asset${Date.now()}.zip`

class Transfer {
  constructor() {
    this.scmRevision = null
    this.userName = null
    this.publishUrl = 'http://package.lietou.com/FileController/uploadFile.json'

    const prdTasks = [
      this.getCommitId.bind(this),
      this.beforeBuild.bind(this),
      this.isSame.bind(this), // 检查本地commitId与远程库是否一致
      this.compile.bind(this),
      this.checkMapJson.bind(this), // 检查map.json
      this.pack.bind(this), // zip打包
      this.sender.bind(this), // 发送到打包中心
      this.removePack.bind(this), // 删除本地zip文件
    ]
    return prdTasks
      .reduce((promise, task) => promise.then(task), Promise.resolve())
      .catch((err) => {
        logger(err, 'red')
        process.exit(1)
      })
  }
  getCommitId() {
    logger('获取最新CommitId...', 'blue')
    return new Promise((resolve, reject) => {
      exec('git rev-parse --verify --short HEAD', (err, status) => {
        if (err) {
          logger('获取最新CommitId失败!!!', 'red')
          reject(err)
        } else {
          logger('获取最新CommitId成功.')
          this.scmRevision = status
          resolve()
        }
      })
    })
  }
  /**
   * 调用webpack编译之前, 先检查项目
   * getUserInfo 获取用户信息, 获取不到需要用户登录gogs
   * isMaster 校验当前分支是否是Master分支 本地更新是否已全部提交
   * checkModuleVersion 检查包版本是否最新
   * @returns {Promise<any[]>}
   */
  beforeBuild() {
    if (isPrdBranches()) {
      return Promise.all([this.getUserInfo(), this.isUpdate()])
    } else {
      return Promise.all([this.getUserInfo(), this.isMaster()])
    }
  }

  getUserInfo() {
    logger('获取用户姓名与邮箱...', 'blue')
    return new Promise((resolve, reject) => {
      exec('git config --global --list', (err, status) => {
        if (err) {
          logger('获取用户姓名与邮箱失败!!!', 'red')
          reject(err)
        } else {
          const match = status.match(/(^|\n)user.name=([^\n\r]+)[\s\S]*user.email=([^\n\r]+)/) // 全局git配置
          if (match) {
            logger('获取用户姓名与邮箱成功.')
            this.userName = match[2]
            resolve()
          } else {
            reject(new Error('请设置你的git账户与邮箱!!!'))
          }
        }
      })
    })
  }
  isUpdate() {
    logger('检测是否有未提交的更新...', 'blue')
    return new Promise((resolve, reject) => {
      exec('git status -sb', (err, status) => {
        if (err) {
          logger(status, 'red')
          reject(err)
        } else {
          const match = status.match(/^## (.*?)\.\.\.origin\/\1([^\n]*)\n?\r?([\s\S]*)/)
          // console.log('match', match)
          if (match) {
            if (match[3]) {
              reject(new Error(`${match[3]} \n 有变更/新增的文件没有提交!!!`))
            } else if (match[2]) {
              reject(new Error('有本地更新没有提交到远程库!!!'))
            } else {
              logger('代码变更检测成功.')
              resolve()
            }
          }
        }
      })
    })
  }
  isMaster() {
    logger('检测是否Master分支, 检测是否有未提交的更新...', 'blue')
    return new Promise((resolve, reject) => {
      exec('git status -sb', (err, status) => {
        if (err) {
          logger(status, 'red')
          reject(err)
        } else {
          const match = status.match(/^## master...origin\/master([^\n]*)\n?\r?([\s\S]*)/)
          // console.log('match', match)
          if (match) {
            if (match[2]) {
              reject(new Error(`${match[2]} \n 有变更/新增的文件没有提交!!!`))
            } else if (match[1]) {
              reject(new Error('有本地更新没有提交到远程库!!!'))
            } else {
              logger('Master分支检测成功, 代码变更检测成功.')
              resolve()
            }
          } else {
            reject(new Error('不是Master分支!!!'))
          }
        }
      })
    })
  }
  isSame() {
    const promises = ['git ls-remote origin -h HEAD|cut -f1', 'git rev-parse --verify HEAD'].map(
      (cmd) => {
        return new Promise((resolve, reject) =>
          exec(cmd, (err, status) => {
            err ? reject(err) : resolve(status)
          })
        )
      }
    )
    logger('对比远程库与本地库HEAD的CommitId...', 'blue')
    return Promise.all(promises).then(([remoteCommitID, localCommitID]) => {
      if (remoteCommitID === localCommitID) {
        logger('与远程库版本一致.')
      } else {
        return Promise.reject(new Error('本地库与远程库不同步!!!'))
      }
    })
  }
  sender() {
    return new Promise((resolve, reject) => {
      logger(`开始同步: ${zipFilePath} 到打包中心...`)
      const data = Object.assign({
        src: prdVersionPath,
        femapping: this.femapping,
        projectName: svn.client.projectName,
        version,
        environment: 'online',
        userName: this.userName,
        scmRevision: this.scmRevision,
        scmSource: svn.repository && svn.repository.url,
        scmLog: '',
        scmType: 'git',
        outputPath: path.dirname(zipFilePath),
        fileName: zipFileName,
        api: this.publishUrl,
      })
      const formData = {
        file: {
          value: fs.createReadStream(zipFilePath),
          options: {
            filename: zipFileName,
            contentType: 'application/octet-stream',
          },
        },
        data: JSON.stringify(data),
      }
      try {
        request(
          {
            url: this.publishUrl,
            headers: { 'X-Requested-With': 'XMLHttpRequest' },
            method: 'post',
            formData,
          },
          (err, httpResponse, body) => {
            if (err) {
              logger('请求异常', 'red')
              reject(err)
            } else {
              try {
                body = JSON.parse(body)
                if (body.flag === 1) {
                  logger('同步到打包中心成功')
                  console.log('时间：', new Date().toString())
                  resolve()
                } else {
                  logger('同步到打包中心失败!!!', 'red')
                  logger(JSON.stringify(body), 'red')
                }
              } catch (e) {
                logger('同步到打包中心失败', 'red')
                reject(body)
              }
            }
          }
        )
      } catch (e) {
        reject(e)
      }
    })
  }
  checkMapJson() {
    logger('检测map.json...', 'blue')
    return new Promise((resolve, reject) => {
      fs.readFile(path.join(prdVersionPath, './map.json'), 'utf8', (err, data) => {
        if (err) {
          logger('检测map.json失败!!!', 'red')
          reject(err)
        } else if (data) {
          logger('检测map.json完成.')
          this.femapping = JSON.parse(data)
          resolve()
        } else {
          reject(new Error('没找到map.json!!!'))
        }
      })
    })
  }
  compile() {
    logger('开始编译...', 'blue')
    return new Promise((resolve, reject) => {
      webpack(webpackConfig(false, { mode: 'production' }), (err, stats) => {
        if (err) {
          logger('编译失败!!!', 'red')
          reject(err)
        } else if (stats.hasErrors()) {
          logger('编译失败!!!', 'red')
          reject(stats.toJson().errors)
        } else {
          process.stdout.write(
            `${stats.toString({
              colors: true,
              modules: false,
              children: false,
              chunks: false,
              chunkModules: false,
              warningsFilter: (warning) => /Conflicting order between/gm.test(warning),
            })}\n\n`
          )
          logger('编译成功.')
          resolve()
        }
      })
    })
  }
  pack() {
    return new Promise((resolve, reject) => {
      logger(`开始打包文件:${prdPath}...`, 'blue')
      zipdir(prdPath, { saveTo: zipFilePath }, (err) => {
        if (err) {
          logger('打包文件失败！', 'red')
          reject(err)
        } else {
          logger('打包文件完成.')
          resolve()
        }
      })
    })
  }
  removePack() {
    fs.unlinkSync(zipFilePath)
  }
}

new Transfer()
