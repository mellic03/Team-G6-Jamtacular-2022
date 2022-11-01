class Player {

  health;
  damage;

  speed = 0.5;
  pos = new Vector2();
  vel = new Vector2();
  dir = new Vector2(-1, 0);
  plane = new Vector2(0, 1);
  dir_L; dir_R;

  fov = 3.14159/2;
  scan_res = SCREEN_WIDTH;

  ray_width = SCREEN_WIDTH/this.scan_res;
  buffer = [];

  fist_R_img
  fist_L_sprite;
  fist_R_sprite;

  constructor(x, y) {
    this.pos.x = x;
    this.pos.y = y;
  }

  preload() {
    this.fist_R_img = loadImage("engine/player/fist.png", () => {
      this.fist_R_sprite = new Sprite()
      this.fist_R_sprite.addImage("fist_R", this.fist_R_img);
      this.fist_R_sprite.scale = 3;

      this.fist_L_sprite = new Sprite()
      this.fist_L_sprite.addImage("fist_R", this.fist_R_img);
      this.fist_L_sprite.scale = 3;
      this.fist_L_sprite.mirrorX(-1);

    });
  }

  setup() {
    this.pos = new Vector2(50, 50);
    this.dir_L = this.dir.get_rotated(-0.785);
    this.dir_R = this.dir.get_rotated(+0.785);
    this.fist_R_sprite.position.x = 750;
    this.fist_R_sprite.position.y = 950;
    this.fist_R_sprite.width = 200;
    this.fist_R_sprite.height = 200;

    this.fist_L_sprite.position.x = 250;
    this.fist_L_sprite.position.y = 950;
    this.fist_L_sprite.width = 200;
    this.fist_L_sprite.height = 200;

    console.log(this.fist_R_sprite);
  }

  draw(world_data) {
    this.march(world_data.active_map);
    this.input();
  }

  march(map) {
    this.buffer = [];

    for (let x=0; x<SCREEN_WIDTH; x+=4) {

      let camx = (2*x)/(SCREEN_WIDTH)-1;

      let dirx = this.dir.x + this.plane.x*camx;
      let diry = this.dir.y + this.plane.y*camx;

      let angle = vector2_angle(this.dir, new Vector2(dirx, diry));

      let dx = sqrt(1 + (diry**2 / dirx**2));
      let dy = sqrt(1 + (dirx**2 / diry**2));

      let step_x, step_y;


      let mapX = Math.floor(this.pos.x);
      let mapY = Math.floor(this.pos.y);

      let sideDistX, sideDistY;

      if (dirx < 0) {
        step_x = -1;
        sideDistX = (this.pos.x - mapX) * dx;
      }
      else {
        step_x = 1;
        sideDistX = (mapX + 1.0 - this.pos.x) * dx;
      }

      if (diry < 0) {
        step_y = -1;
        sideDistY = (this.pos.y - mapY) * dy;
      }
      else {
        step_y = 1;
        sideDistY = (mapY + 1.0 - this.pos.y) * dy;
      }

      let hit = 0;
      let side;

      let colour = false;

      while (hit == 0) {
        if (sideDistX < sideDistY) {
          sideDistX += dx;
          mapX += step_x;
          side = 0;
        }
        else {
          sideDistY += dy;
          mapY += step_y;
          side = 1;
        }
        colour = point_in_cell(mapX, mapY, map);
        if (colour != false) {
          hit = 1;
        }
      }

      if (side == 0)
        this.buffer[x] = {
          dist: ((sideDistX - dx)*angle) / 10,
          side: side,
          x: mapX,
          y: mapY,
          colour: colour
        };
      else
        this.buffer[x] = {
          dist: ((sideDistY - dy)*angle) / 10,
          side: side,
          x: mapX,
          y: mapY,
          colour: colour
        };
    }

    rectMode(CENTER);
    noStroke();
  
    for (let i=0; i<SCREEN_WIDTH; i+=4) {

      // fill(10000/this.buffer[i].dist);
      let r = this.buffer[i].colour[0];
      let g = this.buffer[i].colour[1];
      let b = this.buffer[i].colour[2];

      if (this.buffer[i].side) {
        r/=2, g/=2, b/=2;
      }

      fill(r, g, b);
      stroke(r, g, b);
      rect(SCREEN_WIDTH-i, SCREEN_WIDTH/2, 3, SCREEN_HEIGHT/this.buffer[i].dist);
    }
    stroke(0);
    rectMode(CORNER);
  }


  input() {
    if (keyIsDown(13))
      requestPointerLock();

    if (keyIsDown(keycodes.A)) {
      let temp = this.dir.get_rotated(-1.57);
      this.pos.add(temp.get_scaled(this.speed));
    }

    if (keyIsDown(keycodes.D)) {
      let temp = this.dir.get_rotated(+1.57);
      this.pos.add(temp.get_scaled(this.speed));
    }

    if (keyIsDown(keycodes.W)) {
      this.pos.add(this.dir.get_scaled(this.speed));
    }
   
    if (keyIsDown(keycodes.S)) {
      this.pos.sub(this.dir.get_scaled(this.speed));
    }


    if (keyIsDown(keycodes.SPACE)) {
      this.fist_R_sprite.position.y = 800; 
    }
    else {
      this.fist_R_sprite.velocity.y = 0;
      this.fist_R_sprite.position.y = 950;
    }


    if (keyIsDown(LEFT_ARROW)) {
      this.plane.rotate(-0.02);
      this.dir.rotate(-0.02);
    }

    if (keyIsDown(RIGHT_ARROW)) {
      this.plane.rotate(+0.02);
      this.dir.rotate(+0.02);
    }
      
    if (keyIsDown(keycodes.DOWN)) {
      this.plane.scale(1.01);
    }
    if (keyIsDown(keycodes.UP)) {
      this.plane.scale(0.99);
    }
  }
}

function point_in_cell(x, y, grid) {

  let xprime = Math.floor(x/grid.width);
  let yprime = Math.floor(y/grid.width);

  if (!(grid.tilemap[4*(grid.width*yprime + xprime)])) {
    return false
  }

  else {
    return [
      grid.colourmap[4*(grid.width*yprime + xprime)+0],
      grid.colourmap[4*(grid.width*yprime + xprime)+1],
      grid.colourmap[4*(grid.width*yprime + xprime)+2]
    ];
  }
}


