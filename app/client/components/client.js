var nodeWebkit = (typeof(process) !== 'undefined');

if (nodeWebkit) {
  _ = require('lodash');
}

var app = angular.module('goat', []);

app.constant('config', {
  nodeWebkit: nodeWebkit,
  stateURL: "ws://localhost:8080",
  mediaStreamURL: "ws://localhost:8080",
  debug: true
});

app.factory('MediaStream', ['config', function(config){
  return wss(config.mediaStreamURL);
}]);

app.service('AudioOutput', AudioOutput);

app.service('MediaPlayer', ['MediaStream', 'AudioOutput', function(mediaStream, audioOutput){
  this.PlayStates = {
    STOPPED: 0,
    PLAYING: 1,
    PAUSED: 2
  }

  this.trackSource = null;
  this.state = this.PlayStates.PAUSED;
  this.time = 0;
  this.volume = 1;
  this.muted = false;

  this.audioOutput = audioOutput;

  this.media = {
    title: "The Outsider",
    artist: "A Perfect Circle",
    album: "Thirteenth Step",
    year: 2004
  }

  this.mediaStream = mediaStream;

  this.mediaStream.pipe(this.audioOutput);

  this.playToggle = function(){
    if (this.isPlaying()) this.pause()
    else this.play();
  }

  this.play = function(){
    this.state = this.PlayStates.PLAYING;
    this.audioOutput.play();
  }

  this.pause = function(){
    this.state = this.PlayStates.PAUSED;
    this.audioOutput.pause();
  }

  this.next = function(){ }

  this.prev = function(){ }

  this.muteToggle = function(){
    var targetVolume = this.muted ? this.volume : 0;
    this.audioOutput.setVolume(targetVolume);
    this.muted = !this.muted;
  }

  this.isPlaying = function(){
    return this.state == this.PlayStates.PLAYING;
  }

  this.isPaused = function(){
    return this.state == this.PlayStates.PAUSED;
  }
}]);

app.controller('GoatController', ['$scope', 'config', function ($scope, config, player) {
  $scope = _.extend($scope, config);

  if (config.debug) {
    $scope.operationLoadTime = "0s";
    $scope.heapTotal = "0.00 MB";
    $scope.heapUsed = "0.00 MB";
  }

  $scope.debug = function () {
    require('nw.gui').Window.get().showDevTools();
  }
}]);

app.directive("player", ['MediaPlayer', function(player){
  return {
    restrict: "E",
    templateUrl: "components/player.html",
    replace: true,
    link: function(scope, element, attrs){
      var sizeButtonClass = {
        's': 'btn-sm',
        'm': '',
        'xs': 'btn-xs',
        'l': 'btn-lg'
      }

      scope.player = player;
      scope.size = sizeButtonClass[attrs.size] || '';
    }
  }
}]);

app.directive('toggleButton', function(){
  return {
    restrict: 'E',
    scope: {
      off: '@',
      on: '@',
      state: '@',
      notify: '&',
      size: '@'
    },
    replace: true,
    template: '<button ng-click="toggle()" class="btn btn-default {{size}}"><span class="glyphicon"></span></button>',
    link: function(scope, element){
      var state = scope.state;

      scope.toggle = function(){
        state = !state;
        scope.notify();
        changeClass();
      }

      var changeClass = function(){
        var remove = !state ? scope.off : scope.on;
        var add = state ? scope.off : scope.on;
        element.find('span').removeClass(remove).addClass(add);
      }

      changeClass();
    }
  }
});

var humanSize = function(size) {
  var i = Math.floor(Math.log(size) / Math.log(1024));
  return (size / Math.pow(1024, i)).toFixed(2) * 1
    + ' ' + ['B', 'kB', 'MB', 'GB', 'TB'][i];
};