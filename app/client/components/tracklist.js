app.directive("tracklist", function(){
  return {
    restrict: "E",
    templateUrl: "components/tracklist.html",
    replace: true,
    scope: {
      tracks: "=source"
    },
    link: function(scope, element){
      scope.onClickTrack = function($event){
        console.log($event.currentTarget);
      }
    }
  }
});