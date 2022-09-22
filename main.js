const http = require('http');
const fs = require('fs');

// Check for unix Socket. If not found then process exit and log the error.
if (!process || !process.env || !process.env.APP_SOCKET) {
    console.error('No Process Socket Specified');
    process.exit(1);
}

// Log Process errors.
process.on('exit', code => {
    console.error(`Process exited with code: ${code}`)
});

process.on('SIGTERM', signal => {
    console.log(`Process ${process.pid} received a SIGTERM signal`);
    process.exit(0);
});

process.on('SIGINT', signal => {
    console.log(`Process ${process.pid} has been interrupted`);
    process.exit(0);
});

// Since we are listening on a unix socket we need to flush it on restarts.
try {
    if (fs.existsSync(process.env.APP_SOCKET)) {
        fs.unlinkSync(process.env.APP_SOCKET);
        console.log('Removed Socket');
    }
} catch(err) {
    console.error(err);
}

http.createServer(function (req, res) {
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end('Node Hello World!');
}).listen(process.env.APP_SOCKET, 'localhost', function(){
    fs.chmodSync(process.env.APP_SOCKET, '777');
    console.log('Update Socket Permissions');
});
