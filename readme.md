Goat
--------
The sturdy, fast, open source music player.

Thoughts
=========
* Open source
* Fast with big datasets (100k songs should be no problem)
* Don't focus on the album art as first principle, focus on the list of music and controls
* Focus on synchability with dropbox or some other type of storage (no fucking library conflicts)
* Multiple sources for music (pluggable). Examples: your hard disk, twitter stream, a web page, youtube

Architecture
==========
* Node-webkit based implementation to take advantage of html for display and node libraries for fs, id3, etc
* Keep it roughly server/client based so that we can go to real boy client server model as necessary
* Agnostic to storage provider (synch with Dropbox as first target)
* WebGL based music visualizations
* Pluginless (no flash, native html5 audio APIs as much as possible)
* Pluggable - allow multiple datastores, visualizations, 3rd party data sources for music (APIs like hypem for instance)
* Mobile is a big question...
