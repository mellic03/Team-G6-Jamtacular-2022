/// <reference path="./lib/p5.play.js" />

"use strict";

let enemy_handler = enemy_init();
let player_handler = player_init();
let ui_handler = ui_init();
let map_handler = map_init(); 


function preload() {
  enemy_handler.preload();
  player_handler.preload();
  ui_handler.preload();
  map_handler.preload();
}


function setup() {
	createCanvas(SCREEN_WIDTH, SCREEN_HEIGHT);
  frameRate(165);
  enemy_handler.setup();
  player_handler.setup();
  ui_handler.setup();
  map_handler.setup();
}


let world_data = {
  players: player_handler._players,
  enemies: enemy_handler._enemies,
  active_map: map_handler.active_map,
  maps: map_handler._maps
};

function draw() {
	background(220);

	drawSprites();

  enemy_handler.draw(world_data);
  map_handler.draw(world_data);
  player_handler.draw(world_data);
  ui_handler.draw(world_data);

}

