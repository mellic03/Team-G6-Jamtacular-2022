/// <reference path="../../lib/p5.min.js" />
/// <reference path="../../lib/p5.play.js" />
/// <reference path="../math/vector.js" />


/** An enemy type that walks towards the player and melee attacks them
 */
class EnemyType_1 {

  directory; // folder to retrieve assets from

  speed = 1;

  sprite;

  active_img;

  img_front;        og_img_front;
  img_back;         og_img_back;
  img_side;         og_img_side;
  img_front_angle;  og_img_front_angle;
  img_back_angle;   og_img_back_angle;

  sheet_back
  sheet_front;
  sheet_left;
  sheet_front_angle;
  sheet_back_angle;

  anim_back;
  anim_front;
  anim_left;
  anim_front_angle;
  anim_back_angle;

  /**
   * @param {*} x x position of enemy
   * @param {*} y y position of enemy
   */
  constructor(x, y, directory) {
    this.pos = new Vector2(x, y);
    this.directory = directory;
  }

  // ENEMY SPECIFICATION
  //------------------------------------------------------------------------------------------------
  health = 10;
  damage = 5;

  pos = new Vector2(0, 0);
  pos_screen = new Vector2(0, SCREEN_HEIGHT/2);
  vel = new Vector2(0, 0);
  dir = new Vector2(-1, 0);


  preload() {
    console.log("preloading enemy")
  
    loadImage(this.directory + "/spritesheets/walkfront-sheet.png", (img) => {
      this.og_img_front = copy_image(img);
      this.img_front = img;
      this.active_img = this.img_front;
      this.sheet_front = loadSpriteSheet(
        this.img_front,
        41, 54, 4
      );
    });

    loadImage(this.directory + "/spritesheets/walkback-sheet.png", (img) => {
      this.og_img_back = copy_image(img);
      this.img_back = img;
      this.sheet_back = loadSpriteSheet(
        this.img_back,
        36, 51, 4
      );
    });

    loadImage(this.directory + "/spritesheets/walkfrontangle-sheet.png", (img) => {
      this.og_img_front_angle = copy_image(img);
      this.img_front_angle = img;
      this.sheet_front_angle = loadSpriteSheet(
        this.img_front_angle,
        37, 54, 4
      );
    });

    loadImage(this.directory + "/spritesheets/walkbackangle-sheet.png", (img) => {
      this.og_img_back_angle = copy_image(img);
      this.img_back_angle = img;
      this.sheet_back_angle = loadSpriteSheet(
        this.img_back_angle,
        45, 50, 4
      );
    });

    loadImage(this.directory + "/spritesheets/walkside-sheet.png", (img) => {
      this.og_img_side = copy_image(img);
      this.img_side = img;
      this.sheet_left = loadSpriteSheet(
        this.img_side,
        43, 53, 4
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

    this.anim_left = loadAnimation(this.sheet_left);
    this.sprite.addAnimation('walkleft', this.anim_left);
  
    console.log(this.sprite);
  }

  draw(world_data) {
    
    if (frameCount % floor(frameRate()) == 0) {
      let frame_delay = floor( 2/9 * ceil(frameRate()));
      this.sprite.animations.walkback.frameDelay        = frame_delay;
      this.sprite.animations.walkbackangle.frameDelay   = frame_delay;
      this.sprite.animations.walkfront.frameDelay       = frame_delay;
      this.sprite.animations.walkfrontangle.frameDelay  = frame_delay;
      this.sprite.animations.walkleft.frameDelay        = frame_delay;
    }


    this.collide_against_enemies(world_data.active_map.enemies);
    // this.move_to_player(world_data);
    this.correct_angle(world_data);
  }

  /** Make a portion of an spritesheet invisible.
   *  Assumes the spritesheet has four frames.
   * @param {*} img 
   * @param {*} x1
   * @param {*} x2
   */
  set_occlusion(img, x1, x2) {
    let width = img.width;
    let height = img.height;
  
    let row = 4*width;

    for (let x=x1; x<x2; x++) {
      for (let y=0; y<height; y++) {
        img.pixels[row*y + 4*x+0*width+3] = 0;
        img.pixels[row*y + 4*x+1*width+3] = 0;
        img.pixels[row*y + 4*x+2*width+3] = 0;
        img.pixels[row*y + 4*x+3*width+3] = 0;
      }
    }
    img.updatePixels();
  }

  reset_occlusion(dest, src, x1, x2) {

    let width = dest.width;
    let height = dest.height;

    let row = 4*width;

    for (let x=x1; x<x2; x++) {
      for (let y=0; y<height; y++) {
        dest.pixels[row*y + 4*x+0*width+3] = src.pixels[row*y + 4*x+0*width+3];
        dest.pixels[row*y + 4*x+1*width+3] = src.pixels[row*y + 4*x+1*width+3];
        dest.pixels[row*y + 4*x+2*width+3] = src.pixels[row*y + 4*x+2*width+3];
        dest.pixels[row*y + 4*x+3*width+3] = src.pixels[row*y + 4*x+3*width+3];
      }
    }

    dest.updatePixels();
  }


  collide_against_enemies(enemies) {
    for (let i=0; i<enemies.length; i++) {
      for (let j=0; j<enemies.length; j++) {
        if (i!=j) {
          let dist = vector2_dist(enemies[i].pos, enemies[j].pos);
          if (dist < 10) {
            
            let dir = vector2_sub(enemies[i].pos, enemies[j].pos);
            dir.normalise();
            dir.scale(0.2);
            enemies[i].pos.add(dir);
          }
        }
      }
    }
  }

  dirs = [
    new Vector2(+sqrt(2), +sqrt(2)),
    new Vector2(+sqrt(2), -sqrt(2)),
    new Vector2(-sqrt(2), -sqrt(2)),
    new Vector2(-sqrt(2), +sqrt(2))
  ];

  closest_dir = this.dirs[0];
  player_last_dist = 0;
  player_delta_dist = 0;

  move_to_player(world_data) {

    let dist = vector2_dist(world_data.players[0].pos, this.pos);

    let enemy_to_player = vector2_sub(world_data.players[0].pos, this.pos);
    enemy_to_player.normalise();
    let player_to_enemy = vector2_sub(this.pos, world_data.players[0].pos);


    // Move towards the player at the nearest 45 degree angle,
    // keep track of delta_dist, if delta_dist becomes negative, 
    // recalculate nearest 45 degree angle

    if (this.player_delta_dist < 0) {
      let closest_dot = -1;
      
      for (let i=0; i<4; i++) {
        let dot = vector2_dot(this.dirs[i], enemy_to_player);
        if (dot > closest_dot) {
          closest_dot = dot;
          this.closest_dir = this.dirs[i];
        }
      }

      this.closest_dir.normalise();
      // this.closest_dir.scale(0.02*deltaTime);
    }

    if (dist > 50) {
      this.dir = this.closest_dir;
      if (world_data.active_map.point_in_grid(vector2_add(this.pos, this.dir.get_scaled(0.02*deltaTime))) == false)
        this.pos.add(this.dir.get_scaled(0.02*deltaTime));      
    }

    else if (dist > 20) {
      this.dir.lerp(player_to_enemy, 0.002*deltaTime);
      this.dir.normalise();
      this.pos.add(this.dir.get_scaled(0.02*deltaTime));
    }

    if (dist < 7) {
      world_data.players[0].vel.add(this.dir.get_scaled(0.02*deltaTime));
    }

    
    this.player_delta_dist = this.player_last_dist - dist;
    this.player_last_dist = dist;

  }

  
  /** Change active animation to ensure player sees enemy from correct angle
   * @param {*} world_data 
   */
  correct_angle(world_data) {

    let player_pos = world_data.players[0].pos;
    let dir = vector2_sub(this.pos, player_pos);
    dir.normalise();

    let dot = vector2_dot(this.dir.get_normalised(), dir);
    let side = vector2_dot(this.dir.get_normalised(), dir.get_rotated(-1.57)) < 0 ? -1 : 1;
    let theta = (acos(dot)*180)/3.14159;


    if (theta > 155.7) {
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
      this.sprite.changeAnimation("walkback");
      this.active_img = this.img_back;
    }
  }

}