const exec = require('child_process').exec;
const chalk = require('chalk');
const pkg = require('../../package.json');

const logger = (text, color = 'green') => console.log(chalk[color](text));

function updatePackage(packages) {
  const ps = packages.replace(/\u001b\[\d+m/ig, '') // eslint-disable-line
    .split(/\s+/)
    .filter(str => /^@liepin/.test(str))
    .join(' ');
  if (!ps.length) {
    return;
  }
  return new Promise((resolve, reject) => {
    logger(`更新包:${ps}`);
    exec(`npm update ${ps}`, (err, data) => {
      if (err) {
        reject(err);
      } else {
        logger(data);
        resolve();
      }
    });
  });
}

function checkModuleVersion() {
  logger('[@liepin/modules]版本号检查...', 'blue');
  const privateVersion = Object.keys(pkg.dependencies)
    .filter(key => key.startsWith('@liepin'));
  return new Promise((resolve, reject) => {
    exec(`cnpm outdated ${privateVersion.join(' ')}`, (err, status) => {
      if (err || /@liepin/.test(status)) {
        logger('[@liepin/modules]依赖模块有新版本，请更新版本', 'red');
        logger(status, 'red');
        logger('更新或忽略: y/n/i');
        process.stdin.setEncoding('utf8');
        process.stdin.on('data', data => {
          if (/^(yes|y)\s*$/i.test(data)) {
            updatePackage(status)
              .then(() => {
                resolve();
                process.stdin.emit('end');
              })
              .catch(error => {
                logger(error, 'red');
                reject(error);
                process.stdin.emit('end');
              });
          } else if (/^(i|ignore)\s*$/i.test(data)) {
            resolve();
            process.exit();
          } else {
            reject(status);
            process.stdin.emit('end');
          }
        });
      } else {
        logger('[@liepin/modules]版本号检查完成.');
        resolve();
      }
    });
  });
}

checkModuleVersion();