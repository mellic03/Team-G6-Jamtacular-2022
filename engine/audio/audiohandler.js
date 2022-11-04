class AudioHandler {


  tracks = {};


  constructor() {
    
  }

  preload() {

    /* object properties can be created by accessing them for the first time
      this.tracks.map1_track1 = loadSound() blah blah blah I cant remember how sound works
    */
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

  }

}