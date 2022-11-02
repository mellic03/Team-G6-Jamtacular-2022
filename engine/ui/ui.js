class UI {


  preload() {

    this.ui_banner = loadImage('engine/ui/banner.png');
    this.chad = loadSpriteSheet('engine/ui/work.png', 80,100,5);
    this.chad_anim = loadAnimation(this.chad)
    this.chad_anim.frameDelay = 80
  }

  setup() {

    this.doom_font = loadFont('fonts/DOOM.ttf');
    this.doom_font2 = loadFont('fonts/doom2.ttf');


    this.ui_banner.resize(SCREEN_WIDTH, SCREEN_HEIGHT/ 10);
    //this.chad_anim.resize(100,100);
    //this.chad.resize(100,100)
    console.log(this.chad_anim);
  }

  framerate = 0;

  draw() {
    fill(0);
    textSize(24);
    if (frameCount % 30 == 0)
      this.framerate = Math.floor(frameRate());
    //text(`FPS: ${this.framerate}`, 10, 30);
    image(this.ui_banner, SCREEN_WIDTH - this.ui_banner.width, SCREEN_HEIGHT - this.ui_banner.height);
    animation(this.chad_anim, SCREEN_WIDTH/2, SCREEN_HEIGHT-this.ui_banner.height/2);
    textFont(this.doom_font);
    textSize(80);
    fill(200,0,0);
    text('100', 360, 990);
    textSize(200);
    textFont(this.doom_font2);
    //text('CO',375, 500)
    textFont(this.doom_font)
    //text('OM', 510, 500)
  }

  
}