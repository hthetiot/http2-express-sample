// Require Modules
var fs = require('fs');
var http = require('http');

var express = require('express');
var http2 = require('http2.js');

// Create Express Application
var app = express();

// Make HTTP2 work with Express (this must be before any other middleware)
require('express-http2-workaround')({ express:express, http2:http2, app:app });

// Setup HTTP/1.x Server
var httpServer = http.Server(app);
httpServer.listen(8080,function(){
  console.log("Express HTTP/1 server started");
});

// Setup HTTP/2 Server
var httpsOptions = {
    'key' : fs.readFileSync(__dirname + '/certs/private.key'),
    'cert' : fs.readFileSync(__dirname + '/certs/public.crt'),
    'ca' : fs.readFileSync(__dirname + '/certs/public.crt')
};
var http2Server = http2.createServer(httpsOptions,app);
http2Server.listen(8443,function(){
  console.log("Express HTTP/2 server started");
});

// Serve some content
app.get('/', function(req,res){
    res.send('Hello World! Via HTTP '+req.httpVersion);
});
