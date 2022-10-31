/// <reference path="./lib/p5.play.js" />

"use strict";

let enemy_handler = enemy_init();
let player_handler = player_init();
let map_handler = map_init();


function preload() {
  enemy_handler.preload();
  player_handler.preload();
  map_handler.preload();
}


function setup() {
	createCanvas(SCREEN_WIDTH, SCREEN_HEIGHT);
  enemy_handler.setup();
  player_handler.setup();
  map_handler.setup();

}


let world_data = {
  enemies: enemy_handler._enemies,
  maps: map_handler._maps
};

function draw() {
	background(220);

	drawSprites();

  enemy_handler.draw();
  player_handler.draw(world_data);
  map_handler.draw();

}
