var mm = require('musicmetadata');
var fs = require('fs');

function MediaFile(file, md) {
  this.file = file;
  this.title = md.title;
  this.artist = md.artist;
  this.album = md.album;
  this.year = md.year;
  this.track = md.track;
  this.art = md.picture;
}

MediaFile.load = function (file, cb) {
  var parser = mm(fs.createReadStream(file), {duration: true});

  // This fires multiple times for m4a's (for no apparent reason)
  parser.once('metadata', function(data){
    // This sometimes shows up as a UTC format, sometimes just as year
    data.year = data.year.length > 3 ? data.year.slice(0, 4) : false;

    cb(null, new MediaFile(file, data));
  });

  parser.on('done', function(err){
    if (err) cb(err);
  });
}

MediaFile.prototype.createReadStream = function (cb) {
  if (!this.file) cb(new Error("No file specified"));
  return fs.createReadStream(this.file);
}

module.exports = MediaFile;