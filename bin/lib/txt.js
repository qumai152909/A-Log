const fs = require('fs');

const readerStream = fs.createReadStream('./bin/wow.txt'); // // 创建可读流

readerStream.setEncoding('UTF8'); // 设置编码为 utf8。


readerStream.pipe(process.stdout);
