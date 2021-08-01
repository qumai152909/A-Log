// SSH2库, 能够与服务器建立ssh连接,  轻松传输(下载和上传)文件
const Client = require('ssh2').Client; // 创建自己的sftp客户端构造函数

const isWin = /win\d{2}/i.test(process.platform);

// 在项目A-Log运行upFilesBin文件，cwd = /Users/sunyingying23/Github/A-Log/
let cwd = process.cwd()+(isWin?'\\':'/'); // 调用node命令执行脚本时的目录

// 暂时写死：todo
cwd = '/Users/sunyingying23/Github/A-Log/bin/asset-dev/';

// 连接服务器
function connServer(fileList) {
  const conn = new Client();
  const remotePathToList = '/webApp/'; // 服务器上要访问的目录
  
  // ready事件：验证成功
  conn.on('ready', () => {
    console.log('Client :: ready');
    // client.sftp()方法启动 SFTP 会话; 第二个参数是SFTPStream
    conn.sftp((err, sftp) => {
      if (err) throw err;
      
      // sftp.readdir() = Retrieves a directory listing = 检索目录中的所有内容
      sftp.readdir(remotePathToList, (err, list) => {
        if (err) throw err;
        console.log('uuuuueeueeueu');
        
        // List the directory in the console
        console.dir(list);
        // Do not forget to close the connection, otherwise you'll get troubles
        conn.end();
      });
    });
  }).on('error', err => {
    console.log(`connect error: ${err}`);
  }).connect({
    host: '120.27.215.50', // Hostname or IP address of the server
    port: '22', // 默认22
    username: 'root',
    password: 'SYY152909.',
    interactiveAuth: true,
    tryKeyboard: true,
  }); // 尝试连接到服务器
}
