var id3 = require('id3js');
var Walk = require('./walk.js');
var express = require('express');
var app = express();
var http = require('http');
var path = require('path');
var WebSocketServer = require('ws').Server;
var clientPath = path.join(__dirname, '..', 'client');

console.log("Client static files: " + clientPath);

app.use(express.static(clientPath));

var server = http.createServer(app);
server.listen(8080);

console.log("Listening on 8080");

var wss = new WebSocketServer({server: server});
console.log("Starting websocket server");

wss.on('connection', function(ws) {
   console.log("New ws connection");

   var id = setInterval(function() {
      ws.send(JSON.stringify(process.memoryUsage()));
   }, 1000);

   console.log('started client interval');

   ws.on('close', function() {
      console.log('stopping client interval');
      clearInterval(id);
   });
});

var library = "C:/Users/Joshua/Dropbox/iTunes/iTunes Music";
var song = library + "/A Perfect Circle/Thirteenth Step/06 A Stranger.mp3";



