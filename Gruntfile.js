var spawn = require('child_process').spawn;

module.exports = function (grunt) {
  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('./package.json'),
    nodewebkit: {
      options: {
        build_dir: './build',
        win: true,
        mac: false,
        linux32: false,
        linux64: false
      },
      src: [
        './package.json',
        './app/client/**',
        './app/server/**',
        './node_modules/**'
      ]
    },
    watch: {
      scripts: {
        files: '**/*.js',
        tasks: ['default'],
        options: {
          interrupt: true
        }
      }
    },
    uglify: {
      my_target: {
        files: {
          'app/client/dist/client.min.js': [
            'app/client/components/vendor/websocket-stream/websocket-stream.js',
            'app/client/services/audio-output.js',
            'app/client/components/vendor/lodash/dist/lodash.js',
            'app/client/components/vendor/jquery/dist/jquery.js',
            'app/client/components/vendor/angular/angular.js',
            'app/client/components/client.js'
          ]
        }
      }
    },
    cssmin: {
      combine: {
        files: {
          'app/client/dist/client.min.css': [
            'app/client/dist/css/client.css'
          ]
        }
      }
    },
    less:{
      development: {
        options: {
          paths: ["app/client/components/"]
        },
        files: {
          "app/client/dist/css/client.css" : "app/client/components/client.less"
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-less');

  grunt.registerTask('default', ['less', 'cssmin', 'uglify']);

  grunt.registerTask('launchWebkitApp', 'After build, run the generated node-webkit process.', function () {
    console.log("Launching node webkit instance for goat...");

    var child = spawn('C:/Users/Joshua/Documents/GitHub/goat/build/releases/goat/win/goat/goat.exe', [], {
      detached: true
    });

    child.unref();
  });

  grunt.loadNpmTasks('grunt-node-webkit-builder');
  grunt.registerTask('deployNodeWebkit', ['nodewebkit', 'launchWebkitApp']);
};