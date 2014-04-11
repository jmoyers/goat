app.directive('visualizer', function() {
  return {
    restrict: 'E',
    template: '<canvas class="visualiser"></canvas>',
    replace: true,
    scope: {
      analyser: '='
    },
    link: function(scope, element){
      var ctx = element[0].getContext('2d');
      var parent = element[0].parentNode;
      var height = 0;
      var width = 0;
      var barWidth = 0;
      var heightScale = 0;
      var dirty = true;

      function matchParentPosition(){
        element[0].height = $(parent).innerHeight();
        element[0].width = $(parent).innerWidth();
        $(element[0]).css('right',$(parent).css('marginRight'));
        dirty = true;
      }

      $(window).resize(matchParentPosition);
      setTimeout(matchParentPosition, 0);

      var draw = function(){
        var data = new Uint8Array(scope.analyser.frequencyBinCount);
        scope.analyser.getByteFrequencyData(data);

        if (dirty) {
          height = element[0].offsetHeight;
          width = element[0].offsetWidth;

          barWidth = width / data.length;
          heightScale = height / (255 * 1.5);

          dirty = false;
        }

        ctx.clearRect(0, 0, width, height);
        ctx.fillStyle = "#00A9D9";

        for (var i = 0; i < data.length - 1; i += 1) {
          ctx.fillRect(barWidth * i, height - (data[i+1] * heightScale), barWidth, height);
        }

        requestAnimationFrame(draw);
      }

      requestAnimationFrame(draw);
    }
  }
});