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
  sky_box = loadImage('engine/environment/skybox/skybox.jpg');

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
  maps: map_handler._maps,
};

function draw() {
  for (let enemy of world_data.active_map.enemies) {
    enemy.og_active_img.copy(enemy.active_img, 0, 0, enemy.active_img.width, enemy.active_img.height, 0, 0, enemy.active_img.width, enemy.active_img.height);
  }
  for (let prop of world_data.active_map.props) {
    prop.og_active_img.copy(prop.active_img, 0, 0, prop.active_img.width, prop.active_img.height, 0, 0, prop.active_img.width, prop.active_img.height);
  }
	//background(50, 100, 150); fill(100, 100, 150); rectMode(CORNERS);
  image(sky_box, 0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
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

  for (let enemy of world_data.active_map.enemies) {
    enemy.active_img.copy(enemy.og_active_img, 0, 0, enemy.active_img.width, enemy.active_img.height, 0, 0, enemy.active_img.width, enemy.active_img.height);
  }
  for (let prop of world_data.active_map.props) {
    prop.active_img.copy(prop.og_active_img, 0, 0, prop.active_img.width, prop.active_img.height, 0, 0, prop.active_img.width, prop.active_img.height);
  }
}

