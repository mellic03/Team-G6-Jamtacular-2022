/// <reference path="../../lib/p5.min.js" />
/// <reference path="../../lib/p5.play.js" />
/// <reference path="../math/vector.js" />


class Zombie {

  speed = 1;

  // SCREEN_HEIGHT/54 = sprite height
  // sprite.scale(2 * SCREEN_HEIGHT/54);

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
      44, 54, 4
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


    this.sprite.position.y = SCREEN_HEIGHT/2;
    this.sprite.scale = 1/54;
    
  }

  draw(world_data) {

    let player_pos = world_data.players[0].pos;
    let dir = vector2_sub(this.pos, player_pos);
    dir.normalise();

    let dot = vector2_dot(this.dir, dir);
    
    let side = vector2_dot(this.dir, dir.get_rotated(-1.57)) < 0 ? -1 : 1;

    let theta = (acos(dot)*180)/3.14159;


    console.log(theta);

    if (theta > 157.5) {
      this.sprite.changeAnimation("walkfront");
    }

    else if (theta > 135) {
      this.sprite.mirrorX(side);
      this.sprite.changeAnimation("walkfrontangle");
    }

    else if (theta > 90) {
      this.sprite.mirrorX(side);
      this.sprite.changeAnimation("walkleft");
    }


    else if (theta > 45) {
      this.sprite.mirrorX(side);
      this.sprite.changeAnimation("walkbackangle");
    }

    else {
      this.sprite.changeAnimation("walkback");
    }

  }



}