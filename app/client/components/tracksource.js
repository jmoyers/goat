function TrackSource(){
  this.listing = [];
}

// Request the listing from the server
TrackSource.prototype.request = function(){}

// Local full text search
TrackSource.prototype.search = function(){}

// Do I need an update from the server?
TrackSource.prototype.hash = function(){}

// Store the current listing in local storage
TrackSource.prototype.saveLocal = function(){}