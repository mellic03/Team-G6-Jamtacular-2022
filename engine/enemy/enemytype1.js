/// <reference path="../../lib/p5.min.js" />
/// <reference path="../../lib/p5.play.js" />
/// <reference path="../math/vector.js" />


/** An enemy type that walks towards the player and melee attacks them
 */
class EnemyType_1 {

  directory; // folder to retrieve assets from

  behaviour_scripts = []; // Array of functions to be executed in draw()

  health = 50; default_health = 50;
  damage = 5;
  speed = 1;
  attack_speed = 1;

  pos = new Vector2(0, 0);
  default_pos = new Vector2(0, 0);
  pos_screen = new Vector2(0, scr_hght/2);
  vel = new Vector2(0, 0);
  dir = new Vector2(-1, 0);

  follow_range = 100;
  chase_range = 100;
  attack_range = 50;
  push_range = 7;

  to_player = new Vector2(0, 0);
  to_this = new Vector2(0, 0);

  on_last_frame = false;
  on_first_frame = true;

  sprite;

  frames;
  active_img;

  img_front;
  img_back;
  img_side;
  img_front_angle;
  img_back_angle;
  img_attack;
  img_death;

  sheet_back
  sheet_front;
  sheet_side;
  sheet_front_angle;
  sheet_back_angle;
  sheet_attack;
  sheet_death;

  anim_back;
  anim_front;
  anim_side;
  anim_front_angle;
  anim_back_angle;
  anim_attack;
  anim_death;

  sound_death;
  death_sound_play;
  
  sound_injury;
  sound_attack;


  /**
   * @param {*} x x position of enemy
   * @param {*} y y position of enemy
   */
  constructor(x, y, directory, frames) {
    this.pos.x = x;
    this.pos.y = y;
    this.default_pos.x = x;
    this.default_pos.y = y;
    this.directory = directory;
    this.frames = frames;
  }


  preload() {

    loadImage(this.directory + "/spritesheets/walkfront-sheet.png", (img) => {
      this.img_front = img;
      this.active_img = this.img_front;
      this.sheet_front = loadSpriteSheet(
        this.img_front,
        img.width/this.frames, img.height, this.frames
      );
    });

    loadImage(this.directory + "/spritesheets/walkback-sheet.png", (img) => {
      this.img_back = img;
      this.sheet_back = loadSpriteSheet(
        this.img_back,
        img.width/this.frames, img.height, this.frames
      );
    });

    loadImage(this.directory + "/spritesheets/walkfrontangle-sheet.png", (img) => {
      this.img_front_angle = img;
      this.sheet_front_angle = loadSpriteSheet(
        this.img_front_angle,
        img.width/this.frames, img.height, this.frames
      );
    });

    loadImage(this.directory + "/spritesheets/walkbackangle-sheet.png", (img) => {
      this.img_back_angle = img;
      this.sheet_back_angle = loadSpriteSheet(
        this.img_back_angle,
        img.width/this.frames, img.height, this.frames
      );
    });

    loadImage(this.directory + "/spritesheets/walkside-sheet.png", (img) => {
      this.img_side = img;
      this.sheet_side = loadSpriteSheet(
        this.img_side,
        img.width/this.frames, img.height, this.frames
      );
    });
  
    loadImage(this.directory + "/spritesheets/attack-sheet.png", (img) => {
      this.img_attack = img;
      this.sheet_attack = loadSpriteSheet(
        this.img_attack,
        img.width/this.frames, img.height, this.frames
      );
    });

    loadImage(this.directory + "/spritesheets/death-sheet.png", (img) => {
      this.img_death = img;
      this.sheet_death = loadSpriteSheet(
        this.img_death,
        img.width/this.frames, img.height, this.frames
      );
    });

    loadSound(this.directory + "/sounds/death.mp3", (sound) => {
      this.sound_death = sound;
    });

    loadSound(this.directory + "/sounds/injury.mp3", (sound) => {
      this.sound_injury = sound;
    });

    loadSound(this.directory + "/sounds/attack.mp3", (sound) => {
      this.sound_attack = sound;
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
  
    this.anim_attack = loadAnimation(this.sheet_attack);
    this.sprite.addAnimation('attack', this.anim_attack);
   
    this.anim_death = loadAnimation(this.sheet_death);
    this.anim_death.looping = false;
    this.sprite.addAnimation('death', this.anim_death);

    this.death_sound_play = false;
  }

  draw(world_data) {

    if (frameCount % floor(frameRate()) == 0) {
      let frame_delay = floor( 2/9 * ceil(frameRate()) / this.speed);
      this.sprite.animations.walkback.frameDelay        = frame_delay;
      this.sprite.animations.walkbackangle.frameDelay   = frame_delay;
      this.sprite.animations.walkfront.frameDelay       = frame_delay;
      this.sprite.animations.walkfrontangle.frameDelay  = frame_delay;
      this.sprite.animations.walkleft.frameDelay        = frame_delay;
      this.sprite.animations.attack.frameDelay          = frame_delay * this.attack_speed;
      this.sprite.animations.death.frameDelay           = frame_delay * this.speed;
    }

    this.collide_against_enemies(world_data.map_handler.active_map.enemies);
    // this.move_to_player(world_data);
    this.correct_angle(world_data);

    for (let i=0; i<this.behaviour_scripts.length; i++) {
      this.behaviour_scripts[i](this, world_data);
    }
  }

  enemy_to_enemy = new Vector2(0, 0);

  collide_against_enemies(enemies) {
    for (let i=0; i<enemies.length; i++) {
      for (let j=0; j<enemies.length; j++) {
        if (i!=j) {
          let dist = vector2_dist(enemies[i].pos, enemies[j].pos);
          if (dist < 10) {
            
            this.enemy_to_enemy.x = enemies[i].pos.x - enemies[j].pos.x;
            this.enemy_to_enemy.y = enemies[i].pos.y - enemies[j].pos.y;
            this.enemy_to_enemy.normalise();
            this.enemy_to_enemy.scale(0.2);
            enemies[i].pos.add(this.enemy_to_enemy);
          }
        }
      }
    }
  }

  dirs = [
    new Vector2(+sqrt(2)/2, +sqrt(2)/2),
    new Vector2(+sqrt(2)/2, -sqrt(2)/2),
    new Vector2(-sqrt(2)/2, -sqrt(2)/2),
    new Vector2(-sqrt(2)/2, +sqrt(2)/2)
  ];

  player_last_dist = 0;
  player_delta_dist = 0;
  temp_dir1 = new Vector2(0, 0);
  temp_dir2 = new Vector2(0, 0);
  temp_dir3 = new Vector2(0, 0);

  /** Change active animation to ensure player sees enemy from correct angle
   * @param {*} world_data 
   */
  correct_angle(world_data) {

    if (this.health <= 0)
      return;

    let player_pos = world_data.players[0].pos;

    this.temp_dir1.x = this.pos.x - player_pos.x;
    this.temp_dir1.y = this.pos.y - player_pos.y;
    this.temp_dir1.normalise();

    this.temp_dir2.x = this.temp_dir1.x;
    this.temp_dir2.y = this.temp_dir1.y;
    this.temp_dir2.rotate(-1.57);

    this.temp_dir3.x = this.dir.x;
    this.temp_dir3.y = this.dir.y;
    this.temp_dir3.normalise();

    let dot = vector2_dot(this.temp_dir3, this.temp_dir1);
    let side = vector2_dot(this.temp_dir3, this.temp_dir2) < 0 ? -1 : 1;
    let theta = (acos(dot)*180)/3.14159;

    if (vector2_dist(player_pos, this.pos) <= this.attack_range) {
      return;
    }

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


  reset() {
    this.health = this.default_health;
    this.pos.x = this.default_pos.x;
    this.pos.y = this.default_pos.y;
    this.death_sound_play = false;
  }

}


