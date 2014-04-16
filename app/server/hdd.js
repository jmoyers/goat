var join = require('path').join;
var Walk = require(join(__dirname, 'walk.js'));
var MediaFile = require(join(__dirname, 'media-file.js'));
var EventEmitter = require('events').EventEmitter;
var inherits = require('util').inherits;
var _ = require('lodash');

function HDDTrackSource(root){
  this.known = ['mp3', 'm4a'];
  this.tracks = [];
  this.root = root;

  this.walkDone = false;
  this.pendingParse = 0;
}

inherits(HDDTrackSource, EventEmitter);

HDDTrackSource.prototype.setupWalk = function(){
  if(!this.root) throw new Error('Root directory required');

  this.walkDone = false;
  this.pendingParse = 0;

  this.walk = new Walk(this.root);
  this.walk.on('file', this.onwalkfile.bind(this));
  this.walk.on('done', this.onwalkdone.bind(this));
}

HDDTrackSource.prototype.isKnownFileType = function(file){
  return _.some(this.known, function(ft) {
    return ~file.indexOf(ft);
  });
}

HDDTrackSource.prototype.onwalkfile = function(file){
  if (!this.isKnownFileType(file)) return;

  var self = this;

  MediaFile.load(file, function(err, track){
    self.tracks.push(track);
    self.emit('add', track);
    self.pendingParse--;
    self.notifyIfFinished();
  });

  this.pendingParse++;
}

HDDTrackSource.prototype.onwalkdone = function(file){
  this.walkDone = true;
  this.notifyIfFinished();
}

HDDTrackSource.prototype.all = function(){
  return this.tracks;
}

HDDTrackSource.prototype.start = function(){
  this.setupWalk();
  this.walk.fetch();
}

HDDTrackSource.prototype.notifyIfFinished = function(){
  if (this.walkDone && this.pendingParse === 0) {
    this.emit('done', this.tracks);
  }
}

HDDTrackSource.prototype.getTracks = function(cb){
  if (this.tracks) {
    process.nextTick(function(){
      cb(this.tracks)
    }.bind(this));
  } else {
    this.once('done', cb);
    this.start();
  }
}

module.exports = HDDTrackSource;