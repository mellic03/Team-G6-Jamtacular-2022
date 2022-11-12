
class CyberDemon {

  behaviour_scripts = [];

  sprite;
  height;

  health = 10;
  speed = 1;

  chase_range = 200;
  attack_range = 100;
  push_range = 15;

  frames;

  active_img;

  img_walk_front;
  img_walk_front_left;
  img_walk_front_right;
  img_walk_left;
  img_walk_right;
  img_walk_back_left;
  img_walk_back_right;
  img_walk_back;
  img_attack;

  anim_walk_front;
  anim_walk_front_left;
  anim_walk_front_right;
  anim_walk_left;
  anim_walk_right;
  anim_walk_back_left;
  anim_walk_back_right;
  anim_walk_back;
  anim_attack;

  sheet_walk_front;
  sheet_walk_front_left;
  sheet_walk_front_right;
  sheet_walk_left;
  sheet_walk_right;
  sheet_walk_back_left;
  sheet_walk_back_right;
  sheet_walk_back;
  sheet_attack;

  img_attack;

  sound_attack;
  sound_injury;

  pos; default_pos;
  vel; dir;
  to_player = new Vector2(0, 0);
  to_this = new Vector2(0, 0);

  dirs = [
    new Vector2(+sqrt(2)/2, +sqrt(2)/2),
    new Vector2(+sqrt(2)/2, -sqrt(2)/2),
    new Vector2(-sqrt(2)/2, -sqrt(2)/2),
    new Vector2(-sqrt(2)/2, +sqrt(2)/2)
  ];

  constructor(x, y) {
    this.pos = new Vector2(x, y);
    this.default_pos = new Vector2(x, y);
    this.vel = new Vector2(0, 0);
    this.dir = new Vector2(-1, 0);
  }

  preload() {

    loadImage("engine/enemy/cyberdemon/spritesheets/walkfront-sheet.png", (img) => {
      this.img_walk_front = img;
      this.sheet_walk_front = loadSpriteSheet(
        this.img_walk_front, img.width/this.frames, img.height, this.frames
      );
      this.active_img = this.img_walk_front;
    });

    loadImage("engine/enemy/cyberdemon/spritesheets/walkfrontleft-sheet.png", (img) => {
      this.img_walk_front_left = img;
      this.sheet_walk_front_left = loadSpriteSheet(
        this.img_walk_front_left, img.width/this.frames, img.height, this.frames
      );
    });

    loadImage("engine/enemy/cyberdemon/spritesheets/walkfrontright-sheet.png", (img) => {
      this.img_walk_front_right = img;
      this.sheet_walk_front_right = loadSpriteSheet(
        this.img_walk_front_right, img.width/this.frames, img.height, this.frames
      );
    });

    loadImage("engine/enemy/cyberdemon/spritesheets/walkback-sheet.png", (img) => {
      this.img_walk_back = img;
      this.sheet_walk_back = loadSpriteSheet(
        this.img_walk_back, img.width/this.frames, img.height, this.frames
      );
    });

    loadImage("engine/enemy/cyberdemon/spritesheets/walkbackright-sheet.png", (img) => {
      this.img_walk_back_right = img;
      this.sheet_walk_back_right = loadSpriteSheet(
        this.img_walk_back_right, img.width/this.frames, img.height, this.frames
      );
    });

    loadImage("engine/enemy/cyberdemon/spritesheets/walkbackleft-sheet.png", (img) => {
      this.img_walk_back_left = img;
      this.sheet_walk_back_left = loadSpriteSheet(
        this.img_walk_back_left, img.width/this.frames, img.height, this.frames
      );
    });

    loadImage("engine/enemy/cyberdemon/spritesheets/walkright-sheet.png", (img) => {
      this.img_walk_right = img;
      this.sheet_walk_right = loadSpriteSheet(
        this.img_walk_right, img.width/this.frames, img.height, this.frames
      );
    });

    loadImage("engine/enemy/cyberdemon/spritesheets/walkleft-sheet.png", (img) => {
      this.img_walk_left = img;
      this.sheet_walk_left = loadSpriteSheet(
        this.img_walk_left, img.width/this.frames, img.height, this.frames
      );
    });

    loadImage("engine/enemy/cyberdemon/spritesheets/attack-sheet.png", (img) => {
      this.img_attack = img;
      this.sheet_attack = loadSpriteSheet(
        this.img_attack, img.width/this.frames, img.height, this.frames
      );
    });

    loadSound("engine/enemy/cyberdemon/sounds/injury.mp3", (sound) => {
      this.sound_injury = sound;
    });

    loadSound("engine/enemy/cyberdemon/sounds/attack.mp3", (sound) => {
      this.sound_attack = sound;
    });
  }

  setup() {
    this.sprite = new Sprite();
    this.anim_walk_front = loadAnimation(this.sheet_walk_front);
    this.sprite.addAnimation("walkfront", this.anim_walk_front);
    this.sprite.changeAnimation("walkfront");
  
    this.anim_walk_front_left = loadAnimation(this.sheet_walk_front_left);
    this.sprite.addAnimation("walkfrontleft", this.anim_walk_front_left);

    this.anim_walk_front_right = loadAnimation(this.sheet_walk_front_right);
    this.sprite.addAnimation("walkfrontright", this.anim_walk_front_right);

    this.anim_walk_back = loadAnimation(this.sheet_walk_back);
    this.sprite.addAnimation("walkback", this.anim_walk_back);

    this.anim_walk_back_right = loadAnimation(this.sheet_walk_back_right);
    this.sprite.addAnimation("walkbackright", this.anim_walk_back_right);

    this.anim_walk_back_left = loadAnimation(this.sheet_walk_back_left);
    this.sprite.addAnimation("walkbackleft", this.anim_walk_back_left);

    this.anim_walk_right = loadAnimation(this.sheet_walk_right);
    this.sprite.addAnimation("walkright", this.anim_walk_right);

    this.anim_walk_left = loadAnimation(this.sheet_walk_left);
    this.sprite.addAnimation("walkleft", this.anim_walk_left);

    this.anim_attack = loadAnimation(this.sheet_attack);
    this.sprite.addAnimation("attack", this.anim_attack);
    this.sprite.changeAnimation("attack");
  }

  draw(world_data) {

    if (frameCount % floor(frameRate()) == 0) {
      let frame_delay = floor( 2/9 * ceil(frameRate()) / this.speed);
      this.sprite.animations.walkback.frameDelay        = frame_delay;
      this.sprite.animations.walkbackright.frameDelay   = frame_delay;
      this.sprite.animations.walkbackleft.frameDelay    = frame_delay;
      this.sprite.animations.walkfront.frameDelay       = frame_delay;
      this.sprite.animations.walkfrontleft.frameDelay   = frame_delay;
      this.sprite.animations.walkfrontright.frameDelay  = frame_delay;
      this.sprite.animations.walkright.frameDelay       = frame_delay;
      this.sprite.animations.walkleft.frameDelay        = frame_delay;
      this.sprite.animations.attack.frameDelay          = floor(frame_delay * this.speed / 5);
    }



    // this.follow_player(world_data);
    this.correct_angle(world_data);

    for (let i=0; i<this.behaviour_scripts.length; i++) {
      this.behaviour_scripts[i](this, world_data);
    }

  }

  follow_player(world_data) {
    let player = world_data.players[0];

    if (vector2_dist(player.pos, this.pos) < this.attack_range) {
      this.sprite.changeAnimation("attack");
      return;
    }

    this.to_player.x = player.pos.x - this.pos.x;
    this.to_player.y = player.pos.y - this.pos.y;

    this.to_this.x = this.pos.x - player.pos.x;
    this.to_this.y = this.pos.y - player.pos.y;

    this.to_player.normalise();
    this.to_player.scale(0.1);

    this.dir.lerp(this.to_player, 0.01);
    this.dir.normalise();

    this.to_player.x = this.dir.x;
    this.to_player.y = this.dir.y;

    if (!world_data.map_handler.active_map.point_in_grid(this.pos.x+this.to_player.x*20, this.pos.y+this.to_player.y*20)) {
      this.to_player.scale(0.1);
      this.pos.add(this.to_player);
    }
  }

  // shoot_player(world_data) {
  //   let player = world_data.players[0];
  //   let e2p_x = player.pos.x - this.pos.x;
  //   let e2p_y = player.pos.y - this.pos.y;
  
  //   let mag = sqrt(e2p_x**2 + e2p_y**2);
     
  //   e2p_x /= mag;
  //   e2p_y /= mag;


  //   let dist = vector2_dist(player.pos, this.pos);

  //   if (dist <= this.attack_range) {

  //     if (this.sprite.animations.attack.frame == 3) {
  //       this.sprite.animations.attack.frame = 0;
  //       world_data.map_handler.active_map.create_projectile(this.pos, e2p_x*0.7, e2p_y*0.7);
  //     }
  //   }
  // }

  correct_angle(world_data) {

    let player_pos = world_data.players[0].pos;

    if (vector2_dist(player_pos, this.pos) < this.attack_range) {
      return;
    }

    this.to_player.x = this.pos.x - player_pos.x;
    this.to_player.y = this.pos.y - player_pos.y;
    this.to_player.normalise();

    let dot = vector2_dot(this.dir, this.to_player);
    let side = vector2_dot(this.dir, this.to_player.get_rotated(-1.57)) < 0 ? -1 : 1;
    let theta = (acos(dot)*180)/3.14159;

    theta *= side;

    if (vector2_dist(player_pos, this.pos) < 20) {
      return;
    }

    if (abs(theta) > 155.7) {
      this.sprite.changeAnimation("walkfront");
      this.active_img = this.img_walk_front;
    }

    else if (theta > 112.5) {
      this.sprite.changeAnimation("walkfrontright");
      this.active_img = this.img_walk_front_left;
    }

    else if (theta > 67.5) {
      this.sprite.changeAnimation("walkright");
      this.active_img = this.img_walk_right;
    }

    else if (theta > 22.5) {
      this.sprite.changeAnimation("walkbackleft");
      this.active_img = this.img_walk_back_left;
    }

    else if (theta > 0) {
      this.sprite.changeAnimation("walkback");
      this.active_img = this.img_walk_back;
    }
    
    else if (theta < -112.5) {
      this.sprite.changeAnimation("walkfrontleft");
      this.active_img = this.img_walk_front_left;
    }

    else if (theta < -67.5) {
      this.sprite.changeAnimation("walkleft");
      this.active_img = this.img_walk_left;
    }

    else if (theta < -22.5) {
      this.sprite.changeAnimation("walkbackright");
      this.active_img = this.img_walk_back_right;
    }
  }

  reset() {
    this.health = this.default_health;
    this.pos.x = this.default_pos.x;
    this.pos.y = this.default_pos.y;
    this.death_sound_play = false;
  }
}