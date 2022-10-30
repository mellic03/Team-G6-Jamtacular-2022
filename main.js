/// <reference path="./lib/p5.play.js" />

"use strict";

let enemy_handler = new EnemyHandler();
let player_handler = new PlayerHandler();

player_handler.add(new Player(250, 250));


function preload() {
  enemy_handler.preload();
  player_handler.preload();

}


function setup() {
	createCanvas(SCREEN_WIDTH, SCREEN_HEIGHT);
  enemy_handler.setup();
  player_handler.setup();
}


function draw() {
	background(220);

  enemy_handler.draw();
  player_handler.draw();

	drawSprites();
}

