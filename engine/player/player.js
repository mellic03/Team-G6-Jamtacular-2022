/// <reference path="../../lib/p5.min.js" />
/// <reference path="../../lib/p5.play.js" />
/// <reference path="../math/vector.js" />

// Player Variables

let px = 0, py = 0;

// Player Spritesheet
let player_idle_sprites;
let player_idle_anim;
let player_run_sprites;
let player_run_anim;
let player_climb_sprites;
let player_climb_anim;


class Player {

  sprite;
  w = 50; h = 50;
  speed = 3;

  grounded = false;

  /**
   * @param {*} x x position of player
   * @param {*} y y position of player
   */
	constructor(x, y) {
		this.pos = new Vector2(x, y);
	}

  // PLAYER SPECIFICATION
  //------------------------------------------------------------------------------------------------
  health;
  damage;

  /** @type {Vector2} */ pos = new Vector2(0, 0);
  /** @type {Vector2} */ vel = new Vector2(0, 0);
  /** @type {Vector2} */ dir = new Vector2(1, 0);

  preload() {
    player_idle_sprites = loadSpriteSheet('spritesheets/Standard Player/Player1_idle.png', 48, 48, 4);
    player_idle_anim = loadAnimation(player_idle_sprites);
    player_run_sprites = loadSpriteSheet('spritesheets/Standard Player/Player1_run.png', 48, 48, 6);
    player_run_anim = loadAnimation(player_run_sprites);
    player_climb_sprites = loadSpriteSheet('spritesheets/Standard Player/Player1_climb.png', 48, 48, 6);
    player_climb_anim = loadAnimation(player_climb_sprites);
  }

  setup() {
    this.sprite = createSprite(this.x, this.y, this.w, this.h);
    this.sprite.position.x = this.pos.x;
    this.sprite.position.y = this.pos.y;
		this.sprite.scale = 2;
		this.sprite.addAnimation('player_idle', player_idle_anim);
		this.sprite.addAnimation('player_run', player_run_anim);
		this.sprite.addAnimation('player_climb', player_climb_anim);
  }

  draw() {
    this.move();
  }
  //------------------------------------------------------------------------------------------------

  line_line_intersect(a1, a2, b1, b2) {
  
    let x1 = a1.x;
    let y1 = a1.y;
    let x2 = a2.x;
    let y2 = a2.y

    let x3 = b1.x;
    let y3 = b1.y;
    let x4 = b2.x;
    let y4 = b2.y;

    let d = (x1-x2)*(y3-y4) - (y1-y2)*(x3-x4);

    let t = ((x1-x3)*(y3-y4) - (y1-y3)*(x3-x4)) / d;
    let u = ((x1-x3)*(y1-y2) - (y1-y3)*(x1-x2)) / d;

    let intersect = new Vector2(x1 + t*(x2-x1), y1 + t*(y2-y1));
    if (0 <= t && t <= 1 && 0 <= u && u <= 1) {
      fill(0, 255, 0)
      circle(intersect.x, intersect.y, 10);
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

    line(this.pos.x, this.pos.y+this.h/2, ray_left.x, ray_left.y);
    line(this.pos.x, this.pos.y+this.h/2, ray_right.x, ray_right.y);
    line(this.pos.x, this.pos.y, ray_up.x, ray_up.y);
    line(this.pos.x, this.pos.y, ray_down.x, ray_down.y);
    

    let dist;

    for (let edge of partition.edges) {

      dist = this.line_line_intersect(this.pos, ray_up, edge.p1, edge.p2);
      if (dist <= this.h/4) {
        let overlap = this.h/4 - dist;
        this.vel.y = (this.vel.y < 0) ? -0.5*this.vel.y : this.vel.y;
        this.pos.y += overlap/2;
      }

      dist = this.line_line_intersect(this.pos, ray_down, edge.p1, edge.p2);
      if (dist <= this.h) {
        let overlap = this.h - dist;
        this.vel.y *= 0.5;
        this.pos.y -= overlap/2;
        this.grounded = true;
      }

      dist = this.line_line_intersect(new Vector2(this.pos.x, this.pos.y+this.h/2), ray_left, edge.p1, edge.p2);
      if (dist <= this.w/2) {
        let overlap = this.w/2 - dist;
        this.vel.x = 0;
        this.pos.x += overlap/2;
      }

      dist = this.line_line_intersect(new Vector2(this.pos.x, this.pos.y+this.h/2), ray_right, edge.p1, edge.p2);
      if (dist <= this.w/2) {
        let overlap = this.w/2 - dist;
        this.vel.x = 0;
        this.pos.x -= overlap/2;
      }
    }
  }

	move() {

    this.vel.y += 0.3;
    this.pos.add(this.vel);

    this.sprite.position.x = this.pos.x;
    this.sprite.position.y = this.pos.y;

    this.sprite.changeAnimation("player_idle");

    if (keyIsDown(keycodes.LEFT)) {
      this.sprite.mirrorX(-1);
      this.sprite.changeAnimation("player_run");
      this.pos.x -= this.speed;
    }

    if (keyIsDown(keycodes.RIGHT)) {
      this.sprite.mirrorX(1);
      this.sprite.changeAnimation("player_run");
      this.pos.x += this.speed;
    }
    
    if (keyIsDown(keycodes.UP)) {
      this.sprite.changeAnimation("player_climb");
      this.pos.y -= this.speed;
    }

    if (keyIsDown(keycodes.DOWN)) {
      this.sprite.changeAnimation("player_climb");
      this.pos.y += this.speed;
    }

    if (keyIsDown(keycodes.SPACE) && this.grounded) {
      this.grounded = false;
      this.vel.y = -7;
    }

    camera.position.x = this.pos.x;
    camera.position.y = this.pos.y;

		this.playerOutOfBounds();
	}

	playerOutOfBounds() {
    // this.pos.x = (this.pos.x > 0) ? this.pos.x : 0;
    // this.pos.x = (this.pos.x < SCREEN_WIDTH) ? this.pos.x : SCREEN_WIDTH;
    // this.pos.y = (this.pos.y > 0) ? this.pos.y : 0;
    // this.pos.y = (this.pos.y < SCREEN_HEIGHT) ? this.pos.y : SCREEN_HEIGHT;
	}

}

