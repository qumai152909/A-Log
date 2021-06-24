const path = require('path');
const fsPath = require('fs-path');
const { roots } = require('../../utils/paths')

module.exports = function () {
  return new Promise(resolve => {
    fsPath.remove(path.join(roots, 'node_modules/.cache'), () => {
      resolve();
    });
  });
}