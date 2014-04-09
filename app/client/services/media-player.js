function MediaPlayer(mediaStream, audioOutput){
  this.PlayStates = {
    STOPPED: 0,
    PLAYING: 1,
    PAUSED: 2
  }

  this.trackSource = null;
  this.state = this.PlayStates.PAUSED;
  this.time = 0;
  this.volume = 1;
  this.muted = false;

  this.audioOutput = audioOutput;

  this.media = {
    title: "The Outsider",
    artist: "A Perfect Circle",
    album: "Thirteenth Step",
    year: 2004
  }

  this.mediaStream = mediaStream;

  this.mediaStream.pipe(this.audioOutput);

  this.playToggle = function(){
    if (this.isPlaying()) this.pause()
    else this.play();
  }

  this.play = function(){
    this.state = this.PlayStates.PLAYING;
    this.audioOutput.play();
  }

  this.pause = function(){
    this.state = this.PlayStates.PAUSED;
    this.audioOutput.pause();
  }

  this.next = function(){ }

  this.prev = function(){ }

  this.muteToggle = function(){
    var targetVolume = this.muted ? this.volume : 0;
    this.audioOutput.setVolume(targetVolume);
    this.muted = !this.muted;
  }

  this.isPlaying = function(){
    return this.state == this.PlayStates.PLAYING;
  }

  this.isPaused = function(){
    return this.state == this.PlayStates.PAUSED;
  }

  this.setMedia = function(media, tracklisting){
    this.media = media;
    this.requestMedia();
  }

  this.requestNewMedia = function(){
    this.mediaStream.write(this.media.id);
  }
}