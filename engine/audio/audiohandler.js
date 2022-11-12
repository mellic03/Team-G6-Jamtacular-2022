class AudioHandler {

  tracks = {};
  active_track;

  constructor() {
    
  }

  preload() {
    /* object properties can be created by accessing them for the first time
      this.tracks.map1_track1 = loadSound() blah blah blah I cant remember how sound works
    */
    this.tracks.m1 = loadSound('engine/audio/sounds/music/track1.mp3');
    this.tracks.m2 = this.tracks.m1;
    this.tracks.m3 = loadSound('engine/audio/sounds/music/track3.mp3');
    this.tracks.m4 = loadSound('engine/audio/sounds/music/track4.mp3');
    this.tracks.m5 = loadSound('engine/audio/sounds/music/track5.mp3');
    this.tracks.m6 = loadSound('engine/audio/sounds/music/track2.mp3');
  }

  setup() {

  }

  draw(world_data) {

    if (world_data.ui_handler.intro_playing || world_data.ui_handler.outro_playing)
      this.active_track?.setVolume(0);

    else
      this.active_track?.setVolume(world_data.ui_handler.music_volume_slider.value());


    if (world_data.map_handler.transitioning == true)
    {
      this.active_track?.pause();
      this.tracks[world_data.map_handler.active_map.name]?.loop();
      this.active_track = this.tracks[world_data.map_handler.active_map.name];
      world_data.map_handler.transitioning = false;

      if (world_data.ui_handler.intro_playing) {
        this.active_track?.setVolume(0);
      }
    }

  }
}