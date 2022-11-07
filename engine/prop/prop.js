 
class Prop {

  directory;
  frames;
  name;

  sprite;

  height = 1;
  collision_radius = 10;

  active_img; og_active_img;
  spritesheet; og_spritesheet;
  
  pos = new Vector2(0, 0);
  
  constructor(x, y, directory, frames, name) {
    this.pos.x = x;
    this.pos.y = y;
    this.directory = directory;
    this.frames = frames;
    this.name = name;
  }

  preload() {
    this.sprite = new Sprite();

    loadImage(`${this.directory}/${this.name}.png`, (img) => {
      this.img_front = img;
      this.active_img = this.img_front;
      this.og_active_img = copy_image(this.img_front);

      this.spritesheet = loadSpriteSheet(img, img.width/this.frames, img.height, this.frames);
    });

  }

  setup() {
    this.anim_front = loadAnimation(this.spritesheet);
    this.anim_front.frameDelay = 32;
    this.sprite.addAnimation('front', this.anim_front);
  }

  draw() {

  }

  set_occlusion(x1, x2) {

    let width = this.active_img.width;
    let height = this.active_img.height;
  
    let row = 4*width;

    for (let x=x1; x<=x2; x++) {
      for (let y=0; y<height; y++) {
        this.active_img.pixels[row*y + 4*x+3] = 0;
      }
    }
    this.active_img.updatePixels();
  }

}