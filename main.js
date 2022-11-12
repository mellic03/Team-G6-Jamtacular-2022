/// <reference path="./lib/p5.play.js" />

"use strict";

let player_handler = player_init();
let map_handler = map_init();
let ui_handler = ui_init();
let audio_handler = audio_init();

function preload() {
  map_handler.preload();
  player_handler.preload();
  ui_handler.preload();
  audio_handler.preload();
}

function setup() {

  scr_wdth = windowWidth;
  scr_hght = windowHeight;
  windowResized();
  createCanvas(scr_wdth, scr_hght);
  frameRate(144); pixelDensity(1); noSmooth();

  player_handler.setup();
  map_handler.setup(player_handler);
  ui_handler.setup();
  audio_handler.setup();
}

let world_data = {
  players: player_handler._players,
  maps: map_handler._maps,
  map_handler: map_handler,
  ui_handler: ui_handler,
  audio_handler: audio_handler,
  assets: map_handler.assets
};

function draw() {
  resizeCanvas(scr_wdth, scr_hght);
  image(world_data.map_handler.active_map.background, 0, 0, scr_wdth, scr_hght);

  map_handler.draw(world_data);
  player_handler.draw(world_data);
  ui_handler.draw(world_data);
  audio_handler.draw(world_data);

  // FOR TESTING SPRITE VERTICAL OFFSET
  //---------------------------------------------------------------------
  // stroke(0, 255, 0);
  // line(0, scr_hght/2 + 40, scr_wdth, scr_hght/2 + 40);
  //---------------------------------------------------------------------
}

function windowResized() {
  scr_wdth = windowWidth;
  scr_hght = windowHeight;

  for (let i=0; i<scr_wdth; i++) {
    world_data.players[0].depth_buffer[i] = {
      dist: 0,
      side: 0,
      index: 0
    }
  }

}