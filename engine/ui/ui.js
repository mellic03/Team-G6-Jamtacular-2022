class UI {


  preload() {

  }

  setup() {

  }

  framerate = 0;

  draw() {
    fill(0);
    textSize(24);
    if (frameCount % 30 == 0)
      this.framerate = Math.floor(frameRate());
    text(`FPS: ${this.framerate}`, 10, 30);
  }

  
}