 
class Prop {

  directory;
  frames;
  name;

  sprite;

  height = 1;

  active_img;

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
      this.og_img_front = copy_image(this.img_front);

      this.spritesheet = loadSpriteSheet(`${this.directory}/${this.name}.png`, img.width/this.frames, img.height, this.frames);
    });
  }

  setup() {
    this.anim_front = loadAnimation(this.spritesheet);
    this.anim_front.frameDelay = 32;
    this.sprite.addAnimation('front', this.anim_front);
  }

  draw() {
  }

}