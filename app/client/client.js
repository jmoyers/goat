var nodeWebkit = (typeof(require) !== 'undefined');

if (nodeWebkit) {
  _ = require('lodash');
}

var app = angular.module('goat', []);

app.constant('config', {
  nodeWebkit: nodeWebkit,
  debug: true
});

var ws = new WebSocket('ws://localhost:8080');

app.controller('GoatController', ['$scope', 'config', function ($scope, config) {
  $scope = _.extend($scope, config);

  var PlayStates = {
    STOPPED: 0,
    PLAYING: 1,
    PAUSED: 2
  }

  if (config.debug) {
    $scope.operationLoadTime = "0s";
    $scope.heapTotal = "0.00 MB";
    $scope.heapUsed = "0.00 MB";
  }

  $scope.artist = "Some Artist";
  $scope.album = "Some Album";
  $scope.title = "Some Title";

  $scope.playState = PlayStates.PLAYING;

  var ws = new WebSocket("ws://localhost:8080");
  ws.binaryType = "arraybuffer";

  var context = new webkitAudioContext();
  var rawBuffer = false;
  var audioSource = false;

  ws.onmessage = function (message) {
    console.log("Received chunk");

    if (rawBuffer) rawBuffer = appendBuffer(rawBuffer, message.data);
    else rawBuffer = message.data;

    context.decodeAudioData(rawBuffer, function(buffer){
      console.log("Decoded buffer");

      // Stop the existing buffer
      if (audioSource && $scope.playState == PlayStates.PLAYING) {
        audioSource.stop();
      }

      audioSource = context.createBufferSource();

      audioSource.buffer = buffer;
      audioSource.connect(context.destination);

      if ($scope.playState == PlayStates.PLAYING){
        audioSource.start(0, context.currentTime);
      }
    });
  }

  this.clickedPlay = function(){
    console.log("Clicked");

    if ($scope.playState == PlayStates.PLAYING) {
      console.log("Pausing playback");
      audioSource.stop();
      $scope.playState = PlayStates.PAUSED;
    } else {
      console.log("Starting playback");
      audioSource.start(0, context.currentTime);
      $scope.playState = PlayStates.PLAYING;
    }
  }

  this.debug = function () {
    require('nw.gui').Window.get().showDevTools();
  }
}]);

var appendBuffer = function(buffer1, buffer2) {
  var tmp = new Uint8Array(buffer1.byteLength + buffer2.byteLength);
  tmp.set(new Uint8Array(buffer1), 0);
  tmp.set(new Uint8Array(buffer2), buffer1.byteLength);
  return tmp.buffer;
};

var humanSize = function(size) {
  var i = Math.floor(Math.log(size) / Math.log(1024));
  return (size / Math.pow(1024, i)).toFixed(2) * 1
    + ' ' + ['B', 'kB', 'MB', 'GB', 'TB'][i];
};