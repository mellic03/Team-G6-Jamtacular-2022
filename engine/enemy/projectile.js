class Projectile {

  pos = new Vector2(0, 0);
  xvel; yvel;

  frame_count = 0;

  height = 0.4;
  voffset = 0;

  radius = 5;
  damage = 5;

  sprite;
  active_img;

  constructor(xp, yp, xv, yv) {
    this.pos = new Vector2(xp, yp);
    this.xvel = xv;
    this.yvel = yv;
  }


  // Assumes projectile sprite has already been loaded
  init(projectile_img) {
    this.sprite = new Sprite();
    this.sprite.addAnimation("proj", projectile_img);
    this.active_img = projectile_img;
    this.sprite.changeAnimation("proj");
  }

  draw() {

  }

}