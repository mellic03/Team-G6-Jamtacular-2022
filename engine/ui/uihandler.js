class UIHandler {


  ui_health = Player.fov;



  preload() {

    this.ui_banner = loadImage('engine/ui/banner.png');
  }

  setup() {

    imageMode(CENTER);
    
  }

  draw() {

    image(this.ui_banner,SCREEN_WIDTH/2,SCREEN_HEIGHT - this.ui_banner.height/2);

    text(100,200,950);

  }


}