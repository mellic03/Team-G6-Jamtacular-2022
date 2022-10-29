// Arrow/Space Values
const LEFT = 37;
const RIGHT = 39;
const UP = 38;
const DOWN = 40;
const SPACE = 32;

// Player Variables
let player1;
let p;
let player_pos;
let move;
let speed = 1.2;

let px = 0,
	py = 0;

// Player Spritesheet
let player_idle_sprites;
let player_idle_anim;
let player_run_sprites;
let player_run_anim;


// Test
let sc = [100, 200, 0];

function preload() {
	player_idle_sprites = loadSpriteSheet('spritesheets/Standard Player/Player1_idle.png', 24, 48, 4);
	player_idle_anim = loadAnimation(player_idle_sprites);
	player_run_sprites = loadSpriteSheet('spritesheets/Standard Player/Player1_idle.png', 30, 48, 6);
	player_run_anim = loadAnimation(player_run_sprites);
}

class Player {

	constructor(x, y, w, h) {
		this.x = x;
		this.y = y;
		this.w = w;
		this.h = h;

		p = createSprite(this.x, this.y, this.w, this.h);
		p.shapeColor = sc;
		p.scale = 2;
		p.addAnimation('player_idle', player_idle_anim);
		p.addAnimation('player_run', player_run_anim);

	}

	playerSystem() {

		this.move();
		this.playerAnim();
	}


	move() {

		player_pos = p.position;

		if (px <= 1 && px >= -1) {
			px = 0;
		} else {
			if (px > 0) px -= 0.5;
			if (px < 0) px += 0.5;
		}
		if (py <= 1 && py >= -1) {
			py = 0;
		} else {
			if (py > 0) py -= 0.5;
			if (py < 0) py += 0.5;
		}

		if (keyIsDown(UP) == true && py > -speed * 2) py -= speed;
		if (keyIsDown(DOWN) == true && py < speed * 2) py += speed;
		if (keyIsDown(LEFT) == true && px > -speed * 2) px -= speed;
		if (keyIsDown(RIGHT) == true && px < speed * 2) px += speed;

		p.setVelocity(px, py);

		this.playerOutOfBounds();
	}

	playerOutOfBounds() {
		if (player_pos.x < this.w / 2) player_pos.x = this.w / 2;
		if (player_pos.x > width - this.w / 2) player_pos.x = width - this.w / 2;
		if (player_pos.y < this.h / 2) player_pos.y = this.h / 2;
		if (player_pos.y > height - this.h / 2) player_pos.y = height - this.h / 2;
	}

	playerAnim() {

		if (px == 0 && py == 0) p.changeAnimation('player_idle');
		else p.changeAnimation('player_run');

	}


}