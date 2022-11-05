class UI {

  face_sprites = {};

  preload() {

    this.ui_banner = loadImage('engine/ui/banner.png');
    this.face_sprites.chad_state_1 = loadSpriteSheet('engine/ui/work.png', 80, 100, 5);
    this.face_sprites.chad_state_2 = loadSpriteSheet('engine/ui/hurt.png', 80, 100, 5);
    this.face_sprites.chad_state_3 = loadSpriteSheet('engine/ui/mod_dmg.png', 80, 100, 5);
    this.face_sprites.chad_state_4 = loadSpriteSheet('engine/ui/sev_dmg.png', 80, 100, 5);
    this.face_sprites.chad_state_5 = loadSpriteSheet('engine/ui/dng_dmg.png', 80, 100, 5);
    this.chad_anim = loadAnimation(this.face_sprites.chad_state_1);
    this.chad_anim2 = loadAnimation(this.face_sprites.chad_state_2);
    this.chad_anim3 = loadAnimation(this.face_sprites.chad_state_3);
    this.chad_anim4 = loadAnimation(this.face_sprites.chad_state_4);
    this.chad_anim5 = loadAnimation(this.face_sprites.chad_state_5);


    this.chad_anim.frameDelay = 80;
    this.chad_anim2.frameDelay = 80;

  }


  setup() {
    noSmooth();
    this.doom_font = loadFont('fonts/game_over.ttf');
    this.doom_font2 = loadFont('fonts/doom2.ttf');
    textFont(this.doom_font);
    console.log(this.face_sprites);



    this.ui_banner.resize(SCREEN_WIDTH, SCREEN_HEIGHT/ 10);
    //this.chad_anim.resize(100, 100);
    //this.chad.resize(100, 100);
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

    fill(255);
    textSize(60);
    if (frameCount % 30 == 0)
      this.framerate = Math.floor(frameRate());
    text(`FPS: ${this.framerate}`, 10, 30);
    text(`(${floor(world_data.players[0].pos.x)}, ${floor(world_data.players[0].pos.y)})`, 10, 55);

    noStroke();
    image(this.ui_banner, SCREEN_WIDTH - this.ui_banner.width, SCREEN_HEIGHT - this.ui_banner.height);
    this.draw_health_ui(world_data);
    this.draw_armor_ui(world_data);
    this.draw_stamina_ui(world_data);
    this.draw_face_state(world_data);
  
  }

  draw_face_state(world_data) {
    for (let player of world_data.players) {
      if (player.health === 100) {
        animation(this.chad_anim, SCREEN_WIDTH/2, SCREEN_HEIGHT-this.ui_banner.height/2);
      } else {
        animation(this.chad_anim2, SCREEN_WIDTH/2, SCREEN_HEIGHT-this.ui_banner.height/2);
      }
    }
  }

  draw_health_ui() {
    fill(250, 150, 150);
    textSize(80);
    text('HEALTH', 300 * (SCREEN_WIDTH / 1000), 1000);
    textSize(160);
    
    for(let player of world_data.players) {
      text(floor(player.health), 300 * (SCREEN_WIDTH / 1000), 965);

    }

  }

  draw_armor_ui() {
    fill(150, 150, 250);
    textSize(80);
    text('ARMOR', 600 * (SCREEN_WIDTH / 1000), 1000);
    textSize(160);
    for(let player of world_data.players) {
      text(floor(player.armor), 600 * (SCREEN_WIDTH / 1000), 965);
    }
  }

  draw_stamina_ui() {
    fill(150, 250, 150);
    textSize(80);
    text('STAMINA', 0 * (SCREEN_WIDTH / 1000), 1000);
    textSize(160);
    for(let player of world_data.players) {
      text(floor(player.stamina), 10 * (SCREEN_WIDTH / 1000), 965);
    }
  }
 
  
}