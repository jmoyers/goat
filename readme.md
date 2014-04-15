Goat
========
A music player that lets you take control

* Tailor the way you discover new music
* Don't sacrifice your mp3 library
* Find ways to buy music that actually benefit the artist

Mission
-----------
* Be in control of how you find out about new music, whether its twitter, a blog, reddit, or youtube
* Have full access to your local mp3 library as well
* Steaming music platforms are great for the casual consumer, terrible for individual artists
    * http://musicbybradleyjames.wordpress.com/2012/05/07/hey-can-you-spotify-me-some-cash-an-indie-artists-perspective/
    * http://www.billboard.com/biz/articles/news/1176619/another-indie-slams-spotify
    * http://www.billboard.com/biz/articles/news/1176562/spotify-responds-to-indie-criticism
    * http://i.imgur.com/7smqcWW.jpg
    * And so on....
* Do all of the above with speed and beauty (coming soon?)

![Goat WIP](http://dl.dropboxusercontent.com/u/47558221/clarify/2014-04-14-00h04m/localhost-8080---Google-Chrome-sm.png)

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
* [x] Binary websocket stream for media
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
* [x] tracklist = a view of all the media from a given source(s)
* Server service architecture
    * We need to be able to CRUD tracksources
    * We need to be able to request a binary stream
    * Both of these things can be done via http or websockets
    * Map RPC to rest interface and websockets sounds nice
    * Really only need one, but lets do both for giggles to prove this post:
        * http://stackoverflow.com/questions/6339393/how-can-socket-io-and-restful-work-together/6365213#6365213
* [x] tracksource = a service for requesting and searching a tracklisting
    * Server service structure
        * List all tracksources
        * Create new tracksource of type
        * Request all data from a tracksource
        * Request a binary stream of a track -- should we flatten this?
    * Tracklistings have a type -- local file system, website, twitter user, API
    * They also have an ID, since there can be multiple websites, twitter users, APIs
    * Server broadcasts available types (introspected from a plugin directory at startup)
    * Server allows you to create new tracksources based on an input (website, twitter user etc)
    * Data
        * Type -- hdd, twitter, etc
        * Id -- server broadcast id, references a particular source
        * Tracks -- here's the base datastore
            * Track
                * File path/url
                * An id -- so that we can request a binary stream
                * The track info
                    * All id3 stuff
                    * Youtube meta data
                    * Do we normalize this in some fashion?
                    * Duration
                    * Date posted (if we can figure that out)
                    * Date added to tracklist
        * TrackView -- here's what goes on angular scope (post search filter)
    * In the app, we switch to this datasource and request a list
        * We probably want to cache it if we've already requested it
        * How should we handle full text search? Probably on the client side since, why not?
        * We should not do full text search with angular filters because that implies they are DOM elements
        * Means we should have a non-scope version of the listing, and a scope version of the listing that updates
        * [opt] We should probably cache it hard in the localStorage, since 100k songs is a lot
