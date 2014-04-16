var assert = require('assert');
var join = require('path').join;
var fs = require('fs');
var MediaFile = require(join(__dirname, '..', 'media-file.js'));

describe('MediaFile parses meta data and provides a read stream for mp3/m4a files', function () {
  it('should be able to parse metadata for an mp3', function (done) {
    var file = join(__dirname, 'fixtures', 'flat', '1.mp3');
    var title = 'Chia';
    var artist = ['Four Tet'];
    var album = 'Rounds';
    var year = '2003';
    var trackno = {no: 32, of: 0};
    var art = [];

    MediaFile.load(file, function (err, track) {
      assert(!err);
      assert(file === track.file);
      assert(title === track.title);
      assert(album === track.album);
      assert(year === track.year);
      assert.deepEqual(trackno, track.track);
      assert.deepEqual(artist, track.artist);
      assert.deepEqual(art, track.art);
      done();
    });
  });

  it('should be able to parse metadata for an m4a', function (done) {
    var file = join(__dirname, 'fixtures', 'flat', '3.m4a');
    var title = 'Explanation Mark';
    var artist = ['The Books'];
    var album = 'The Lemon of Pink';
    var year = '2006';
    var trackno = {no: 6, of: 13};
    var art = [
      {
        format: 'jpg',
        data: fs.readFileSync(join(__dirname, 'fixtures', 'flat', 'lemon.jpg'))
      }
    ];

    MediaFile.load(file, function (err, track) {
      assert(!err);
      assert(file === track.file);
      assert(title === track.title);
      assert(album === track.album);
      assert(year === track.year);
      assert.deepEqual(trackno, track.track);
      assert.deepEqual(artist, track.artist);
      assert.deepEqual(art, track.art);
      done();
    });
  });
});