app.directive('visualizer', function() {
  return {
    restrict: 'E',
    template: '<canvas class="w" ' +
      'style="position: absolute; top: 0; height: 100%; width: 400px;"' +
      '></canvas>',
    replace: true,
    scope: {
      data: '&'
    },
    link: function(scope, element){
      console.log(element);
      var ctx = element[0].getContext('2d');

      var height = element[0].offsetHeight;
      var width = element[0].offsetWidth;

      var gradient = ctx.createLinearGradient(0, 0, 0, 300);

      gradient.addColorStop(1, '#ff0000');
      gradient.addColorStop(0.75, '#ff0000');
      gradient.addColorStop(0.25, '#ff0000');
      gradient.addColorStop(0, '#f3f3f3');

      var draw = function(){
        var data = scope.data();
        var wratio = width / data.length;
        var hratio = height / 100;

        ctx.clearRect(0, 0, width, height);
        ctx.fillStyle = gradient;
        for (var i = 0, len = data.length; i < len; i += 1) {
          var value = data[i];
          ctx.fillRect(wratio * i, (height - (value * hratio)), 3, height);
        }

        requestAnimationFrame(draw);
      }

//      setInterval(draw, 2000);
      requestAnimationFrame(draw);
    }
  }
});