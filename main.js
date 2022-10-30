"use strict";

let enemy_handler = new EnemyHandler();
let player_handler = new PlayerHandler();


function preload() {
  enemy_handler.preload();
  player_handler.preload();

}


function setup() {
	createCanvas(800, 600);
  enemy_handler.setup();
  player_handler.setup();

	// player1 = new Player(200, 300, 50, 50);
}


function draw() {
	background(220);

  enemy_handler.draw();
  player_handler.draw();

	// player1.playerSystem();
	drawSprites();
}

