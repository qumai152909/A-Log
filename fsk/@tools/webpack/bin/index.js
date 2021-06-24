#!/usr/bin/env node
const path = require('path')
const fs = require('fs')
const inquirer = require('inquirer')

const argv = require('minimist')(process.argv.slice(2))
const argvSlice = process.argv.slice(3)
const run = require('../utils/run')
const log = require('../utils/log')
const changePort = require('../utils/changePort')
const { setProcessMode, setPort, getPort } = require('../utils/process')
const publish = require('./lib/publish')
const svgOptimizer = require('./lib/svgOptimizer')
const hosts = require('./lib/hosts')
const prdBranchesInquirer = require('./lib/prdBranchesInquirer')

const webpackPath = path.join(__dirname, '../webpack')
const transferPath = path.join(__dirname, '../transfer')
const moduleCheckPath = path.join(__dirname, '../moduleCheck')

const main = async function () {
  function start(source = false) {
    hosts()
    if (source) setProcessMode('source')
    setProcessMode('developmentHot')
    const { localHost } = require('../config')
    const defaultPort = getPort()
    changePort(defaultPort, localHost).then(async (port) => {
      if (parseInt(defaultPort) !== parseInt(port)) {
        log.info(` 端口${defaultPort}正在被占用，自动切换到${port} `)
      }
      setPort(port)
      await run(
        `webpack-dev-server --config ${webpackPath}/server.hot.js --mode development --hot ${argvSlice.join(
          ' '
        )}`
      )
    })
  }

  switch (argv._[0]) {
    case 'start':
      start()
      break
    case 'start:source':
      start(true)
      break
    case 'dev':
      setProcessMode('development')
      await run(`node ${moduleCheckPath}/index.js`)
      await run(
        `webpack --config ${webpackPath}/dev.js --mode development --hot ${argvSlice.join(' ')}`
      )
      break
    case 'prd':
      setProcessMode('production')
      await run(`node ${moduleCheckPath}/index.js`)
      await run(`node ${transferPath} --mode production`)
      break
    case 'prd:branches':
      setProcessMode('production')
      setProcessMode('prdBranches')
      await prdBranchesInquirer()
      await run(`node ${moduleCheckPath}/index.js`)
      await run(`node ${transferPath} --mode production`)
      break
    case 'prd:test':
      setProcessMode('production')
      setProcessMode('test')
      await run(`webpack --config ${webpackPath}/prd.js ${argvSlice.join(' ')}`)
      break
    case 'qa':
      publish(argvSlice)
      break
    case 'analyzer':
      setProcessMode('production')
      setProcessMode('test')
      await run(`webpack --config ${webpackPath}/analyzer.js`)
      break
    case 'fix':
      const fix = require('@tools/eslint-config-alloy/fix')
      fix()
      break
    case 'svgOptimizer':
      svgOptimizer()
      break
    case 'clear':
      console.log('清理缓存文件...\n')
      await require('./lib/clearCache')()
      break
    case 'update':
      log.info('正在更新脚手架')
      await run(`npm run clear`)
      await run(`npm update @tools/webpack`)
      break
    default:
  }
}
main()
