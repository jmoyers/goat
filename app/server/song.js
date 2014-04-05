var id3 = require('id3js');
var EventEmitter = require('events').EventEmitter;
var util = require('util');
var fs = require('fs');

function Song(file, tags) {
  this.file = file;
  this.title = tags.title;
  this.artist = tags.artist;
  this.album = tags.album;
  this.year = tags.year;
  this.track = tags.v1.track;
  this.albumArt = tags.v2.image;
}

Song.load = function (file, cb) {
  id3({ file: file, type: id3.OPEN_LOCAL }, function (err, tags) {
    if (err) return cb(err);
    cb(err, new Song(file, tags));
  });
}

Song.prototype.createReadStream = function (cb) {
  if (!this.file) cb(new Error("No file specified"));
  return fs.createReadStream(this.file);
}

module.exports = Song;