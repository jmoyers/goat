var isNodeWebkit = (typeof(require) !== 'undefined');

if  (isNodeWebkit) {
   _ = require('lodash');
}

var app = angular.module('goat', []);

app.constant('config', {
   "isNodeWebkit": isNodeWebkit
});

var ws = new WebSocket('ws://localhost:8080');

app.controller('GoatController', ['$scope', 'config', function($scope, config) {
   $scope = _.extend($scope, config);

   $scope.artist = "Some Artist";
   $scope.album = "Some Album";
   $scope.title = "Some Title";

   ws.onmessage = function (event) {
      $scope.artist = JSON.parse(event.data);
      $scope.$apply();
   };

   this.debug = function(){
      require('nw.gui').Window.get().showDevTools();
   }
}]);