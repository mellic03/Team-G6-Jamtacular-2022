 
class Pickup {

  directory;
  frames;
  name;

  sprite;

  height = 1;

  active_img; og_active_img;
  spritesheet; og_spritesheet;

  pos = new Vector2(0, 0);
  
  constructor(x, y, directory, name) {
    this.pos.x = x;
    this.pos.y = y;
    this.directory = directory;
    this.name = name;
  }

  preload() {
    this.sprite = new Sprite();

    loadImage(`${this.directory}/${this.name}.png`, (img) => {
      this.img_front = img;
      this.active_img = this.img_front;
      this.og_active_img = copy_image(this.img_front);

      this.spritesheet = loadSpriteSheet(img, img.width, img.height, 1);
    });
  }

  setup() {
    this.anim_front = loadAnimation(this.spritesheet);
    this.sprite.addAnimation('front', this.anim_front);
  }

  draw() {
    
  }
}