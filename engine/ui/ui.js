class UI {


  preload() {

    this.ui_banner = loadImage('engine/ui/banner.png');
    this.chad = loadSpriteSheet('engine/ui/work.png', 80, 100, 5);
    this.chad_anim = loadAnimation(this.chad);
    this.chad_anim.frameDelay = 80
  }

  setup() {
    noSmooth();
    this.doom_font = loadFont('fonts/minecraft.ttf');
    this.doom_font2 = loadFont('fonts/doom2.ttf');
    console.log(world_data.players);
    textFont(this.doom_font);



    this.ui_banner.resize(SCREEN_WIDTH, SCREEN_HEIGHT/ 10);
    //this.chad_anim.resize(100, 100);
    //this.chad.resize(100, 100);
  }

  framerate = 0;

  draw(world_data) {

    for (let player of world_data.players) {

      // do stuff regarding the player
    }

    /* Or like this to avoid executing the ui code multiple times:
    
      let player_pos;
      let player_health;

      for (let player of world_data.players) {
        player_pos = player.pos;
        player_health = player.health;
      }


    */


    fill(255);
    textSize(30);
    if (frameCount % 30 == 0)
      this.framerate = Math.floor(frameRate());
    text(`FPS: ${this.framerate}`, 10, 30);
    text(`(${floor(world_data.players[0].pos.x)}, ${floor(world_data.players[0].pos.y)})`, 10, 55);

    noStroke();
    image(this.ui_banner, SCREEN_WIDTH - this.ui_banner.width, SCREEN_HEIGHT - this.ui_banner.height);
    animation(this.chad_anim, SCREEN_WIDTH/2, SCREEN_HEIGHT-this.ui_banner.height/2);
    this.draw_health_ui(world_data);
    this.draw_armor_ui(world_data);
    this.draw_stamina_ui(world_data);
  
  }

  draw_health_ui() {
    fill(250, 150, 150);
    textSize(40);
    text('HEALTH', 300, 1000);
    textSize(80);
    
    for(let player of world_data.players) {
      text(player.health, 300, 965);
    }
  }

  draw_armor_ui() {
    fill(150, 150, 250);
    textSize(40);
    text('ARMOR', 600, 1000);
    textSize(80);
    for(let player of world_data.players) {
      text(player.armor, 600, 965);
    }
  }

  draw_stamina_ui() {
    fill(150, 250, 150);
    textSize(40);
    text('STAMINA', 10, 1000);
    textSize(80);
    for(let player of world_data.players) {
      text(player.stamina, 10, 965);
    }
  }
 
  
}