

function setup() {
	createCanvas(800, 600);

	player1 = new Player(200, 300, 50, 50);
}

function draw() {
	background(220);


	player1.playerSystem();
	drawSprites();
}