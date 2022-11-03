 
class Prop {

  directory;
  sprite;

  active_img;

  img_front;        og_img_front;
  img_back;         og_img_back;
  img_left;         og_img_left;
  img_front_angle;  og_img_front_angle;
  img_back_angle;   og_img_back_angle;

  pos = new Vector2(0, 0);
  
  constructor(directory) {
    this.directory = directory;
  }

  preload() {
    this.sprite = new Sprite();

    loadImage(this.directory + "/front.png", (img) => {
      this.img_front = img;
      this.active_img = this.img_front;
      this.og_img_front = copy_image(this.img_front);
    });

  }

  setup() {
    this.anim_front = loadAnimation(this.img_front);
    this.anim_front.frameDelay = 32;
    this.sprite.addAnimation('front', this.anim_front);
  }

  draw() {
    
  }

}