var id3 = require('id3js');
var express = require('express');
var app = express();
var http = require('http');
var path = require('path');
var Walk = require(path.join(__dirname, 'walk.js'));
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
      var memUsage = process.memoryUsage();
      console.log("sending memory usage " + JSON.stringify(memUsage));
      ws.send(JSON.stringify(memUsage));
   }, 3000);

   console.log('started client interval');

   ws.on('close', function() {
      console.log('stopping client interval');
      clearInterval(id);
   });
});

var library = "C:/Users/Joshua/Dropbox/iTunes/iTunes Music";
var song = library + "/A Perfect Circle/Thirteenth Step/06 A Stranger.mp3";



