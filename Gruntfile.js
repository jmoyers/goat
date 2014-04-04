var spawn = require('child_process').spawn;

module.exports = function(grunt) {
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
               'app/dist/client.min.js': [
                  'app/client/bower/lodash/dist/lodash.js',
                  'app/client/bower/angular/angular.js',
                  'app/client/bower/jquery/dist/jquery.js'
               ]
            }
         }
      },
      cssmin: {
         combine: {
            files: {
               'app/dist/client.min.css': [
                  'app/client/bower/bootstrap/dist/css/bootstrap.css',
                  'app/client/index.css'
               ]
            }
         }
      }
   });

   grunt.loadNpmTasks('grunt-contrib-watch');
   grunt.loadNpmTasks('grunt-contrib-jshint');
   grunt.loadNpmTasks('grunt-contrib-uglify');
   grunt.loadNpmTasks('grunt-contrib-cssmin');

   grunt.registerTask('default', ['cssmin', 'uglify']);


   grunt.registerTask('launchWebkitApp', 'After build, run the generated node-webkit process.', function() {
      console.log("Launching node webkit instance for goat...");

      var child = spawn('C:/Users/Joshua/Documents/GitHub/goat/build/releases/goat/win/goat/goat.exe', [], {
         detached: true
      });

      child.unref();
   });

   grunt.loadNpmTasks('grunt-node-webkit-builder');
   grunt.registerTask('deployNodeWebkit', ['nodewebkit', 'launchWebkitApp']);
};