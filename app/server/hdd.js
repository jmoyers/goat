var join = require('path').join;
var Walk = require(join(__dirname, 'walk.js'));
var MediaFile = require(join(__dirname, 'media-file.js'));
var EventEmitter = require('events').EventEmitter;
var inherits = require('util').inherits;
var _ = require('lodash');

function HDDTrackSource(){
  this.known = ['mp3', 'm4a'];
  this.tracks = [];
  this.root = "";
}

inherits(HDDTrackSource, EventEmitter);

HDDTrackSource.prototype.setRoot = function(root){
  this.root = root;
  this.tracks = [];
  this.emit('reset');

  this.walk = new Walk(this.root);
  this.walk.on('file', this.onwalkfile.bind(this));
  this.walk.on('done', this.onwalkdone.bind(this));
  this.walk.fetch();
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
  });
}

HDDTrackSource.prototype.onwalkdone = function(file){
  this.emit('done');
}

HDDTrackSource.prototype.all = function(){
  return this.tracks;
}

HDDTrackSource.prototype.meta = function(){}
HDDTrackSource.prototype.stream = function(){}