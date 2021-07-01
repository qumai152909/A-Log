function inputPromise(msg) {
  if (msg) {
    process.stdout.write(msg);
  }
  
  return new Promise((resolve, reject) => {
    try {
      const getDataCb = (chunk) => {
        if (chunk) {
          process.stdin.removeListener('data', getDataCb);
          resolve(chunk.trim());
        }
      };
  
      process.stdin.setEncoding('utf8');
      process.stdin.on('data', getDataCb);
    } catch (err) {
      reject(err);
    }
  });
}

module.exports = inputPromise;
