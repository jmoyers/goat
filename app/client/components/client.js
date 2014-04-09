var app = angular.module('goat', []);

app.constant('config', {
  nodeWebkit: false,
  stateURL: "ws://localhost:8080",
  mediaStreamURL: "ws://localhost:8080",
  debug: true
});

app.factory('MediaStream', ['config', function(config){
  return wss(config.mediaStreamURL);
}]);

app.service('AudioOutput', AudioOutput);
app.service('MediaPlayer', ['MediaStream', 'AudioOutput', MediaPlayer]);

app.controller('GoatController', ['$scope', 'config', 'MediaPlayer', function ($scope, config, player) {
  $scope = _.extend($scope, config);

  $scope.player = player;

  $scope.tracks = [];

  for(var i = 0; i < 100; i++)
    $scope.tracks.push({
      title: "The Outsider",
      artist: "A Perfect Circle",
      album: "Thirteenth Step",
      duration: 500,
      year: 2004
    });

  if (config.debug) {
    $scope.operationLoadTime = "0s";
    $scope.heapTotal = "0.00 MB";
    $scope.heapUsed = "0.00 MB";
  }

  $scope.debug = function () {
    require('nw.gui').Window.get().showDevTools();
  }
}]);

var humanSize = function(size) {
  var i = Math.floor(Math.log(size) / Math.log(1024));
  return (size / Math.pow(1024, i)).toFixed(2) * 1
    + ' ' + ['B', 'kB', 'MB', 'GB', 'TB'][i];
};