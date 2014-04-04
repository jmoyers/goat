var spawn = require('child_process').spawn;

module.exports = function(grunt) {

   // Project configuration.
   grunt.initConfig({
      pkg: grunt.file.readJSON('./package.json'),
      nodewebkit: {
         options: {
            build_dir: './build',
            mac: false,
            win: true,
            linux32: false,
            linux64: false
         },
         src: ['./app/*']
      }
   });

   grunt.registerTask('launchApp', 'After build, run the generated node-webkit process.', function() {
      console.log("Launching node webkit instance for goat...");

      var child = spawn('C:/Users/Joshua/Documents/GitHub/goat/build/releases/goat/win/goat/goat.exe', [], {
         detached: true
      });

      child.unref();
   });

   grunt.loadNpmTasks('grunt-node-webkit-builder');

   // Default task(s).
   grunt.registerTask('default', ['nodewebkit', 'launchApp']);

};