 
class Prop {

  directory;
  frames;
  name;

  sprite;
  height = 0.1;
  voffset = 0;
  collision_radius = 0;

  active_img; og_active_img;
  spritesheet; og_spritesheet;
  
  pos = new Vector2(0, 0);
  xvel = 0; yvel = 0;
  vel = new Vector2(0, 0);
  
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
}


class DirectionalProp {

  directory;
  frames;
  name;

  sprite;

  height = 1;
  collision_radius = 10;

  img_front;
  img_back;
  img_side;
  img_front_angle;
  img_back_angle;

  sheet_back
  sheet_front;
  sheet_side;
  sheet_front_angle;
  sheet_back_angle;

  anim_back;
  anim_front;
  anim_side;
  anim_front_angle;
  anim_back_angle;


  pos = new Vector2(0, 0);
  dir = new Vector2(0, 0);
  
  constructor(posx, posy, dirx, diry, directory, frames, name) {
    this.pos.x = posx;
    this.pos.y = posy;
    this.dir.x = dirx;
    this.dir.y = diry;
    this.directory = directory;
    this.frames = frames;
    this.name = name;
  }

  preload() {
    loadImage(this.directory + "/front.png", (img) => {
      this.img_front = img;
      this.active_img = this.img_front;
      this.sheet_front = loadSpriteSheet(
        this.img_front,
        img.width/this.frames, img.height, this.frames
      );
    });

    loadImage(this.directory + "/back.png", (img) => {
      this.img_back = img;
      this.sheet_back = loadSpriteSheet(
        this.img_back,
        img.width/this.frames, img.height, this.frames
      );
    });

    loadImage(this.directory + "/frontangle.png", (img) => {
      this.img_front_angle = img;
      this.sheet_front_angle = loadSpriteSheet(
        this.img_front_angle,
        img.width/this.frames, img.height, this.frames
      );
    });

    loadImage(this.directory + "/backangle.png", (img) => {
      this.img_back_angle = img;
      this.sheet_back_angle = loadSpriteSheet(
        this.img_back_angle,
        img.width/this.frames, img.height, this.frames
      );
    });

    loadImage(this.directory + "/side.png", (img) => {
      this.img_side = img;
      this.sheet_side = loadSpriteSheet(
        this.img_side,
        img.width/this.frames, img.height, this.frames
      );
    });
  }

  setup() {
    this.sprite = new Sprite();
    this.anim_front = loadAnimation(this.sheet_front);
    this.sprite.addAnimation('walkfront', this.anim_front);

    this.anim_front_angle = loadAnimation(this.sheet_front_angle);
    this.sprite.addAnimation('walkfrontangle', this.anim_front_angle);

    this.anim_back = loadAnimation(this.sheet_back);
    this.sprite.addAnimation('walkback', this.anim_back);

    this.anim_back_angle = loadAnimation(this.sheet_back_angle);
    this.sprite.addAnimation('walkbackangle', this.anim_back_angle);

    this.anim_side = loadAnimation(this.sheet_side);
    this.sprite.addAnimation('walkleft', this.anim_side);
  }

  draw(world_data) {
    this.correct_angle(world_data)
  }

  this_to_player = new Vector2(0, 0);
  temp_dir1 = new Vector2(0, 0);
  temp_dir2 = new Vector2(0, 0);

  correct_angle(world_data) {

    let player_pos = world_data.players[0].pos;
    this.this_to_player.x = this.pos.x - player_pos.x;
    this.this_to_player.y = this.pos.y - player_pos.y;
    this.this_to_player.normalise();

    this.temp_dir1.x = this.dir.x;
    this.temp_dir1.y = this.dir.y;
    this.temp_dir1.normalise();

    this.temp_dir2.x = this.this_to_player.x;
    this.temp_dir2.y = this.this_to_player.y;
    this.temp_dir2.rotate(-1.57);

    let dot = vector2_dot(this.temp_dir1, this.this_to_player);
    let side = vector2_dot(this.temp_dir1, this.temp_dir2) < 0 ? -1 : 1;
    let theta = (acos(dot)*180)/3.14159;

    if (theta > 155.7) {
      this.sprite.mirrorX(1);
      this.sprite.changeAnimation("walkfront");
      this.active_img = this.img_front;
    }

    else if (theta > 112.5) {
      this.sprite.mirrorX(side);
      this.sprite.changeAnimation("walkfrontangle");
      this.active_img = this.img_front_angle;
    }

    else if (theta > 67.5) {
      this.sprite.mirrorX(side);
      this.sprite.changeAnimation("walkleft");
      this.active_img = this.img_side;
    }


    else if (theta > 22.5) {
      this.sprite.mirrorX(side);
      this.sprite.changeAnimation("walkbackangle");
      this.active_img = this.img_back_angle;
    }

    else if (theta > 0) {
      this.sprite.mirrorX(1);
      this.sprite.changeAnimation("walkback");
      this.active_img = this.img_back;
    }
  }

}