var fs = require('fs');
var join = require('path').join;
var EventEmitter = require('events').EventEmitter;
var inherits = require('util').inherits;
var async = require('async');

function Walk(root) {
  this.root = root;
  this.files = [];
}

inherits(Walk, EventEmitter);

Walk.prototype.fetch = function () {
  this.walk(this.root, this.emit.bind(this, 'done', this.files));
}

Walk.prototype.walk = function (path, done) {
  if (!path) return this.emit('error', new Error('Invalid path'));

  var self = this;

  fs.stat(path, function (err, stats) {
    if (err) return self.emit('error', err);

    if (stats.isDirectory()) {
      fs.readdir(path, function (err, files) {
        if (err) return self.emit('error', err);

        files = files.map(function(file){
          return join(path, file);
        });

        // Recurse and call done when everythings finished
        async.each(files, self.walk.bind(self), done);
      });
    } else if (stats.isFile()) {
      self.files.push(path);
      self.emit('file', path);

      done();
    }

    // Might be more here, naive implementation for now
  });
}

module.exports = Walk;