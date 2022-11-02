class Player {

  health;
  damage;

  speed = 0.4;
  pos = new Vector2();
  vel = new Vector2(0, 0);
  dir = new Vector2(-1, 0);
  plane = new Vector2(0, SCREEN_WIDTH/SCREEN_HEIGHT);
  fist_offset = 0;
  dir_L; dir_R;

  fov = 3.14159/2;
  scan_res = SCREEN_WIDTH;

  ray_width = SCREEN_WIDTH/this.scan_res;
  buffer = [];

  fist_R_img
  fist_L_sprite;
  fist_R_sprite;

  mmap_x = 700;
  mmap_width = 250;

  ray_intersections = [];

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
    this.fist_R_sprite.position.y = 900;
    this.fist_R_sprite.width = 200;
    this.fist_R_sprite.height = 200;

    this.fist_L_sprite.position.x = 250;
    this.fist_L_sprite.position.y = 900;
    this.fist_L_sprite.width = 200;
    this.fist_L_sprite.height = 200;

    console.log(this.fist_R_sprite);
  }

  draw(world_data) {
    this.input(world_data.active_map);
    this.march(world_data.active_map);
    this.draw_minimap(world_data.active_map);
  }

  draw_minimap(map) {
    fill(10);
    rect(this.mmap_x, 0, this.mmap_width, this.mmap_width);
    for (let x=0; x<map.width; x++) {
      for (let y=0; y<map.width; y++) {
        if (map.tilemap[map.width*y + x] > 0) {

          fill(
            map.colourmap[4*map.width*y + 4*x],
            map.colourmap[4*map.width*y + 4*x+1],
            map.colourmap[4*map.width*y + 4*x+2]
          );

          rect(this.mmap_x+x*map.width/2, y*map.width/2, 10, 10);
        }
      }
    }
    stroke(255);
    circle(this.mmap_x+this.pos.x/2, this.pos.y/2, 5);
    

    line(
      this.mmap_x+this.pos.x/2,
      this.pos.y/2,
      this.mmap_x+this.ray_intersections[0].x/2,
      this.ray_intersections[0].y/2
    )
    line(
      this.mmap_x+this.pos.x/2,
      this.pos.y/2,
      this.mmap_x+this.ray_intersections[SCREEN_WIDTH-1].x/2,
      this.ray_intersections[SCREEN_WIDTH-1].y/2
    )

    for (let i=1; i<this.ray_intersections.length-1; i+=10) {
      circle(this.mmap_x+this.ray_intersections[i].x/2, this.ray_intersections[i].y/2, 2);
    }

    this.ray_intersections = [];

    let dir_l = this.dir.get_rotated(-0.75);
    let dir_r = this.dir.get_rotated(+0.75);
  }

  march(map) {
    this.buffer = [];

    for (let x=0; x<SCREEN_WIDTH; x+=1) {

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
          this.ray_intersections.push({x: mapX, y: mapY});
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

    
    let r, g, b;
    let line_height, line_start, line_end;

    for (let i=0; i<SCREEN_WIDTH; i+=1) {

      r = this.buffer[i].colour[0];
      g = this.buffer[i].colour[1];
      b = this.buffer[i].colour[2];

      if (this.buffer[i].side) {
        r/=2, g/=2, b/=2;
      }

      line_height = SCREEN_HEIGHT/this.buffer[i].dist;

      line_start = -line_height / 2 + SCREEN_HEIGHT / 2;
      if(line_start < 0) line_start = 0;
      line_end = line_height / 2 + SCREEN_HEIGHT / 2;
      if(line_end >= SCREEN_HEIGHT) line_end = SCREEN_HEIGHT - 1;

      // strokeWeight(2);
      stroke(r, g, b);
      line(SCREEN_WIDTH-i, line_start, SCREEN_WIDTH-i-1, line_end);
      // rect(SCREEN_WIDTH-i, SCREEN_HEIGHT/2, 2, SCREEN_HEIGHT/this.buffer[i].dist);
    }
    stroke(0);
    rectMode(CORNER);
  }

  input(map) {
    if (keyIsDown(13))
      requestPointerLock();

    this.vel.scale(0.9)
    this.pos.add(this.vel);

    let x = Math.floor(this.pos.x / map.width);
    let y = Math.floor(this.pos.y / map.width);


    if (keyIsDown(keycodes.A)) {
      let temp = this.dir.get_rotated(-1.57);

      let nextx = this.pos.x + temp.x;
      let nexty = this.pos.y + temp.y;
      let next_pos = new Vector2(nextx, nexty);
      
      if (!point_in_wall(next_pos, map)) {
        this.pos.add(temp.get_scaled(this.speed));
      }
    }

    if (keyIsDown(keycodes.D)) {
      let temp = this.dir.get_rotated(+1.57);

      let nextx = this.pos.x + temp.x;
      let nexty = this.pos.y + temp.y;
      let next_pos = new Vector2(nextx, nexty);

      if (!point_in_wall(next_pos, map)) {
        this.pos.add(temp.get_scaled(this.speed));
      }
    }

    if (keyIsDown(keycodes.W)) {
      let nextx = this.pos.x + this.dir.x;
      let nexty = this.pos.y + this.dir.y;
      let next_pos = new Vector2(nextx, nexty);

      if (!point_in_wall(next_pos, map)) {
        this.pos.add(this.dir.get_scaled(this.speed));
      }
    }
   
    if (keyIsDown(keycodes.S)) {
      let nextx = this.pos.x - this.dir.x;
      let nexty = this.pos.y - this.dir.y;
      let next_pos = new Vector2(nextx, nexty);

      if (!point_in_wall(next_pos, map)) {
        this.pos.sub(this.dir.get_scaled(this.speed));
      }
    }


    this.fist_L_sprite.position.y = 900 + 10*(sin(0.2*this.pos.x) + sin(0.2*(this.pos.y)));
    this.fist_R_sprite.position.y = 900 + 10*(cos(0.2*this.pos.x) + cos(0.2*(this.pos.y)));

    this.fist_L_sprite.position.x = 250 + 10*(cos(0.2*this.pos.x) + cos(0.2*(this.pos.y)));
    this.fist_R_sprite.position.x = 750 + 10*(sin(0.2*this.pos.x) + sin(0.2*(this.pos.y)));
    
    if (keyIsDown(keycodes.SPACE)) {
    this.fist_R_sprite.position.y = 700 + 20*(sin(0.2*this.pos.x) + sin(0.2*(this.pos.y)));
    }
    // else {
      // this.fist_R_sprite.position.y = 900;
    // }

    // if (this.fist_L_sprite.position.x < 240) {
    //   this.fist_L_sprite.velocity.x += 1.5;
    // }

    // else if (this.fist_L_sprite.position.x > 260) {
    //   this.fist_L_sprite.velocity.x -= 1.5;
    // }

    // else {
    //   this.fist_L_sprite.velocity.x = 0;
    // }

    // if (this.fist_R_sprite.position.x < 740) {
    //   this.fist_R_sprite.velocity.x += 1.5;
    // }

    // else if (this.fist_R_sprite.position.x > 760) {
    //   this.fist_R_sprite.velocity.x -= 1.5;
    // }

    // else {
    //   this.fist_R_sprite.velocity.x = 0;
    // }

    // this.fist_R_sprite.velocity.x *= 0.9;
    // this.fist_L_sprite.velocity.x *= 0.9;

    if (keyIsDown(LEFT_ARROW)) {
      this.plane.rotate(-0.02);
      this.dir.rotate(-0.02);

      // if (this.fist_R_sprite.position.x < 800)
      //   this.fist_R_sprite.velocity.x += 2;
      // if (this.fist_L_sprite.position.x < 300)
      //   this.fist_L_sprite.velocity.x += 2;
    }

    if (keyIsDown(RIGHT_ARROW)) {
      this.plane.rotate(+0.02);
      this.dir.rotate(+0.02);

      // if (this.fist_R_sprite.position.x > 700)
      //   this.fist_R_sprite.velocity.x -= 2;
      // if (this.fist_L_sprite.position.x > 200)
      //   this.fist_L_sprite.velocity.x -= 2;
    }
      
    // if (keyIsDown(keycodes.DOWN)) {
    //   this.plane.scale(1.01);
    // }
    // if (keyIsDown(keycodes.UP)) {
    //   this.plane.scale(0.99);
    // }
  }
}


/** Determine if a point is inside a wall
 * @param pos position of player
 * @param grid tilemap
 */
function point_in_wall(pos, grid) {

  let xprime = Math.floor(pos.x/grid.width);
  let yprime = Math.floor(pos.y/grid.width);

  if (grid.tilemap[grid.width*yprime + xprime] > 0) {
    return true
  }

  return false;

}

function point_in_cell(x, y, grid) {

  let xprime = Math.floor(x/grid.width);
  let yprime = Math.floor(y/grid.width);

  if (!(grid.tilemap[grid.width*yprime + xprime])) {
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


