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
  w = 50; h = 50;
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

  /** @type {Vector2} */ pos = new Vector2(0, 0);
  /** @type {Vector2} */ vel = new Vector2(0, 0);
  /** @type {Vector2} */ dir = new Vector2(1, 0);

  preload() {
    enemy1_idle_spritesheet = loadSpriteSheet("spritesheets/Enemy1/idle.png", 48, 48, 4);
    enemy1_idle_anim = loadAnimation(enemy1_idle_spritesheet);
    enemy1_idle_anim.frameDelay = 8;
    enemy1_run_spritesheet = loadSpriteSheet("spritesheets/Enemy1/walk.png", 48, 48, 4);
    enemy1_run_anim = loadAnimation(enemy1_run_spritesheet);
    enemy1_run_anim.frameDelay = 8;
    enemy1_attack_spritesheet = loadSpriteSheet("spritesheets/Enemy1/attack.png", 48, 48, 4);
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

  }

  draw(world_data) {
    this.enemy_move();
    this.seek_player();

    for (let map of world_data.maps) {
      this.raycast(map);
    }
  }

  //------------------------------------------------------------------------------------------------

  /** Determine the intsection point of two lines
   * @param {Vector2} a1 first point of the first line
   * @param {Vector2} a2 second point of the first line
   * @param {Vector2} b1 first point of the second line
   * @param {Vector2} b2 second point of the second line
   * @return {number} the distance between a1 and the interesection
   * if an intersection occurs, infinity if no intersection occurs.
   */
   line_line_intersect(a1, a2, b1, b2) {

    let d = (a1.x-a2.x)*(b1.y-b2.y) - (a1.y-a2.y)*(b1.x-b2.x);

    let t = ((a1.x-b1.x)*(b1.y-b2.y) - (a1.y-b1.y)*(b1.x-b2.x)) / d;
    let u = ((a1.x-b1.x)*(a1.y-a2.y) - (a1.y-b1.y)*(a1.x-a2.x)) / d;

    let intersect = new Vector2(a1.x + t*(a2.x-a1.x), a1.y + t*(a2.y-a1.y));
    if (0 <= t && t <= 1 && 0 <= u && u <= 1) {
      // fill(0, 255, 0)
      // circle(intersect.x, intersect.y, 10);
      return vector2_dist(a1, intersect);
    }
    else {
      return Infinity;
    }
  }

  /** Raycast against all edges in a spatial partition
   * @param {Array} partition
   */
  raycast(partition) {

    let ray_left = new Vector2(-SCREEN_WIDTH, this.h/2);
    ray_left.add(this.pos);

    let ray_right = new Vector2(SCREEN_WIDTH, this.h/2);
    ray_right.add(this.pos);

    let ray_up = new Vector2(0, -SCREEN_HEIGHT);
    ray_up.add(this.pos);

    let ray_down = new Vector2(0, SCREEN_HEIGHT);
    ray_down.add(this.pos);

    // stroke(0);
    // line(this.pos.x, this.pos.y+this.h/2, ray_left.x, ray_left.y);
    // line(this.pos.x, this.pos.y+this.h/2, ray_right.x, ray_right.y);
    // line(this.pos.x, this.pos.y, ray_up.x, ray_up.y);
    // line(this.pos.x, this.pos.y, ray_down.x, ray_down.y);
    

    let dist;

    for (let polygon of partition.polygons) {
      for (let edge of polygon.edges) {
        
        dist = this.line_line_intersect(this.pos, ray_up, edge.p1, edge.p2);
        if (dist < this.h/4) {
          let overlap = this.h/4 - dist;
          this.vel.y = (this.vel.y < 0) ? -0.5*this.vel.y : this.vel.y;
          this.pos.y += overlap/2;
        }
        
        dist = this.line_line_intersect(this.pos, ray_down, edge.p1, edge.p2);
        if (dist < this.h) {
          let overlap = this.h - dist;
          this.vel.y -= this.vel.y/2;
          this.pos.y -= overlap*1.5;
          this.grounded = true;
        }
        
        if (vector2_dot(new Vector2(-1, 0), edge.face_normal) < -0.9) {
          dist = this.line_line_intersect(new Vector2(this.pos.x, this.pos.y+this.h/2), ray_left, edge.p1, edge.p2);
          if (dist < this.w/2) {
            let overlap = this.w/2 - dist;
            this.vel.x -= this.vel.x/2;
            this.pos.x += overlap/2;
          }
        }
        
        if (vector2_dot(new Vector2(+1, 0), edge.face_normal) < -0.9) {
          dist = this.line_line_intersect(new Vector2(this.pos.x, this.pos.y+this.h/2), ray_right, edge.p1, edge.p2);
          if (dist < this.w/2) {
            let overlap = this.w/2 - dist;
            this.vel.x -= this.vel.x/2;
            this.pos.x -= overlap/2;
          }
        }
      }
    }
  }

  enemy_move() {
    this.vel.y += GRAV_CONSTANT;
    this.pos.add(this.vel);
    this.sprite.position.x = this.pos.x;
    this.sprite.position.y = this.pos.y;

    this.sprite.changeAnimation("enemy1_idle");
    
  }

  enemy_idle() {
    

  }

  seek_player() {

  }




}