class AudioHandler {


  tracks = {};


  constructor() {
    
  }

  preload() {

    /* object properties can be created by accessing them for the first time
      this.tracks.map1_track1 = loadSound() blah blah blah I cant remember how sound works
    */

      this.tracks.map1_track1 = loadSound('sound/track1.mp3')
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

    if (world_data.map_handler.active_map.name == "map1")
    {
      if (this.audio_lock == false) {
        this.tracks.map1_track1.loop();
        this.tracks.map1_track1.setVolume(0);
        this.audio_lock = true;
      }
    }

  }

}