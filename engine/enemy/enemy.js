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
  w = 40;
  h = 50;
  speed = 1;
  tmp = [-1, 1];
  dir = -1;
  targetting = 0;

  /**
   * @param {*} x x position of enemy
   * @param {*} y y position of enemy
   */

  constructor(x, y) {
    this.pos = new Vector2(x, y);
  }

  // ENEMY SPECIFICATION
  //------------------------------------------------------------------------------------------------
  orig_health = 10;
  health = 10;
  damage = 5;

  /** @type {Vector2} */
  pos = new Vector2(0, 0);
  /** @type {Vector2} */
  vel = new Vector2(0, 0);

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
    this.enemy_move();
    this.enemy_target();
    this.draw_enemy_ui();

    for (let map of world_data.maps) {
      this.raycast(map);
    }
  }

  enemy_move() {
    this.vel.y += GRAV_CONSTANT;
    this.pos.add(this.vel);
    this.sprite.position.x = this.pos.x;
    this.sprite.position.y = this.pos.y;

    this.sprite.changeAnimation("enemy1_idle");

    if (this.targetting == 0) this.enemy_idle();
    else this.enemy_target();

  }

  enemy_idle() {
    this.vel.x = this.dir * this.speed;
    this.sprite.mirrorX(this.dir);
    if (this.vel.x != 0) this.sprite.changeAnimation("enemy1_run");


  }

  enemy_target() {
    this.vel.x = this.dir * (this.speed + 0.5);

  }

  draw_enemy_ui() {
    this.draw_enemy_health()

  }

  draw_enemy_health() {
    push();
    rectMode(CORNERS);
    textSize(15);
    textFont(this.font1);
    fill(150, 150, 150, 150);
    rect(this.pos.x + 51, this.pos.y - 51, this.pos.x - 51, this.pos.y - 34);
    noStroke();
    fill(0, 250, 0);
    rect(this.pos.x - 50, this.pos.y - 50, this.pos.x + 50 * (this.health / this.orig_health), this.pos.y - 35);
    fill(0, 0, 0, 150);
    text('HP', this.pos.x - 50, this.pos.y - 34);
    pop();
  }

  //==========================================================================================
  //==========================================================================================
  //==========================================================================================
  //==========================================================================================

  /** Determine the intsection point of two lines
   * @param {Vector2} a1 first point of the first line
   * @param {Vector2} a2 second point of the first line
   * @param {Vector2} b1 first point of the second line
   * @param {Vector2} b2 second point of the second line
   * @return {number} the distance between a1 and the interesection
   * if an intersection occurs, infinity if no intersection occurs.
   */
  line_line_intersect(a1, a2, b1, b2) {

    let d = (a1.x - a2.x) * (b1.y - b2.y) - (a1.y - a2.y) * (b1.x - b2.x);

    let t = ((a1.x - b1.x) * (b1.y - b2.y) - (a1.y - b1.y) * (b1.x - b2.x)) / d;
    let u = ((a1.x - b1.x) * (a1.y - a2.y) - (a1.y - b1.y) * (a1.x - a2.x)) / d;

    let intersect = new Vector2(a1.x + t * (a2.x - a1.x), a1.y + t * (a2.y - a1.y));
    if (0 <= t && t <= 1 && 0 <= u && u <= 1) {
      fill(0, 255, 0)
      circle(intersect.x, intersect.y, 10);
      return vector2_dist(a1, intersect);
    } else {
      return Infinity;
    }
  }

  /** Raycast against all edges in a spatial partition
   * @param {Array} partition
   */
  raycast(partition) {

    let ray_left = new Vector2(-SCREEN_WIDTH, this.h / 2);
    ray_left.add(this.pos);

    let ray_right = new Vector2(SCREEN_WIDTH, this.h / 2);
    ray_right.add(this.pos);

    let ray_up = new Vector2(0, -SCREEN_HEIGHT);
    ray_up.add(this.pos);

    let ray_down = new Vector2(0, SCREEN_HEIGHT);
    ray_down.add(this.pos);

    stroke(0);
    line(this.pos.x, this.pos.y+this.h/2, ray_left.x, ray_left.y);
    line(this.pos.x, this.pos.y+this.h/2, ray_right.x, ray_right.y);
    line(this.pos.x, this.pos.y, ray_up.x, ray_up.y);
    line(this.pos.x, this.pos.y, ray_down.x, ray_down.y);


    let dist;

    for (let polygon of partition.polygons) {
      for (let edge of polygon.edges) {

        dist = this.line_line_intersect(this.pos, ray_up, edge.p1, edge.p2);
        if (dist < this.h / 4) {
          let overlap = this.h / 4 - dist;
          this.vel.y = (this.vel.y < 0) ? -0.5 * this.vel.y : this.vel.y;
          this.pos.y += overlap / 2;
        }

        dist = this.line_line_intersect(this.pos, ray_down, edge.p1, edge.p2);
        if (dist < this.h) {
          let overlap = this.h - dist;
          this.vel.y -= this.vel.y / 2;
          this.pos.y -= overlap * 1.5;
          this.grounded = true;
        }

        /// HERE <><><><><><><><><><><><><>
        if (this.grounded != true && dist < this.h / 2) {
          this.dir *= -1;
          this.vel.x = this.dir * this.speed;
          this.vel.y = this.vel.y / 2;
          this.pos.x += this.dir * 500;
          this.pos.y -= 1000;
        }

        if (vector2_dot(new Vector2(-1, 0), edge.face_normal) < -0.9) {
          dist = this.line_line_intersect(new Vector2(this.pos.x, this.pos.y + this.h / 2), ray_left, edge.p1, edge.p2);
          if (dist < this.w / 2) {
            let overlap = this.w / 2 - dist;
            this.vel.x -= this.vel.x / 2;
            this.pos.x += overlap / 2;
            if (dist <= 20 && this.grounded == true) {
              this.dir *= -1;
              this.pos.x += this.dir * 30;
            }
          }
        }

        if (vector2_dot(new Vector2(+1, 0), edge.face_normal) < -0.9) {
          dist = this.line_line_intersect(new Vector2(this.pos.x, this.pos.y + this.h / 2), ray_right, edge.p1, edge.p2);
          if (dist < this.w / 2) {
            let overlap = this.w / 2 - dist;
            this.vel.x -= this.vel.x / 2;
            this.pos.x -= overlap / 2;
            if (dist <= 20 && this.grounded == true) {
              this.dir *= -1;
              this.pos.x += this.dir * 30;
            }
          }
        }
      }
    }
  }

}