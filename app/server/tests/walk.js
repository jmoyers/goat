var assert = require('assert');
var join = require('path').join;
var Walk = require(join('..', 'walk.js'));
var _  = require('lodash');

describe('Walk', function(){
  it('should emit an error if no path is provided', function(done){
    var walk = new Walk();
    walk.on('error', function(err){
      done();
    });
    walk.fetch();
  });

  it('should emit no files and a done event with an empty directory', function(done){
    var files = 0;

    var walk = new Walk(join(__dirname,'fixtures','empty'));

    walk.on('file', function(){
      files++;
    });

    walk.on('done', function(){
      assert(files == 0);
      done();
    });

    walk.fetch();
  });

  it('should emit each file in a directory', function(done) {
    var walk = new Walk(join(__dirname,'fixtures','flat'));

    var results = [];

    walk.on('file', function (file) {
      results.push(file);
    });

    walk.on('done', function (files) {
      var real = [
        join(__dirname,'fixtures','flat','1.mp3'),
        join(__dirname,'fixtures','flat','2.mp3'),
        join(__dirname,'fixtures','flat','3.m4a')
      ];

      var diffEach = _.difference(real, results);
      var diffAll = _.difference(real, files);

      assert(diffEach.length == 0);
      assert(diffAll.length == 0);
      done();
    });

    walk.fetch();
  });

  it('should also emit when recursing into subdirectories', function(done){
    var walk = new Walk(join(__dirname,'fixtures','recursive'));

    var results = [];

    walk.on('file', function(file){
      results.push(file);
    });

    walk.on('done', function(files){
      var real = [
        join(__dirname,'fixtures','recursive','1.mp3'),
        join(__dirname,'fixtures','recursive','2.mp3'),
        join(__dirname,'fixtures','recursive','3.m4a'),
        join(__dirname,'fixtures','recursive','one','1.mp3'),
        join(__dirname,'fixtures','recursive','one','2.mp3'),
        join(__dirname,'fixtures','recursive','one','3.m4a'),
        join(__dirname,'fixtures','recursive','one','two','1.mp3'),
        join(__dirname,'fixtures','recursive','one','two','2.mp3'),
        join(__dirname,'fixtures','recursive','one','two','3.m4a')
      ];

      var diffEach = _.difference(results, real);
      var diffAll = _.difference(files, real);

      assert(diffEach.length == 0);
      assert(diffAll.length == 0);
      done();
    });

    walk.fetch();
  });
});