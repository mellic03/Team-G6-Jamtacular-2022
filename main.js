/// <reference path="./lib/p5.play.js" />

"use strict";

let enemy_handler = new EnemyHandler();
let player_handler = new PlayerHandler();

let player = new Player(0, 0);
player_handler.add(player);

let m1 = new Map("./map1.obj");
let brickimg;

function preload() {
  enemy_handler.preload();
  player_handler.preload();
  m1.preload()
  brickimg = loadImage("./brick.bmp");
}


function setup() {
	createCanvas(SCREEN_WIDTH, SCREEN_HEIGHT);
  enemy_handler.setup();
  player_handler.setup();
  m1.scale(25);
  m1.translate(SCREEN_WIDTH/2, SCREEN_HEIGHT/2);
}


function draw() {
	background(220);

	drawSprites();

  enemy_handler.draw();
  player_handler.draw();
  m1.draw();
  player.raycast(m1);

}

