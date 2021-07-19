// SSH2库,  能够与服务器建立ssh连接,  轻松传输(下载和上传)文件
const Client = require('ssh2').Client; // 创建自己的sftp客户端构造函数

const isWin = /win\d{2}/i.test(process.platform);
let cwd = process.cwd()+(isWin?'\\':'/'); // 调用node命令执行脚本时的目录
// 在项目A-Log运行testBin文件，得到console.log(cwd)： /Users/sunyingying23/Github/A-Log/
// 暂时写死：
cwd = '/Users/sunyingying23/Github/A-Log/bin/asset-dev/';

const readdirFilesSync = require('../utils/readdirFilesSync'); // 遍历文件夹中所有文件

// 启动命令的参数，暂时写死
const argsStatic = {
  d: './',
  r: '/data/static/QA18/fe-vas-h5',
  h: '10.110.15.1',
  p: 'qa',
  u: 'qa',
  localroot: 'asset-dev',
  pub: true
};


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

// 获取本地目标目录中所有文件
function getLocalFileList() {
  const { d } = argsStatic;
  // -d ./ 部署当前目录下所有文件到服务器，此时目录=asset-dev
  if (d) {
    const readdirList = readdirFilesSync(cwd);
    //console.log(readdirList);
    return readdirList;
  }
}

// 主文件
function upFiles() {
  const fileList = getLocalFileList();
  
  // --pub 开始运行命令
  if (argsStatic.pub) {
    fileList && fileList.length && connServer(fileList);
  } else {
    console.log('如果运行，请添加运行命令 --pub');
  }
}

upFiles();
