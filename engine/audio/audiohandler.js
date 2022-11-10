class AudioHandler {


  tracks = {};


  constructor() {
    
  }

  preload() {

    /* object properties can be created by accessing them for the first time
      this.tracks.map1_track1 = loadSound() blah blah blah I cant remember how sound works
    */

      this.tracks[0] = loadSound('engine/audio/sounds/music/track1.mp3');
      this.tracks[1] = loadSound('engine/audio/sounds/music/track2.mp3');
      this.tracks[2] = loadSound('engine/audio/sounds/music/track3.mp3');
      this.tracks[3] = loadSound('engine/audio/sounds/music/track4.mp3');

  }

  setup() {

  }

  audio_lock = false;

  draw(world_data) {

    // if (world_data.active_map.name == "map1")
    // {
    //   if (this.audio_lock == false) {
    //     sound.play();
    //     this.audio_lock = true;
    //   }
    // }

    if (world_data.map_handler.active_map.name == "m1")
    {
      if (this.audio_lock == false)
      {
        this.tracks[0].loop();
        this.tracks[0].setVolume(0.7);
        this.audio_lock = true;
      }
    }

    if (world_data.map_handler.active_map.name == "m3")
    {
      if (this.audio_lock == true)
      {
        this.tracks[0].stop();
        this.tracks[2].loop();
        this.tracks[2].setVolume(0.4);
        this.audio_lock = false;
      }
    }

    if (world_data.map_handler.active_map.name == "m4")
    {
      if (this.audio_lock == false)
      {
        this.tracks[2].stop();
        this.tracks[1].loop();
        this.tracks[1].setVolume(0.4);
        this.audio_lock = true;
      }
    }

  }

}