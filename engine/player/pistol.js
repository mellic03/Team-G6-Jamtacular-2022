class Pistol {
  
  pos;

  anim;
  spritesheet;
  sprite;

  constructor(x, y) {
    this.pos = new Vector2(x, y);
  }

  preload() {
    loadImage("engine/player/shootsheet.png", (img) => {
      this.spritesheet = loadSpriteSheet(
        img, img.width/5, img.height, 5
      );
    });
  }

  setup() {
    this.sprite = new Sprite();
    this.anim = loadAnimation(this.spritesheet);
    this.anim.frameDelay = 32;
    this.sprite.addAnimation("shoot", this.anim);
    this.sprite.scale = 3;
    this.sprite.animation.frame = 0;
    this.sprite.animation.looping = false;
    this.sprite.animation.frameDelay = 8;
  }

}