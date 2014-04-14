var assert = require('assert');
var join = require('path').join;
var HDDTrackSource = require(join(__dirname, '..', 'hdd.js'));

describe('HDDTrackSource', function(){
  it('should require a root directory', function(done) {
    done();
  });

  it('should watch for added files and emit "added"', function(done) {
    done();
  });

  it('should watch for deleted files and emit "remove"', function(done){
    done();
  });

  it('should assign each track a unique id', function(done){
    done();
  });

  it('should provide id3 meta data for the file where available', function(done){
    done();
  });

  describe('#all', function() {
    it('should allow you to request all mp3s', function (done) {
      done();
    });
  });

  describe('#meta', function(){
    it('should give you the meta data for the specified track by id', function(done){
      done();
    });
  });

  describe('#stream', function(){
    it('should create a read stream for the specified track by id', function(done){
      done();
    });
  });
});