/// <reference path="./lib/p5.play.js" />

"use strict";

let player_handler = player_init();
let map_handler = map_init();
let ui_handler = ui_init();
let audio_handler = audio_init();
let sky_box

function preload() {
  map_handler.preload();
  player_handler.preload();
  ui_handler.preload();
  audio_handler.preload();
  sky_box = loadImage('engine/environment/skybox/skybox.png');

}

function setup() {
	createCanvas(SCREEN_WIDTH, SCREEN_HEIGHT);
  frameRate(144); pixelDensity(1); noSmooth();
  
  map_handler.setup();
  player_handler.setup();
  ui_handler.setup();
  audio_handler.setup();
}

let world_data = {
  players: player_handler._players,
  active_map: map_handler.active_map,
  maps: map_handler._maps
};

function draw() {
	//dbackground(50, 100, 150); fill(100, 100, 150); rectMode(CORNERS);
  image(sky_box,0,0);
  //rect(-1, SCREEN_HEIGHT/2, SCREEN_WIDTH+1, SCREEN_HEIGHT);

  map_handler.draw(world_data);
  player_handler.draw(world_data);
  ui_handler.draw(world_data);
  audio_handler.draw(world_data);
}

