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
  dir = new Vector2(0, 0);


  preload() {
    this.sprite = new Sprite();
    this.self_group = new Group();
    this.self_group.add(this.sprite);
  
    this.sheet_front = loadSpriteSheet(
      this.directory + "/spritesheets/walkfront1-sheet.png",
      40, 54, 4
    );

  }

  setup() {
    this.anim_front = loadAnimation(this.sheet_front);
    this.anim_front.frameDelay = 32;
    this.sprite.addAnimation('test', this.anim_front);
    this.sprite.changeAnimation('test');

    this.sprite.position.y = SCREEN_HEIGHT/2;
    this.sprite.scale = 1/54;
    
  }

  draw(world_data) {


  }



}