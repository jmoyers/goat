var fs = require('fs'),
   path = require('path'),
   EventEmitter = require('events').EventEmitter,
   util = require('util');

function Walk(root) {
   this.root = path(path.resolve(root||'.'));
   this.files = [];
}

util.inherits(Walk, EventEmitter);

Walk.prototype.walk = function(){
   this.check(this.root);
   return this;
}

Walk.prototype.check = function(next) {
   if (!next) return this.emit('error', "Empty path");

   fs.stat(next, function(err, stats) {
      if (stats.isDirectory()) {
         fs.readdir(next, function (err, files) {
            console.log(files);
         });
      } else if (stats.isFile()) {
         this.files.push(stats);
         this.emit('file', {
            name: this.root,
            stats: stats
         });
         this.emit('done', this.files);
      }
   });
}

module.exports = Walk;