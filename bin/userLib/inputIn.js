process.stdin.on('end', function() {
  process.stdout.write('end'); // stdout ：输出流
});

// stdin 标准输入流
function gets() {
  process.stdin.setEncoding('utf8');
  
  process.stdin.on('data', (chunk) => {
    console.log('start!');
    
    // 去掉下一行可一直监听输入，即保持标准输入流为开启模式
    process.stdin.pause();
    
    assert.equal(typeof chunk, 'string'); // todo
    console.log(`---: ${chunk}`);
  });
  
  console.log('试着在键盘敲几个字然后按回车吧');
}

module.exports = gets;

// scp sunyingying23@11.50.79.70:/export/App/js/app.js /
