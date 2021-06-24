const path = require('path')
const fs = require('fs')
const request = require('request')
const zipdir = require('zip-dir')
const os = require('os')
const plugin_name = 'MonitorWebpackPlugin'
const log = require('../../utils/log')
const { projectName, version } = require('../../config')
const { prdVersionPath } = require('../../utils/paths')

const defaultOpt = {
  name: `sourcemap.zip`, // 压缩后的文件名, 可以不指定
  dir: path.join(prdVersionPath, `../source-map-${version}`), // 需要发送的文件夹的绝对路径, * 必须
  url: 'http://monitor.lietou.com/saveSourcemap', // 服务器接口， * 必须
  data: { projectName },
  success: (data) => {
    log.success(data || 'source-map文件已发送至前端日志平台！')
  },
}

class MonitorWebpackPlugin {
  constructor(options = {}) {
    this.options = { ...defaultOpt, ...options }
    this.zipFilePath = path.join(os.tmpdir() || './', this.options.name)
    this.check()
  }
  apply(compiler) {
    const doneCallback = (stats) => {
      if (stats.hasErrors()) {
        log.warn(plugin_name + ': pausing due to webpack errors')
        return
      }
      this.initSend()
    }
    if (compiler.hooks) {
      compiler.hooks.done.tap(plugin_name, doneCallback)
    } else {
      compiler.plugin('done', doneCallback)
    }
  }
  check() {
    const { dir, url } = this.options
    if (!dir) {
      throw new TypeError(plugin_name + ': options.dir is required')
    }
    if (!url) {
      throw new TypeError(plugin_name + ': options.url is required')
    }
    return true
  }
  async initSend() {
    if (!this.check()) {
      return
    }
    const buffer = await this.pack()
    this.send(buffer)
    fs.unlinkSync(this.zipFilePath)
  }
  pack() {
    return new Promise((resolve, reject) => {
      zipdir(this.options.dir, { saveTo: this.zipFilePath }, (err, buffer) => {
        if (err) {
          reject(err)
        } else {
          resolve(buffer)
        }
      })
    })
  }
  send() {
    const formData = {
      file: {
        value: fs.createReadStream(this.zipFilePath),
        options: {
          filename: this.options.name,
          contentType: 'application/octet-stream',
        },
      },
      data: JSON.stringify(this.options.data),
    }

    request(
      {
        url: this.options.url,
        method: 'post',
        formData,
      },
      (err, httpResponse, body) => {
        if (err) {
          log.error(plugin_name + ': 上传前端日志失败 ')
          console.log(JSON.stringify(err))
          return
        }
        try {
          body = JSON.parse(body)
          if (body.flag === 1) {
            this.options.success(body.data)
          } else {
            log.error(plugin_name + ': 前端日志上传失败 ')
            log.error(JSON.stringify(body))
          }
        } catch (e) {
          log.error(plugin_name + ': 前端日志上传失败 ')
          log.error(JSON.stringify(body))
        }
      }
    )
  }
}

module.exports = MonitorWebpackPlugin
