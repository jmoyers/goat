Goat
========
A music player that focuses on letting you build ways to discover music

Premise
-----------
* Open source (??)
* Node-webkit based implementation to take advantage of html for display and node libraries for fs, id3, etc
* Fast with big datasets (100k songs should be no problem)
* Don't focus on the album art as first principle, focus on the list of music and controls
* Responsive design or a toggle should allow you to utilize the space for album art
* Focus on synchability with dropbox or some other type of storage (no fucking library conflicts)
* Multiple sources for music (pluggable). Examples: your hard disk, twitter stream, a web page, youtube
* Pluggable visualisations - based on analyser node to start
    * Should be able to take over the main tracklisting area with a visualisation
    * Should be able to full screen the visualisation
    * Example so far is visualiser.js which uses an analyser node and canvas
    * Should be able to use WebGL or three.js
* Keep it roughly server/client based (flexibility to later do a SaSS approach for mobile as necessary)
* RPC approach for data stores so that we can use the same interfaces for services?
* Pluggable - allow multiple datastores, visualizations, 3rd party data sources for music (APIs like hypem for instance)
* Agnostic to storage provider (synch with Dropbox as first target)
* No browser plugins, native html5 APIs wherever possible (may limit the youtube consumption...)


Code
-----------
* Binary websocket stream for media
* Media tracks source = a data provider that gives a list of media in an array
    * Default = your own hard disk
    * Second = a webpage which parses for mp3 files
* [x] Service: Media player = all state associated with currently playing track
    * [x] Service: Media stream = high level api for connecting a binary stream to low level browser media api
        * [x] Service: Audio context = low level api for playing audio
        * ServiceProvider: Codec = low level api for decoding audio -- using default `decodeAudioData` so far
            * node-webkit does not ship a few decoders by default (gpl)
            * Provide which codec we'd like a service for
            * One is the native context.decodeAudioData -- depend on sister audio context
            * Aurora style https://github.com/ofmlabs/aurora.js/
                * flac.js
                * aac.js
                * jsmad (mp3) - https://github.com/audiocogs/jsmad
* Media tracks view = a view of all the media from a given source(s)
* Local filesystem tracklisting
    * Generate a list of files on the server from a directory on up
    * Data structure
        * File path
        * An id so that we can request a binary stream
        * All id3 stuff
    * In the app, we switch to this datasource and request a list
        * We probably want to cache it if we've already requested it
        * We should probably cache it hard in the localStorage, since 100k songs is a lot
        * How should we handle full text search? Probably on the client side since, why not?
        * We should not do full text search with angular filters because that implies they are DOM elements
        * Means we should have a non-scope version of the listing, and a scope version of the listing that updates