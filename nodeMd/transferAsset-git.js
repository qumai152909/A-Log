/**
 * Class TransferAsset
 * 打包文件,同步到打包中心
 * 调用方式
 * package.json.client is required!!!
 * const svn = require('../package.json').client;
 * new TransferAsset({
 *   svn: svn
 * });
 * 支持Promise链式调用
 * const svn = require('../package.json').client;
 * new TransferAsset({
 *   svn: svn
 * }).then(()=>{'after process'}).catch((err)=>{console.log(err)});
 *
 * */

const zipdir = require('zip-dir');
const request = require('request');

const fs = require('fs');
const path = require('path');
const os = require('os');
const execsync = require('child_process').execSync;

const onExecSync = (commond) => {
  return execsync(commond)
    .toString()
    .replace(/\n$/g, '')
    .split('\n');
};

class TransferAsset {
  constructor(options) {
    this.options = Object.assign(
      {
        outputPath: os.tmpdir() || './',
        fileName: 'asset.zip',
        api: 'http://package.lietou.com/FileController/uploadFile.json',
      },
      options,
    );

    this.gitUserInfo = {};

    const tasks = [
      this.isClean.bind(this),
      this.isMaster.bind(this),
      // this.addTags.bind(this),
      // this.getUserName.bind(this),
      this.asset2zip.bind(this),
      this.syncAsset2PackCenter.bind(this),
      this.clear.bind(this),
    ];
    const handler = tasks.reduce((promise, task) => {
      return promise.then(task);
    }, Promise.resolve());
    
    return handler.catch((err) => {
      console.error('\x1B[31m%s\x1b[0m', err);
    });
  }

  // remove tmp/asset.zip;
  clear() {
    fs.unlinkSync(path.join(this.options.outputPath, this.options.fileName));
  }

  // asset to asset.zip
  asset2zip() {
    return new Promise((resolve, reject) => {
      console.log(`开始打包文件:${this.options.src}`);
      zipdir(
        this.options.src,
        { saveTo: path.join(this.options.outputPath, this.options.fileName) },
        (err, buffer) => {
          if (err) {
            console.log('打包文件失败！');
            reject(err);
          } else {
            console.log('打包文件完成！');
            resolve();
          }
        },
      );
    });
  }

  isMaster() {
    return new Promise((resolve, reject) => {
      const gitLog = onExecSync(
        'git log --color --graph --pretty=format:\'%h%Creset -%d%Creset %s (%cr) <%an>%Creset\' --abbrev-commit',
      );
      const HEAD = gitLog.find(item => /(HEAD -> master)/.test(item));
      if (!HEAD) {
        reject('not master');
        return;
      }
      if (!/HEAD -> master, origin\/master/.test(HEAD)) {
        reject('something need to push');
        return;
      }
      const gitLocalConfig = onExecSync('git config --local --list'); // 当前目录git配置
      const gitConfig = onExecSync('git config --global --list'); // 全局git配置
      const userName = gitConfig.find(item => /user\.name/.test(item));
      const originUrl = gitLocalConfig.find(item =>
        /remote\.origin\.url/.test(item),
      );
      const userEmail = gitConfig.find(item => /user\.email/.test(item));
      if (!userName || !userEmail) {
        reject(
          `请配置本地${!userName ? '用户名' : ''}${
            !userName && !userEmail ? '或' : ''
          }${!userEmail ? '邮箱' : ''}`,
        );
      }
      this.gitUserInfo = {
        userName: userName.replace(/user\.name=/, ''),
        userEmail: userEmail.replace(/user\.email=/, ''),
        originUrl: originUrl.replace(/remote\.origin\.url=/, ''),
        commitId: HEAD.match(/[0-9a-zA-Z]{7}/)[0],
      };
      console.log('\x1B[32m%s\x1b[0m', 'on branch master');
      resolve();
    });
  }

  isClean() {
    return new Promise((resolve, reject) => {
      const status = onExecSync('git status');
      if (status.find(item => /working (tree|directory) clean/.test(item))) {
        console.log(
          '\x1B[32m%s\x1b[0m',
          'nothing to commit, working tree clean',
        );
        resolve();
      } else {
        const filterStatus = status.filter(v => /^\t(new file|renamed|modified|deleted):.+/g.test(v));
        reject(`something need to commit or stash\n ${filterStatus.toString()
          .replace(/,?\t/g, '\n')}`);
      }
    });
  }

  addTags() {
    return new Promise((resolve, reject) => {
      const tags = execsync('git tag')
        .toString()
        .replace(/\n$/g, '')
        .split('\n');
      if (tags.length === 1 && tags[0] === '') {
        execsync(
          'git tag -a v0.1 -m \'version 0.1 released\' && git push origin --tags',
        );
      } else {
        const lastTags = tags[tags.length - 1].replace(/\d+$/g, (string) => {
          return parseInt(string) + 1;
        });
        execsync(
          `git tag -a ${lastTags} -m 'version ${lastTags} released' && git push origin --tags`,
        );
      }
      reject('123');
    });
  }

  // 同步代码到打包中心
  syncAsset2PackCenter() {
    return new Promise((resolve, reject) => {
      console.log(
        `开始同步: ${
          path.join(this.options.outputPath, this.options.fileName)
        } 到打包中心!`,
      );
      const data = Object.assign(
        {
          environment: 'online',
          userName: this.gitUserInfo.userName,
          scmRevision: this.gitUserInfo.commitId,
          scmSource: this.gitUserInfo.originUrl,
          scmLog: '',
          scmType: 'git',
          // 'femapping' : require('../asset/map.json')
        },
        this.options,
      );

      const formData = {
        file: {
          value: fs.createReadStream(
            path.join(this.options.outputPath, this.options.fileName),
          ),
          options: {
            filename: this.options.fileName,
            contentType: 'application/octet-stream',
          },
        },
        data: JSON.stringify(data),
      };
      try {
        request(
          {
            url: this.options.api,
            headers: { 'X-Requested-With': 'XMLHttpRequest' },
            method: 'post',
            formData,
          },
          (err, httpResponse, body) => {
            if (err) {
              console.log('请求异常');
              reject(err);
            } else {
              try {
                body = JSON.parse(body);
                if (body.flag === 1) {
                  console.log('\x1B[32m%s\x1b[0m', '同步到打包中心成功');
                  resolve();
                }
              } catch (e) {
                console.log('\x1B[31m%s\x1b[0m', '同步到打包中心失败');
                console.log(body);
                reject(body);
              }
            }
          }
        );
      } catch (e) {
        reject(e);
      }
    });
  }
}

const config = require('./webpack-config/dir.config');
const svn = require('../package.json').client;

const assetPath = path.join(config.prdPath, '../');
const maping = fs.readFileSync(path.join(assetPath, './map.json'), 'utf-8');
if (maping) {
  /* eslint-disable no-new */
  new TransferAsset({
    projectName: svn.projectName,
    src: assetPath,
    femapping: JSON.parse(maping),
  });
} else {
  console.log('map.json is required！');
}

module.exports = TransferAsset;
