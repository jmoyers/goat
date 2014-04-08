function AudioOutput() {
  Stream.Writable.call(this, {objectMode: true});

  this.startTime = 0;
  this.currTime = 0;

  this.playing = false;
  this.needsPlay = false;
  this.needsNewSource = true;

  var context = this.context = new webkitAudioContext();

  this.gainNode = context.createGainNode();
  this.gainNode.value = 0;

  this.audioSource = false;
  this.rawBuffer = false;
  this.decodedBuffer = false;

  // Composable decoder, later will factor into Duplex stream to use mp3.js
  this.decode =_.debounce(context.decodeAudioData.bind(context), 50, {
    leading: true,
    trailing: true
  });
}

util.inherits(AudioOutput, Stream.Writable);

AudioOutput.prototype.play = function(){
  this.needsPlay = true;
  this.startIfNeeded();
}

AudioOutput.prototype.pause = function(){
  this.needsPlay = false;
  this.stopIfNeeded();
}

AudioOutput.prototype.stop = function(){
  this.pause();
  this.startTime = 0;
  this.currTime = 0;
}

AudioOutput.prototype.setVolume = function(volume){
  console.log("Setting audio output to: " + volume);
  this.gainNode.gain.value = volume;
}

// Stream.Writable for input.pipe(output)
AudioOutput.prototype._write = function(chunk, enc, next){
  if (this.rawBuffer) {
    this.rawBuffer = AudioOutput.appendBuffer(this.rawBuffer, chunk.buffer);
  } else {
    this.rawBuffer = chunk.buffer;
  }

  this.decode(this.rawBuffer, this.onDecodeAudio.bind(this));
  next();
}

AudioOutput.prototype.onDecodeAudio = function(buffer){
  this.decodedBuffer = buffer;
  this.stopIfNeeded();
  this.startIfNeeded();
}

AudioOutput.prototype.stopIfNeeded = function(){
  if (!this.playing) return;

  this.audioSource.stop();
  this.needsNewSource = true;
  this.playing = false;
  this.currTime = this.context.currentTime - this.startTime;
}

AudioOutput.prototype.startIfNeeded = function(){
  if (!this.needsPlay) return;

  this.replaceSourceIfNeeded();

  if (this.audioSource) {
    this.audioSource.start(0, this.currTime);

    // Time keeping is broken still
    this.currTime = this.context.currentTime - this.startTime;
    this.startTime = this.context.currentTime - this.currTime;
    this.playing = true;
  }
}

AudioOutput.prototype.replaceSourceIfNeeded = function(){
  if (!this.needsNewSource || !this.decodedBuffer) return;

  // Overrite existing buffer, since we got new data, no API for append
  this.audioSource = this.context.createBufferSource();
  this.audioSource.buffer = this.decodedBuffer;

  // (Re)connect our volume and audio components to the speaker
  this.audioSource.connect(this.gainNode);
  this.gainNode.connect(this.context.destination);

  this.needsNewSource = false;
}

AudioOutput.appendBuffer = function(buffer1, buffer2) {
  var tmp = new Uint8Array(buffer1.byteLength + buffer2.byteLength);
  tmp.set(new Uint8Array(buffer1), 0);
  tmp.set(new Uint8Array(buffer2), buffer1.byteLength);
  return tmp.buffer;
}