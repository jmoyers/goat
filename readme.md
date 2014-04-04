# Goat

The sturdy, fast, open source music player.

## Thoughts:
* Open source
* Fast with big datasets (100k songs should be no problem)
* Don't focus on the album art as first principle, focus on the list of music and controls
* Focus on synchability with dropbox or some other type of storage (no fucking library conflicts)
* Multiple sources for music (pluggable). Examples: your hard disk, twitter stream, a web page, youtube

 ## Architecture:
 * Node-webkit based implementation to take advantage of html for display and node libraries for fs, id3, etc
 * Keep the "server"/"client" implm relatively separate so that we can go to a client server model as necessary
 * Agnostic to storage provider (synch with Dropbox as first target)
 * WebGL based music visualizations
 * Pluginless (native html5 audio APIs as much as possible)
 * Mobile is a big question...
