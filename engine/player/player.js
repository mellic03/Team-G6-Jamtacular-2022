/// <reference path="../../lib/p5.min.js" />
/// <reference path="../../lib/p5.play.js" />
/// <reference path="../math/vector.js" />

// Player Variables

let px = 0,
	py = 0;

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
  speed = 2.2;

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

  /** @type {Vector2} */ pos;
  /** @type {Vector2} */ vel;
  /** @type {Vector2} */ dir;

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
		this.playerAnim();
  }
  //------------------------------------------------------------------------------------------------

	move() {
 
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
      this.sprite.changeAnimation("player_run");
      this.pos.y -= this.speed;
    }

    if (keyIsDown(keycodes.DOWN)) {
      this.sprite.changeAnimation("player_run");
      this.pos.y += this.speed;
    }

		this.playerOutOfBounds();
	}

	playerOutOfBounds() {
    
    this.pos.x = (this.pos.x > 0) ? this.pos.x : 0;
    this.pos.x = (this.pos.x < SCREEN_WIDTH) ? this.pos.x : SCREEN_WIDTH;
    this.pos.y = (this.pos.y > 0) ? this.pos.y : 0;
    this.pos.y = (this.pos.y < SCREEN_HEIGHT) ? this.pos.y : SCREEN_HEIGHT;

	}

	playerAnim() {
		// if (px < 0 || px > 0 && py == 0) this.sprite.changeAnimation('player_run');
		// else if (px == 0 && py < 0 || py > 0) this.sprite.changeAnimation('player_climb');
		// else this.sprite.changeAnimation('player_idle');
	}


}

