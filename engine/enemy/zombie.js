/// <reference path="../../lib/p5.min.js" />
/// <reference path="../../lib/p5.play.js" />
/// <reference path="../math/vector.js" />


/*
  This is ripped straight from doom
*/


class Zombie {

  speed = 1;

  directory;

  sprite;
  self_group; // Each sprite is contained within it's own group for depth ordering

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
    this.sprite = new Sprite();
    this.self_group = new Group();
    this.self_group.add(this.sprite);
  
    this.sheet_front = loadSpriteSheet(
      this.directory + "/spritesheets/walkfront-sheet.png",
      41, 54, 4
    );

    this.sheet_front_angle = loadSpriteSheet(
      this.directory + "/spritesheets/walkfrontangle-sheet.png",
      37, 54, 4
    );


    this.sheet_back = loadSpriteSheet(
      this.directory + "/spritesheets/walkback-sheet.png",
      36, 54, 4
    );

    this.sheet_back_angle = loadSpriteSheet(
      this.directory + "/spritesheets/walkbackangle-sheet.png",
      45, 54, 4
    );


    this.sheet_left = loadSpriteSheet(
      this.directory + "/spritesheets/walkleft-sheet.png",
      43, 55, 4
    );

  }

  setup() {
    this.anim_front = loadAnimation(this.sheet_front);
    this.anim_front.frameDelay = 32;
    this.sprite.addAnimation('walkfront', this.anim_front);
    this.sprite.changeAnimation('walkfront');

    this.anim_front_angle = loadAnimation(this.sheet_front_angle);
    this.anim_front_angle.frameDelay = 32;
    this.sprite.addAnimation('walkfrontangle', this.anim_front_angle);
    this.sprite.changeAnimation('walkfrontangle');


    this.anim_back = loadAnimation(this.sheet_back);
    this.anim_back.frameDelay = 32;
    this.sprite.addAnimation('walkback', this.anim_back);
    this.sprite.changeAnimation('walkback');

    this.anim_back_angle = loadAnimation(this.sheet_back_angle);
    this.anim_back_angle.frameDelay = 32;
    this.sprite.addAnimation('walkbackangle', this.anim_back_angle);
    this.sprite.changeAnimation('walkbackangle');


    this.anim_left = loadAnimation(this.sheet_left);
    this.anim_left.frameDelay = 32;
    this.sprite.addAnimation('walkleft', this.anim_left);
    this.sprite.changeAnimation('walkleft');
  }

  draw(world_data) {

    this.move_to_player(world_data);
    this.correct_angle(world_data);
  }

  move_to_player(world_data) {

    let dist = vector2_dist(world_data.players[0].pos, this.pos);

    let dir_forwards = vector2_sub(world_data.players[0].pos, this.pos);
    dir_forwards.normalise();
    
    let dir_backwards = vector2_sub(this.pos, world_data.players[0].pos);
    dir_backwards.normalise();

    this.dir.lerp(dir_backwards, 0.02);
    this.dir.normalise();

    dir_forwards.scale(0.2);

    if (dist < 7) {
      world_data.players[0].vel.add(dir_forwards);
    }
    if (dist > 20) {
      this.pos.add(dir_forwards);
    }
  }

  
  /** Change active animation to ensure player sees enemy from correct angle
   * @param {*} world_data 
   */
  correct_angle(world_data) {

    let player_pos = world_data.players[0].pos;
    let dir = vector2_sub(this.pos, player_pos);
    dir.normalise();

    let dot = vector2_dot(this.dir, dir);
    let side = vector2_dot(this.dir, dir.get_rotated(-1.57)) < 0 ? -1 : 1;
    let theta = (acos(dot)*180)/3.14159;


    if (theta > 155.7) {
      this.sprite.changeAnimation("walkfront");
    }

    else if (theta > 112.5) {
      this.sprite.mirrorX(side);
      this.sprite.changeAnimation("walkfrontangle");
    }

    else if (theta > 67.5) {
      this.sprite.mirrorX(side);
      this.sprite.changeAnimation("walkleft");
    }


    else if (theta > 22.5) {
      this.sprite.mirrorX(side);
      this.sprite.changeAnimation("walkbackangle");
    }

    else {
      this.sprite.changeAnimation("walkback");
    }
  }

}