/// <reference path="./lib/p5.play.js" />

"use strict";


let player_handler = player_init();
let map_handler = map_init();
let ui_handler = ui_init();
let audio_handler = audio_init();
let sky_box;
// let vapor_sky;
// let gif;
let gif2;
// let light;
let beach;

function preload() {
  map_handler.preload();
  player_handler.preload();
  ui_handler.preload();
  audio_handler.preload();
  sky_box = loadImage('engine/prop/skybox/lab.png');
  beach = loadImage('engine/prop/skybox/beach.png');
}

function setup() {
	createCanvas(SCREEN_WIDTH, SCREEN_HEIGHT);
  frameRate(144); pixelDensity(1); noSmooth();

  player_handler.setup();
  map_handler.setup(player_handler);
  ui_handler.setup();
  audio_handler.setup();
}

let world_data = {
  players: player_handler._players,
  active_map: map_handler.active_map,
  maps: map_handler._maps,
  map_handler: map_handler
};

function draw() {
  image(beach, 0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
  // image(vapor_sky, 0, 0, SCREEN_WIDTH, SCREEN_HEIGHT/2);
  // image(gif, 0, 0, SCREEN_WIDTH, SCREEN_HEIGHT/2);
  fill(100, 50, 50); rectMode(CORNERS);
  //rect(-1, SCREEN_HEIGHT/2, SCREEN_WIDTH+1, SCREEN_HEIGHT);

  map_handler.draw(world_data);
  player_handler.draw(world_data);
  ui_handler.draw(world_data);
  audio_handler.draw(world_data);

  // FOR TESTING SPRITE VERTICAL OFFSET
  //---------------------------------------------------------------------
  //  stroke(0, 255, 0);
  //  line(0, SCREEN_HEIGHT/2 + 120, SCREEN_WIDTH, SCREEN_HEIGHT/2 + 120);
  //---------------------------------------------------------------------
}

