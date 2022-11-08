class UI {

  face_sprites = {};
  faces_middle = [];
  faces_left = [];
  faces_right = [];
  state;
  helm;
  helmoff;
  ui_display;
  currframe;
  currframe2;
  toggle;

  preload() {

    this.ui_banner = loadImage('engine/ui/banner.png');
    this.hud = loadImage('engine/ui/hud.png');
    this.helmeton = loadImage('engine/ui/helmeton.gif');
    this.helmetoff = loadImage('engine/ui/helmetoff.gif');
    this.vcr = loadImage('engine/ui/vcr.gif');
    this.helmsound = loadSound('engine/audio/sounds/player_sounds/helmet.mp3');

    this.faces_middle[0] = loadImage('engine/ui/skull.png');
    this.faces_middle[1] = loadImage('engine/ui/faces_middle/chad_middle_severe.png');
    this.faces_middle[2] = loadImage('engine/ui/faces_middle/chad_middle_high.png');
    this.faces_middle[3] = loadImage('engine/ui/faces_middle/chad_middle_mid.png')
    this.faces_middle[4] = loadImage('engine/ui/faces_middle/chad_middle_low.png');
    this.faces_middle[5] = loadImage('engine/ui/faces_middle/chad_middle_healthy.png');

    this.faces_right[0] = loadImage('engine/ui/skull.png');
    this.faces_right[1] = loadImage('engine/ui/faces_right/chad_right_severe.png');
    this.faces_right[2] = loadImage('engine/ui/faces_right/chad_right_high.png');
    this.faces_right[3] = loadImage('engine/ui/faces_right/chad_right_mid.png');
    this.faces_right[4] = loadImage('engine/ui/faces_right/chad_right_low.png');
    this.faces_right[5] = loadImage('engine/ui/faces_right/chad_right_healthy.png');

    this.faces_left[0] = loadImage('engine/ui/skull.png');
    this.faces_left[1] = loadImage('engine/ui/faces_left/chad_left_severe.png');
    this.faces_left[2] = loadImage('engine/ui/faces_left/chad_left_high.png');
    this.faces_left[3] = loadImage('engine/ui/faces_left/chad_left_mid.png');
    this.faces_left[4] = loadImage('engine/ui/faces_left/chad_left_low.png');
    this.faces_left[5] = loadImage('engine/ui/faces_left/chad_left_healthy.png');
  }


  setup() {
    noSmooth();
    this.doom_font = loadFont('fonts/game_over.ttf');
    this.doom_font2 = loadFont('fonts/doom2.ttf');
    this.helmsound.setVolume(0.3);
    textFont(this.doom_font);
    this.toggle = false;

    this.ui_display = false;
  }

  draw(world_data) {


    /* Or like this to avoid executing the ui code multiple times:
    
      let player_pos;
      let player_health;

      for (let player of world_data.players) {
        player_pos = player.pos;
        player_health = player.health;
      }sa


    */

    
    if (frameCount % 30 == 0) {
      this.framerate = Math.floor(frameRate());
    }
    this.keyPressed();
    this.keyPressed2();

    this.helmet_on();
    this.helmet_off();

    
    if(this.ui_display == true) {
      //image(this.ui_banner, SCREEN_WIDTH - this.ui_banner.width, SCREEN_HEIGHT - this.ui_banner.height);
      image(this.vcr,0,0,SCREEN_WIDTH,SCREEN_HEIGHT);
      image(this.hud,0,0, SCREEN_WIDTH, SCREEN_HEIGHT);
      this.draw_stat_ui(world_data);
      this.draw_face_state(world_data);
    }
    // console.log(this.toggle);



    
    fill(255);
    textSize(60);
    text(`FPS: ${this.framerate}`, 10, 30);
    text(`(${floor(world_data.players[0].pos.x)}, ${floor(world_data.players[0].pos.y)})`, 10, 55);
    text(`(${floor(world_data.players[0].vel.x)}, ${floor(world_data.players[0].vel.y)})`, 10, 80);
  }

  draw_stat_ui() {
    fill(250, 150, 150);
    textSize(130);
    for(let player of world_data.players) {
      fill(250, 150, 150);
      text(floor(player.health), 175 * (SCREEN_WIDTH / 1000), 855);
      fill(150, 150, 250);
      text(floor(player.armor), 175 * (SCREEN_WIDTH / 1000), 925);
      fill(150, 250, 150);
      text(floor(player.stamina), 750 * (SCREEN_WIDTH / 1000), 915);
    }
  }

  draw_face_state(world_data) {
    for (let player of world_data.players) {
      this.state = ceil(player.health/20);
      if (keyIsDown(keycodes.LEFT)) {
        image(this.faces_left[floor(player.health/20)], SCREEN_WIDTH/2.17, 
                                                        SCREEN_HEIGHT - this.ui_banner.height);  
      }
      else if (keyIsDown(keycodes.RIGHT)) {
        image(this.faces_right[floor(player.health/20)], SCREEN_WIDTH/2.17, 
                                                         SCREEN_HEIGHT - this.ui_banner.height);
      }
      else {
        image(this.faces_middle[floor(player.health/20)], SCREEN_WIDTH/2.17, 
                                                          SCREEN_HEIGHT - this.ui_banner.height);
      }
    }
  }


  helmet_on() {
    if(this.helm == true){
      //this.helmeton.setFrame(1);
      image(this.helmeton,0,0,SCREEN_WIDTH,SCREEN_HEIGHT);
      this.helmeton.play();
      this.currframe = this.helmeton.getCurrentFrame();
      // console.log(this.currframe);
      this.helmetoff.reset();
      this.helmoff = false;

      if(this.currframe == 15){
        this.helm = false;
        this.helmsound.play();
        this.ui_display = true;

      }
    }
  }

  helmet_off(){
    if(this.helmoff == true) {
      this.ui_display = false;
      this.currframe2 = this.helmetoff.getCurrentFrame();
      //hjthis.helmetoff.setFrame(1);
      image(this.helmetoff, 0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
      // console.log(this.currframe2);
      this.helmeton.reset();


      if(this.currframe2 == 14) {
        this.helmoff = false;


      }
    }

   
  }

  keyPressed() {
    if(keyCode == keycodes.H && this.toggle == true) {
      this.helmoff = true;
      this.helmon = false;
      this.helmsound.play();

      this.toggle = false; 
    }
  }


  keyPressed2() {
    if(keyCode == keycodes.J && this.toggle == false){
      this.helm = true;
      this.helmoff = false;
      this.toggle = true;

    }
  }

}
