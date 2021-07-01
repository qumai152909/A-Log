const Client = require('ssh2').Client;


function connServer() {
  const conn = new Client();
  const remotePathToList = '/domain/creative/imp/';
  
  
  conn.on('ready', function() {
    conn.sftp(function(err, sftp) {
      if (err) throw err;
      
      sftp.readdir(remotePathToList, function(err, list) {
        if (err) throw err;
        console.log('uuuuueeueeueu');
        
        // List the directory in the console
        console.dir(list);
        // Do not forget to close the connection, otherwise you'll get troubles
        conn.end();
      });
    });
  }).on('error', function(err){
    console.log(err);
  }).connect({
    host: '11.50.79.70',
    port: '22', // 默认22
    username: 'sunyingying23',
    password: 'syy152909.SYY152909.',
    interactiveAuth: true,
    tryKeyboard: true,
  });
}

connServer();
