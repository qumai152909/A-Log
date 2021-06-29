process.stdin.on('end', function() {
  process.stdout.write('end');
});


function gets() {
  process.stdin.setEncoding('utf8');
  
  process.stdin.on('data', (chunk) => {
    console.log('start!');
    // 去掉下一行可一直监听输入，即保持标准输入流为开启模式
    process.stdin.pause();
    
    assert.equal(typeof chunk, 'string');
    console.log(`---: ${chunk}`);
  });
  
  console.log('试着在键盘敲几个字然后按回车吧');
}

module.exports = gets;