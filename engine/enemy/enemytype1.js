/// <reference path="../../lib/p5.min.js" />
/// <reference path="../../lib/p5.play.js" />
/// <reference path="../math/vector.js" />


/** An enemy type that walks towards the player and melee attacks them
 */
class EnemyType_1 {

  directory; // folder to retrieve assets from

  behaviour_scripts = []; // Array of functions to be executed in draw()

  health = 50;
  damage = 5;
  speed = 1;

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

  img_front;        og_img_front;
  img_back;         og_img_back;
  img_side;         og_img_side;
  img_front_angle;  og_img_front_angle;
  img_back_angle;   og_img_back_angle;
  img_attack;       og_img_attack;
  img_death;        og_img_death;

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

  /**
   * @param {*} x x position of enemy
   * @param {*} y y position of enemy
   */
  constructor(x, y, directory, frames) {
    this.pos = new Vector2(x, y);
    this.directory = directory;
    this.frames = frames;
  }



  pos = new Vector2(0, 0);
  pos_screen = new Vector2(0, SCREEN_HEIGHT/2);
  vel = new Vector2(0, 0);
  dir = new Vector2(-1, 0);


  preload() {
    console.log("preloading enemy")
  
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
    })
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

    this.og_active_img = this.og_img_front;
  }

  draw(world_data) {

    if (frameCount % floor(frameRate()) == 0) {
      let frame_delay = floor( 2/9 * ceil(frameRate()));
      this.sprite.animations.walkback.frameDelay        = frame_delay;
      this.sprite.animations.walkbackangle.frameDelay   = frame_delay;
      this.sprite.animations.walkfront.frameDelay       = frame_delay;
      this.sprite.animations.walkfrontangle.frameDelay  = frame_delay;
      this.sprite.animations.walkleft.frameDelay        = frame_delay;
      this.sprite.animations.attack.frameDelay          = frame_delay;
      this.sprite.animations.death.frameDelay           = frame_delay;
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

    if (vector2_dist(player_pos, this.pos) < 20) {
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
}


