/// <reference path="../../lib/p5.min.js" />
/// <reference path="../../lib/p5.play.js" />
/// <reference path="../math/vector.js" />

// Enemy Spritesheet
let enemy1_idle_spritesheet;
let enemy1_idle_anim;
let enemy1_run_spritesheet;
let enemy1_run_anim;
let enemy1_attack_spritesheet;
let enemy1_attack_anim;

class Enemy {

  sprite;
  speed = 1;

  /**
   * @param {*} x x position of enemy
   * @param {*} y y position of enemy
   */
  constructor(x, y) {
    this.pos = new Vector2(x, y);
  }

  // ENEMY SPECIFICATION
  //------------------------------------------------------------------------------------------------
  health = 10;
  damage = 5;

  pos = new Vector2(0, 0);
  vel = new Vector2(0, 0);
  dir = new Vector2(0, 0);


  preload() {
    enemy1_idle_spritesheet = loadSpriteSheet("spritesheets/Enemy1/Idle.png", 48, 48, 4);
    enemy1_idle_anim = loadAnimation(enemy1_idle_spritesheet);
    enemy1_idle_anim.frameDelay = 8;
    enemy1_run_spritesheet = loadSpriteSheet("spritesheets/Enemy1/Walk.png", 48, 48, 4);
    enemy1_run_anim = loadAnimation(enemy1_run_spritesheet);
    enemy1_run_anim.frameDelay = 8;
    enemy1_attack_spritesheet = loadSpriteSheet("spritesheets/Enemy1/Attack.png", 48, 48, 4);
    enemy1_attack_anim = loadAnimation(enemy1_attack_spritesheet);
    enemy1_attack_anim.frameDelay = 8;
  }

  setup() {
    this.sprite = createSprite(this.x, this.y, this.w, this.h);
    this.sprite.position.x = this.pos.x;
    this.sprite.position.y = this.pos.y;
    this.sprite.scale = 2;
    this.sprite.addAnimation('enemy1_idle', enemy1_idle_anim);
    this.sprite.addAnimation('enemy1_run', enemy1_run_anim);
    this.sprite.addAnimation('enemy1_attack', enemy1_attack_anim);
    // this.sprite.debug = true;

    this.font1 = loadFont("fonts/PressStart2P-Regular.ttf");
  }

  draw(world_data) {

  }




}