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
  frameRate(144);
  enemy_handler.setup();
  player_handler.setup();
  ui_handler.setup();
  map_handler.setup();
  console.log(world_data);
}


let world_data = {
  players: player_handler._players,
  enemies: enemy_handler._enemies,
  active_map: map_handler.active_map,
  maps: map_handler._maps
};


function draw() {
	background(220);
  pixelDensity(1);
  fill(50, 100, 150);
  rect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT/2);
  fill(100, 100, 150);
  rect(0, SCREEN_HEIGHT/2, SCREEN_WIDTH, SCREEN_HEIGHT/2);

  map_handler.draw(world_data);
  player_handler.draw(world_data);


  drawSprites();
  ui_handler.draw(world_data);



}

