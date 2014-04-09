app.directive("player", function() {
  return {
    restrict: "E",
    templateUrl: "components/player.html",
    replace: true,
    scope: {
      player: "=controls"
    },
    link: function(scope, element, attrs){
      var sizeButtonClass = {
        's': 'btn-sm',
        'm': '',
        'xs': 'btn-xs',
        'l': 'btn-lg'
      }

      scope.size = sizeButtonClass[attrs.size] || '';
    }
  }
});

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