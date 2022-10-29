// Arrow/Space Values
const LEFT = 37;
const RIGHT = 39;
const UP = 38;
const DOWN = 40;
const SPACE = 32;

// Player Variables
let player;
let p;
let player_pos;
let move;
let speed;

let up, left, down, right;

// Test
let sc = [100, 200, 0];

class Player {

	constructor(x, y, w, h) {
		this.x = x;
		this.y = y;
		this.w = w;
		this.h = h;

		p = createSprite(this.x, this.y, this.w, this.h);
		p.shapeColor = sc;

	}

	playerSystem() {

		this.move();
	}


	move() {

		player_pos = p.position;

		if (keyIsDown(UP) == true) up = true;
		else up = false;
		if (keyIsDown(DOWN) == true) down = true;
		else down = false;
		if (keyIsDown(LEFT) == true) left = true;
		else left = false;
		if (keyIsDown(RIGHT) == true) right = true;
		else right = false;



		this.playerOutOfBounds();
	}

	playerOutOfBounds() {



	}


}