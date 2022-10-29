
// Player Variables
let player;
let p;
let player_pos;
let move;
let speed;

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


		this.playerOutOfBounds();
	}

	playerOutOfBounds() {



	}


}