class UI {

  face_sprites = {};
  faces_middle = [];
  faces_left = [];
  faces_right = [];
  faces_cocaine = [];
  armor_sprites = [];
  state;
  helm;
  helmoff;
  helm_sound;
  ui_display;
  currframe;
  currframe2;
  toggle;
  playbutton;
  slider;
  col;



  preload() {

    this.hud = loadImage('engine/ui/player_sprites/hud.png');

    this.armor_sprites[2] = loadImage('engine/ui/player_sprites/break0.png');
    this.armor_sprites[1] = loadImage('engine/ui/player_sprites/break1.png');
    this.armor_sprites[0] = loadImage('engine/ui/player_sprites/break2.png');

    this.pain = loadImage('engine/ui/player_sprites/pain.png')
    this.helmeton = loadImage('engine/ui/player_sprites/helmeton.gif');
    this.helmetoff = loadImage('engine/ui/player_sprites/helmetoff.gif');
    this.helmsound = loadSound('engine/ui/player_sounds/helmet.mp3');

    this.faces_cocaine[0] = loadImage('engine/ui/faces_cocaine/chad_middle_cocaine.png');
    this.faces_cocaine[1] = loadImage('engine/ui/faces_cocaine/chad_left_cocaine.png');
    this.faces_cocaine[2] = loadImage('engine/ui/faces_cocaine/chad_right_cocaine.png');

    this.faces_middle[0] = loadImage('engine/ui/player_sprites/skull.png');
    this.faces_middle[1] = loadImage('engine/ui/faces_middle/chad_middle_severe.png');
    this.faces_middle[2] = loadImage('engine/ui/faces_middle/chad_middle_high.png');
    this.faces_middle[3] = loadImage('engine/ui/faces_middle/chad_middle_mid.png')
    this.faces_middle[4] = loadImage('engine/ui/faces_middle/chad_middle_low.png');
    this.faces_middle[5] = loadImage('engine/ui/faces_middle/chad_middle_healthy.png');

    this.faces_right[0] = loadImage('engine/ui/player_sprites/skull.png');
    this.faces_right[1] = loadImage('engine/ui/faces_right/chad_right_severe.png');
    this.faces_right[2] = loadImage('engine/ui/faces_right/chad_right_high.png');
    this.faces_right[3] = loadImage('engine/ui/faces_right/chad_right_mid.png');
    this.faces_right[4] = loadImage('engine/ui/faces_right/chad_right_low.png');
    this.faces_right[5] = loadImage('engine/ui/faces_right/chad_right_healthy.png');

    this.faces_left[0] = loadImage('engine/ui/player_sprites/skull.png');
    this.faces_left[1] = loadImage('engine/ui/faces_left/chad_left_severe.png');
    this.faces_left[2] = loadImage('engine/ui/faces_left/chad_left_high.png');
    this.faces_left[3] = loadImage('engine/ui/faces_left/chad_left_mid.png');
    this.faces_left[4] = loadImage('engine/ui/faces_left/chad_left_low.png');
    this.faces_left[5] = loadImage('engine/ui/faces_left/chad_left_healthy.png');
  }


  setup() {
    noSmooth();
    this.col = color(200, 50, 50, 100);
    this.doom_font = loadFont('fonts/game_over.ttf');
    this.doom_font2 = loadFont('fonts/doom2.ttf');
    this.helmsound.setVolume(0.3);
    textFont(this.doom_font);
    this.toggle = false;
    this.helm_sound = true;
    this.ui_display = false;
    this.playbutton = createButton('coom');
    this.playbutton.position(400,500);
    this.playbutton.size(200,75);
    this.playbutton.style('background-color', 'red');
    this.playbutton.style('font-style', this.doom_font);
 

  }

  draw(world_data) {
    this.col = color(200,50,50);


    let player = world_data.players[0];
    player.health = clamp(player.health, 0, 100);
    player.armor = clamp(player.armor, 0, 100);
  


   



    

    
    if (frameCount % 30 == 0) {
      this.framerate = Math.floor(frameRate());
    }
    this.keyPressed();
    this.keyPressed2();

    this.helmet_on();
    this.helmet_off();


    if(this.ui_display == true) {
      this.draw_armor_state(world_data);
      image(this.hud,0,0, SCREEN_WIDTH, SCREEN_HEIGHT);
      this.draw_stat_ui(world_data);
      this.draw_face_state(world_data);
      this.playbutton.hide();


      for(let player of world_data.players) {
        if(player.stimmed_up_on_ritalin == true){
          this.draw_cocaine_face();
          player.stamina += 0.1;
        }else{

        }
      }
    }else {
      this.playbutton.show();


    }



    this.draw_low_health(world_data);
    this.playbutton.mousePressed(this.draw_rect)
    


    fill(255);
    textSize(60);
    text(`FPS: ${this.framerate}`, 10, 30);
    text(`(${floor(world_data.players[0].pos.x)}, ${floor(world_data.players[0].pos.y)})`, 10, 55);
    text(`(${floor(world_data.players[0].vel.x)}, ${floor(world_data.players[0].vel.y)})`, 10, 80);
  }

  draw_stat_ui(world_data) {
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
        image(this.faces_left[this.state], SCREEN_WIDTH/2.17, 
                                           SCREEN_HEIGHT - 100);  
      }
      else if (keyIsDown(keycodes.RIGHT)) {
        image(this.faces_right[this.state], SCREEN_WIDTH/2.17, 
                                            SCREEN_HEIGHT - 100);
      }
      else {
        image(this.faces_middle[this.state], SCREEN_WIDTH/2.17, 
                                             SCREEN_HEIGHT - 100);
      }
    }
  }



  
  draw_cocaine_face() {

    if (keyIsDown(keycodes.LEFT)) {
      image(this.faces_cocaine[1], SCREEN_WIDTH / 2.17, 
                                   SCREEN_HEIGHT - 100);  
    }else if (keyIsDown(keycodes.RIGHT)) {
      image(this.faces_cocaine[2], SCREEN_WIDTH/2.17, 
                                   SCREEN_HEIGHT - 100);
    }else {
      image(this.faces_cocaine[0], SCREEN_WIDTH/2.17, 
                                   SCREEN_HEIGHT - 100);
    }
  
    
  }

  draw_armor_state(world_data) {
    for (let player of world_data.players) {
      this.state = ceil(player.armor/50);
      image(this.armor_sprites[this.state], -50, 50, SCREEN_WIDTH+50, SCREEN_HEIGHT-200);
    }

  }

  draw_low_health(world_data) {
    for(let player of world_data.players) {
      if(player.health < 20) {
        image(this.pain, 0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);

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

      if(this.currframe == 11 && this.helm_sound == true) {
        this.helmsound.play()
        this.helm_sound = false;
      }

      if(this.currframe == 15){
        this.helm = false;
        this.ui_display = true;
        this.helm_sound = true;

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

  draw_rect() {

    rect(700,700,100,100);

  }

}
