class Player {

  health;
  damage;
  
  pos = new Vector2();
  vel = new Vector2();
  dir = new Vector2(0, 1);
  dir_L; dir_R;

  fov = 3.14159/3;
  scan_res = SCREEN_WIDTH;

  ray_width = SCREEN_WIDTH/this.scan_res;
  buffer = [];

  fist_img;

  constructor(x, y) {
    this.pos.x = x;
    this.pos.y = y;
  }

  preload() {
    this.fist_img = loadImage("engine/player/fist.png");
  }

  setup() {
    this.pos = new Vector2(50, 50);
    this.dir_L = this.dir.get_rotated(-0.785);
    this.dir_R = this.dir.get_rotated(+0.785);
  }

  draw(world_data) {
    this.march(world_data.active_map);
    this.input();
  }


  march(map) {
    
    this.buffer = [];

    this.dir_L = new Vector2(this.dir.x, this.dir.y);
    this.dir_L.rotate(-this.fov/2);

    let step = this.fov / this.scan_res;

    for (let raynumber=0; raynumber<this.scan_res; raynumber++) {

      this.dir_L.rotate(step);

      let angle = vector2_angle(this.dir, this.dir_L);

      let dx = abs(1 / this.dir_L.x);
      let dy = abs(1 / this.dir_L.y);

      let step_x, step_y;


      let mapX = Math.floor(this.pos.x);
      let mapY = Math.floor(this.pos.y);

      let sideDistX, sideDistY;

      if (this.dir_L.x < 0) {
        step_x = -1;
        sideDistX = (this.pos.x - mapX) * dx;
      }
      else {
        step_x = 1;
        sideDistX = (mapX + 1.0 - this.pos.x) * dx;
      }

      if (this.dir_L.y < 0) {
        step_y = -1;
        sideDistY = (this.pos.y - mapY) * dy;
      }
      else {
        step_y = 1;
        sideDistY = (mapY + 1.0 - this.pos.y) * dy;
      }

      let hit = 0;
      let side;

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
        if (point_in_cell(mapX, mapY, map)) {
          hit = 1;
        }
      }

      if (side == 0)
        this.buffer[raynumber] = {dist: (sideDistX - dx)*angle, side: side, x: mapX, y: mapY};
      else
        this.buffer[raynumber] = {dist: (sideDistY - dy)*angle, side: side, x: mapX, y: mapY};
    }

    rectMode(CENTER);
    noStroke();
  
    for (let i=0; i<this.scan_res; i++) {
      let r=200, g=200, b=200;

      // fill(10000/this.buffer[i].dist);
      r /= 0.01*this.buffer[i].dist;
      g /= 0.01*this.buffer[i].dist;
      b /= 0.01*this.buffer[i].dist;

      r = (r > 200) ? 200 : r;
      g = (g > 200) ? 200 : g;
      b = (b > 200) ? 200 : b;

      if (this.buffer[i].side) {
        r/=2, g/=2, b/=2;
      }

      fill(r, g, b);
      stroke(r, g, b);
      rect(i*this.ray_width, (SCREEN_WIDTH/2), this.ray_width+1, SCREEN_HEIGHT/(0.03*this.buffer[i].dist));
    }
    stroke(0);
    rectMode(CORNER);
  }


  input() {
    if (keyIsDown(13))
      requestPointerLock();

    if (keyIsDown(65)) {
      let temp = this.dir.get_rotated(-1.57);
      this.pos.add(temp);
    }
    if (keyIsDown(68)) {
      let temp = this.dir.get_rotated(+1.57);
      this.pos.add(temp);
    }
    if (keyIsDown(87))
      this.pos.add(this.dir);
    if (keyIsDown(83))
      this.pos.sub(this.dir);


    if (keyIsDown(32)) {
      image(this.fist_img, 3*RES_X/5, 570, 2.5*this.fist_img.width, 2.5*this.fist_img.height);
    }

    if (keyIsDown(LEFT_ARROW)) {
      // this.plane.rotate(-0.02);
      this.dir.rotate(-0.02);
    }

    if (keyIsDown(RIGHT_ARROW)) {
      // this.plane.rotate(+0.02);
      this.dir.rotate(+0.02);
    }
      
    if (keyIsDown(109))
      this.fov += 0.01;
    if (keyIsDown(107))
      this.fov -= 0.01;
  }

}

function point_in_cell(x, y, grid) {

  let xprime = Math.floor(x/grid.width);
  let yprime = Math.floor(y/grid.width);

  return grid.data[grid.width*yprime + xprime];
}