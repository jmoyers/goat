var assert = require('assert');

describe('HDDTrackSource', function(){
  it('should require a root directory', function(done) {
    done();
  });

  describe('#subscribe', function(){
    it('should watch for additions, deletions, udpates for all files', function(done){
      done();
    });

    it('should assign each track a unique id', function(done){
      done();
    });

    it('should provide id3 meta data for the file where available', function(done){
      done();
    });
  });

  describe('#unsubscribe', function(){
    it('should allow you to stop receiving updates for tracks from this source', function(done){
      done();
    });
  })

  describe('#all', function() {
    it('should allow you to request files of type aac, mp3', function (done) {
      done();
    });
  });

  describe('#stream', function(){
    it('should create a read stream for the specified track by id', function(done){
      done();
    });
  });
});