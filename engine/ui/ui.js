// Dirty globals
ratio_x = 1;
ratio_y = 1;


function draw_button(txt, x, y, callback, param = "")
{
  const width = 180, height = 30;

  const xcond = mouseX > x && mouseX < x+width;
  const ycond = mouseY > y && mouseY < y+height;

  let rectfill = 255;
  let textfill = 0;

  if (xcond && ycond) {
    rectfill = 0;
    textfill = 255;

    if (mouseIsPressed)
      callback(param);
  }

  textAlign(CENTER, CENTER);

  strokeWeight(0);

  rectMode(CORNER);
  fill(rectfill);
  rect(x, y, width, height, 10);
  
  fill(textfill);
  textSize(64);
  text(txt, x+width/2, y+height/2 - 5);
}

const MAIN_MENU = 0, CONTROLS_MENU = 1, SETTINGS_MENU = 2;

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

  intro_video;
  intro_playing = true;

  outro_video;
  outro_playing = false;

  effects_volume_slider;
  music_volume_slider;
  fov_slider;
  res_slider;

  pistol_checkbox;

  menu_state = MAIN_MENU;

  preload() {

    this.intro_video = createVideo("engine/ui/intro.webm", () => {
      this.intro_video.looping = false;
      this.intro_video.position(0, 0);
      this.intro_video.volume(1);
      this.intro_video.speed(1);
      this.intro_video.showControls();
      this.intro_video.onended((vid) => {
        vid.hide();
        world_data.ui_handler.intro_playing = false;
        world_data.audio_handler.active_track.setVolume(
          world_data.ui_handler.music_volume_slider.value()
        );
      })
    });

    this.outro_video = createVideo("engine/ui/ending.webm", () => {
      this.outro_video.looping = false;
      this.outro_video.position(0, 0);
      this.outro_video.volume(1);
      this.outro_video.speed(1);
      this.outro_video.hide();
    });

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
    this.doom_font = loadFont('fonts/game_over.ttf');
    this.doom_font2 = loadFont('fonts/doom2.ttf');
    this.helmsound.setVolume(0.3);
    textFont(this.doom_font);
    this.toggle = false;
    this.helm_sound = true;
    this.ui_display = false;

    this.effects_volume_slider = createSlider(0, 1, 0.3, 0.1);
    this.effects_volume_slider.style('width', '180px');
    this.effects_volume_slider.position(100, 225);
    this.effects_volume_slider.hide();

    this.music_volume_slider = createSlider(0, 1, 1, 0.1);
    this.music_volume_slider.style('width', '180px');
    this.music_volume_slider.position(100, 300);
    this.music_volume_slider.hide();

    this.fov_slider = createSlider(0.4, 4, 1, 0.1);
    this.fov_slider.style('width', '180px');
    this.fov_slider.position(100, 375);
    this.fov_slider.hide();

    this.res_slider = createSlider(1, 64, 1, 1);
    this.res_slider.style('width', '180px');
    this.res_slider.position(100, 450);
    this.res_slider.hide();
  

    this.pistol_checkbox = createSlider(0, 1, 0, 1);
    this.pistol_checkbox.style('width', '180px');
    this.pistol_checkbox.position(100, 525);
    this.pistol_checkbox.hide();

    console.log(this.intro_video)
  }

  draw(world_data) {

    if (this.intro_playing) {
      background(0);

      draw_button("SKIP", 825, 510, () => {
        this.intro_video.stop();
        this.intro_video.hide();
        this.intro_playing = false;
        world_data.ui_handler.intro_playing = false;
        world_data.audio_handler?.active_track.setVolume(
          world_data.ui_handler.music_volume_slider.value()
        );
      })
      return;
    }

    if (this.outro_playing) {
      this.draw_menu();
      return;
    }



    ratio_x = scr_wdth/1000;
    ratio_y = scr_hght/1000;

    let player = world_data.players[0];
    player.health = clamp(player.health, 0, 100);
    player.armor = clamp(player.armor, 0, 100);

    player.fov_modifier = this.fov_slider.value();

    if (frameCount % 30 == 0) {
      this.framerate = Math.floor(frameRate());
    }

    this.keyPressed();
    this.keyPressed2();

    this.helmet_on();
    this.helmet_off();

    imageMode(CENTER);

    if (game_paused) {
      this.draw_menu();
    }

    else {

      if (keyIsDown(keycodes.P)) {
        this.pause();
      }

      if (this.ui_display == true) {
        this.draw_armor_state(world_data);
        imageMode(CENTER);
        image(this.hud, scr_wdth/2, scr_hght/2, scr_wdth, scr_hght*1.01);
        this.draw_stat_ui(world_data);
        this.draw_face_state(world_data);
  
  
        for (let player of world_data.players) {
          if (player.stimmed_up_on_ritalin == true){
            this.draw_cocaine_face();
            player.stamina += 0.1;
          }
        }
      }
  
      this.draw_low_health(world_data);
      
      // strokeWeight(1);
      // fill(255);
      // textSize(60);
      // text(`FPS: ${this.framerate}`, 10, 30);
      // text(`(${floor(world_data.players[0].pos.x)}, ${floor(world_data.players[0].pos.y)})`, 10, 55);
    }

    if (!this.outro_playing) {
      textAlign(LEFT, CENTER);
      textSize(64);
      fill(255);
      text("P: pause", 10, 20);
    }

  }

  unpause() {
    game_paused = false;
    requestPointerLock();
  }

  pause() {
    game_paused = true;
    exitPointerLock();
    this.music_volume_slider.show();
  }

  draw_menu() {

    if (this.outro_playing) {
      this.outro_video.show();
      this.outro_video.showControls();

      return;
    }

    textSize(128);
    strokeWeight(1);
    textAlign(CENTER, CENTER);
    text(`SLITHER-BOY RESCUE`, scr_wdth/2,  scr_hght/8);

    switch (this.menu_state)
    {
      case (MAIN_MENU):     this.draw_main_menu();      break;
      case (CONTROLS_MENU): this.draw_controls_menu();  break;
      case (SETTINGS_MENU): this.draw_settings_menu();  break;
    }
  }
  
  draw_main_menu() {

    this.effects_volume_slider.hide();
    this.music_volume_slider.hide();
    this.fov_slider.hide();
    this.res_slider.hide();
    this.pistol_checkbox.hide();

    draw_button("Get Morbin'", 100, 200, this.unpause, this.music_volume_slider);
    draw_button("Controls", 100, 250, (ui) => ui.menu_state = CONTROLS_MENU, this);
    draw_button("Settings", 100, 300, (ui) => ui.menu_state = SETTINGS_MENU, this);
  }

  draw_controls_menu() {
    
    // rectMode(CORNER);
    // fill(255);
    // rect(100, 190, 200, 400);

    draw_button("Back", 100, 150, (ui) => ui.menu_state = MAIN_MENU, this);

    textAlign(LEFT, CENTER);
    textSize(48);

    strokeWeight(2);
    stroke(0);
    fill(255);
    text("PAUSE: P", 100, 200);
    text("ATTACK: SPACEBAR", 100, 225);
    text("MOVEMENT: WASD", 100, 250);
    text("LOOK: arrows or mouse", 100, 275);
    
  }

  draw_settings_menu() {
    draw_button("Back", 100, 150, (ui) => ui.menu_state = MAIN_MENU, this);
    textAlign(LEFT, CENTER);
    stroke(0);
    fill(0);
    text(`Effects Volume: ${this.effects_volume_slider.value()*100}%`, 100, 200);
    this.effects_volume_slider.show();
    const val = this.effects_volume_slider.value();
    for (let enemy of map_handler.active_map.enemies) {
      enemy.sound_death.setVolume(val);
      enemy.sound_injury.setVolume(val);
      enemy.sound_attack.setVolume(val);
    }
    text(`Music Volume: ${this.music_volume_slider.value()*100}%`, 100, 275);
    this.music_volume_slider.show();
    text(`FOV Scale: ${this.fov_slider.value()}`, 100, 350);
    this.fov_slider.show();
    text(`Raycast Quality: 1/${this.res_slider.value()}`, 100, 425);
    this.res_slider.show();
    world_data.audio_handler.active_track.setVolume(this.music_volume_slider.value());
    
    text(`${this.pistol_checkbox.value() == 0 ? "NO GUN" : "YES GUN"}`, 100, 500);
    this.pistol_checkbox.show();
    world_data.players[0].has_pistol = this.pistol_checkbox.value();
    
  }

  draw_stat_ui(world_data) {
    fill(250, 150, 150);
    textSize(130*ratio_y);
    let player = world_data.players[0];
    fill(250, 150, 150);
    text(floor(player.health), 175*ratio_x, 855*ratio_y);
    fill(150, 150, 250);
    text(floor(player.armor), 175*ratio_x, 925*ratio_y);
    fill(150, 250, 150);
    text(floor(player.stamina), 750*ratio_x, 915*ratio_y);
  }

  draw_face_state(world_data) {
    let player = world_data.players[0];
    this.state = ceil(player.health/20);
    if (keyIsDown(keycodes.LEFT)) {
      image(this.faces_left[this.state], scr_wdth/2, scr_hght-50);  
    }
    else if (keyIsDown(keycodes.RIGHT)) {
      image(this.faces_right[this.state], scr_wdth/2, scr_hght-50);
    }
    else {
      image(this.faces_middle[this.state], scr_wdth/2, scr_hght-50);
    }
  }
  
  draw_cocaine_face() {

    if (keyIsDown(keycodes.LEFT)) {
      image(this.faces_cocaine[1], scr_wdth/2, scr_hght-50);  
    }
    else if (keyIsDown(keycodes.RIGHT)) {
      image(this.faces_cocaine[2], scr_wdth/2, scr_hght-50);
    }
    else {
      image(this.faces_cocaine[0], scr_wdth/2, scr_hght-50);
    }
  }

  draw_armor_state(world_data) {
    imageMode(CORNER)
    for (let player of world_data.players) {
      this.state = ceil(player.armor/50);
      image(this.armor_sprites[this.state], -50*ratio_x, 50*ratio_y, scr_wdth+50*ratio_x, scr_hght-200*ratio_y);
    }
  }

  draw_low_health(world_data) {
    for (let player of world_data.players) {
      if (player.health < 20) {
        image(this.pain, scr_wdth/2, scr_hght/2, scr_wdth, scr_hght);

      }
    }
  }

  helmet_on() {

    if (this.helm == true){
      //this.helmeton.setFrame(1);
      image(this.helmeton,0,0,scr_wdth,scr_hght);
      this.helmeton.play();
      this.currframe = this.helmeton.getCurrentFrame();
      // console.log(this.currframe);
      this.helmetoff.reset();

      if (this.currframe == 11 && this.helm_sound == true) {
        this.helmsound.play()
        this.helm_sound = false;
      }

      if (this.currframe == 15){
        this.helm = false;
        this.ui_display = true;
        this.helm_sound = true;

      }
    }
  }

  helmet_off() {
    if (this.helmoff == true) {
      this.ui_display = false;
      this.currframe2 = this.helmetoff.getCurrentFrame();
      image(this.helmetoff, 0, 0, scr_wdth, scr_hght);
      this.helmeton.reset();

      if (this.currframe2 == 14) {
        this.helmoff = false;
      }
    }
   
  }

  keyPressed() {
    if (game_paused == true && this.toggle == true) {
      this.helmoff = true;
      this.helmon = false;
      this.helmsound.play();

      this.toggle = false; 
    }
  }


  keyPressed2() {
    if (game_paused == false && this.toggle == false){
      this.helm = true;
      this.helmoff = false;
      this.toggle = true;

    }
  }

}
