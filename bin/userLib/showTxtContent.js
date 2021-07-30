// 打印出txt文件的内容
// 注意此处的相对路径，是相对于node执行bin文件时所在目录：./bin/data/wow.txt

const fs = require('fs');

const readerStream = fs.createReadStream('./bin/data/wow.txt'); // // 创建可读流

readerStream.setEncoding('UTF8'); // 设置编码为 utf8。

readerStream.pipe(process.stdout); // 显示
