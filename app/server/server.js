var http = require('http');
var path = require('path');

var _ = require('lodash');
var id3 = require('id3js');
var express = require('express');
var WSS = require('ws').Server;
var wsstream = require('websocket-stream');

var Walk = require(path.join(__dirname, 'walk.js'));
var Song = require(path.join(__dirname, 'song.js'));

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



wss.on('connection', function (ws) {
  console.log("New ws connection");

//  var id = setInterval(function () {
//    ws.send(JSON.stringify({
//      type: "debug",
//      data: process.memoryUsage()
//    }));
//  }, 5000);

  console.time("Song id3 parsed");

  Song.load(song, function (err, song) {
    console.time("Song id3 parsed");
    song.createReadStream().pipe(wsstream(ws));
  });

  ws.on('close', function () {
    console.log('stopping client interval');
  });
});