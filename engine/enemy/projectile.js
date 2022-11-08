class Projectile {

  pos;
  xvel; yvel;

  frame_count = 0;

  height = 0.3;
  voffset = 0;

  sprite;
  active_img;

  constructor(xp, yp, xv, yv, world_data) {
    if (world_data.map_handler.active_map.projectiles.length <= world_data.map_handler.active_map.max_projectiles) {
      this.pos = new Vector2(xp, yp);
      this.xvel = xv;
      this.yvel = yv;
      this.init(world_data);
    }
  }


  // Assumes projectile sprite has already been loaded
  init(world_data) {
    this.sprite = new Sprite();
    this.sprite.addAnimation("proj", world_data.assets.projectile_img);
    this.active_img = world_data.assets.projectile_img;
    this.sprite.changeAnimation("proj");

    world_data.map_handler.active_map.projectiles.unshift(this);
  }

  draw() {

  }

}