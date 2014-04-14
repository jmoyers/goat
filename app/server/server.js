var http = require('http');
var path = require('path');

var _ = require('lodash');
var express = require('express');
var WSS = require('ws').Server;
var wsstream = require('websocket-stream');

var MediaFile = require(path.join(__dirname, 'media-file.js'));

var clientPath = path.join(__dirname, '..', 'client');

// Set up express to serve our static client files
var app = express();
app.use(express.static(clientPath));

// Create an http server instance so we can attach ws later
var server = http.createServer(app);
server.listen(8080);

console.log("Listening on 8080");

// Attach our websocket server for general app state
var wss = new WSS({server: server});


var library = "C:/Users/Joshua/Dropbox/iTunes/iTunes Music";
var song = library + "/A Perfect Circle/Thirteenth Step/06 A Stranger.mp3";
//var song = "C:/Users/Joshua/Downloads/test.mp3"

wss.on('connection', function (ws) {
  console.log("New ws connection");

//  var id = setInterval(function () {
//    ws.send(JSON.stringify({
//      type: "debug",
//      data: process.memoryUsage()
//    }));
//  }, 5000);

  MediaFile.load(song, function (err, track) {
    track.createReadStream().pipe(wsstream(ws));
  });

  ws.on('close', function () {
    console.log('stopping client interval');
  });
});