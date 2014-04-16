var assert = require('assert');
var join = require('path').join;
var HDDTrackSource = require(join(__dirname, '..', 'hdd.js'));
var _ = require('lodash');
var fs = require('fs');

describe('HDDTrackSource provides access to your local music library', function () {
  var testPath = join(__dirname, 'fixtures', 'flat');
  var testTrackTitles = ['Chia', 'Parachutes', 'Explanation Mark'];

  it('should require a root directory', function () {
    var hdd = new HDDTrackSource();
    assert.throws(function(){
      hdd.start();
    }, 'Root directory required');
  });

  it('should emit each track in a directory then emit "done"', function(done){
    var foundTracks = [];
    var hdd = new HDDTrackSource(testPath);

    hdd.on('add', function(track){
      foundTracks.push(track);
    });

    hdd.on('done', function() {
      var trackTitles = _.pluck(foundTracks, 'title');
      var diff = _.difference(trackTitles, testTrackTitles);
      assert.strictEqual(diff.length, 0);
      done();
    });

    hdd.start();
  });

  it('should allow you to request the track list in a single call', function(done){
    var hdd = new HDDTrackSource(testPath);

    hdd.getTracks(function(tracks){
      var titles = _.pluck(tracks, 'title');
      var diff = _.difference(titles, testTrackTitles);
      assert.strictEqual(diff.length, 0);
      done();
    });
  });

  it('should watch for added files and emit "add"', function (done) {
    var hdd = new HDDTrackSource(testPath);
    hdd.start();
    assert(false);
  });

  it('should watch for deleted files and emit "remove"', function (done) {
    assert(false);
  });

  it('should report mp3 and m4a as known file types', function(){
    var hdd = new HDDTrackSource();
    assert(hdd.isKnownFileType('something.mp3'));
    assert(hdd.isKnownFileType('something.m4a'));
  });

  it('should assign each track a unique id', function (done) {
    assert(false);
  });

  it('should provide id3 meta data for the file where available', function (done) {
    assert(false);
  });

  it('should allow you to request all mp3s', function (done) {
    assert(false);
  });

  it('should give you the meta data for the specified track by id', function (done) {
    assert(false);
  });

  it('should create a read stream for the specified track by id', function (done) {
    assert(false);
  });
});