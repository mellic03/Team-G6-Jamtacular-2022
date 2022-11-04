class Player {

  health = 100;
  armor = 100;
  stamina = 100;
  damage;

  rot_speed = 0.003;
  mov_speed = 0.06;
  pos = new Vector2();
  vel = new Vector2(0, 0);
  dir = new Vector2(1, 0);
  plane = new Vector2(0, -SCREEN_WIDTH/SCREEN_HEIGHT);

  fist_offset = 0;
  dir_L; dir_R;

  fov = 3.14159/2;
  scan_res = SCREEN_WIDTH;

  ray_width = SCREEN_WIDTH/this.scan_res;
  depth_buffer = [];
  sprite_buffer = []; // buffer of sprites waiting for occlusion test
  sprite_width_buffer = []; // screen width of each sprite waiting for occlusion test

  self_group;
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
  }

  draw(world_data) {

    this.health -= 0.001;
    this.depth_buffer = [];
    this.input(world_data.active_map);
    this.march(world_data.active_map);
    this.world_render();
    this.sprite_render(world_data.enemies.concat(world_data.props));
    this.occlude_sprites(this.sprite_buffer);
    this.draw_minimap(world_data.active_map);
    drawSprite(this.fist_L_sprite);
    drawSprite(this.fist_R_sprite);
  }

  draw_minimap(map) {

    if (this.ray_intersections.length == 0)
      return;

    fill(10);
    rectMode(CORNER)
    rect(this.mmap_x, 0, this.mmap_width, this.mmap_width);
    for (let x=0; x<map.width; x++) {
      for (let y=0; y<map.width; y++) {
        if (map.tilemap[map.width*y + x] > 0) {

          fill(
            map.colourmap[map.width*y + x],
            map.colourmap[map.width*y + x+1],
            map.colourmap[map.width*y + x+2]
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
  }

  march(map) {
    this.depth_buffer = [];

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
        this.depth_buffer[x] = {
          dist: ((sideDistX - dx)*angle) / 10,
          real_dist: (sideDistX - dx)*angle,
          side: side,
          x: mapX,
          y: mapY,
          colour: colour
        };
      else
        this.depth_buffer[x] = {
          dist: ((sideDistY - dy)*angle) / 10,
          real_dist: (sideDistY - dy)*angle,
          side: side,
          x: mapX,
          y: mapY,
          colour: colour
        };
    }
  }

  world_render() {
        
    let r, g, b;
    let line_height, line_start, line_end;

    for (let i=0; i<SCREEN_WIDTH; i+=1) {

      r = this.depth_buffer[i].colour[0];
      g = this.depth_buffer[i].colour[1];
      b = this.depth_buffer[i].colour[2];

      if (this.depth_buffer[i].side) {
        r/=2, g/=2, b/=2;
      }

      line_height = SCREEN_HEIGHT/this.depth_buffer[i].dist;

      line_start = -line_height / 2 + SCREEN_HEIGHT / 2;
      if(line_start < 0) line_start = 0;
      line_end = line_height / 2 + SCREEN_HEIGHT / 2;
      if(line_end >= SCREEN_HEIGHT) line_end = SCREEN_HEIGHT - 1;

      // strokeWeight(2);
      stroke(r, g, b);
      line(SCREEN_WIDTH-i, line_start, SCREEN_WIDTH-i-1, line_end);
    }
    stroke(0);
    rectMode(CORNER);
  }

  sprite_render(sprite_array) {
    
    // Sort sprites by distance, from furthest to nearest
    let dist_i, dist_j;
    for (let i=0; i<sprite_array.length; i++) {
      for (let j=0; j<sprite_array.length; j++) {
        if (i!=j) {
          dist_i = vector2_dist(this.pos, sprite_array[i].pos);
          dist_j = vector2_dist(this.pos, sprite_array[j].pos);
          if (dist_i > dist_j) {
            let temp = sprite_array[i];
            sprite_array[i] = sprite_array[j];
            sprite_array[j] = temp;
          }
        }
      }
    }
    
    for (let i=0; i<sprite_array.length; i++) {
      let player_to_sprite = vector2_sub(this.pos, sprite_array[i].pos);
      player_to_sprite.normalise();
      if (vector2_dot(this.dir, player_to_sprite) < -0.1) {

        this.sprite_buffer.push(sprite_array[i]);
        
        let newpos = vector2_sub(sprite_array[i].pos, this.pos);
        let invDet = 1 / (this.plane.x*this.dir.y - this.dir.x*this.plane.y);

        let transformX = invDet * (this.dir.x*newpos.y - this.dir.y*newpos.x);
        let transformY = invDet * (this.plane.x*newpos.y - this.plane.y*newpos.x);

        let spriteScreenX = (SCREEN_WIDTH/2) * (1 + transformX/transformY);
        sprite_array[i].sprite.position.x = spriteScreenX;

        let sprite_height = abs(SCREEN_HEIGHT / transformY);
        let scaling_factor = 10*sprite_height / sprite_array[i].active_img.height;
        sprite_array[i].sprite.scale = scaling_factor;
        sprite_array[i].sprite.position.y = SCREEN_HEIGHT/2 + 2*sprite_height;
        
        this.sprite_width_buffer[i] = sprite_height * (sprite_array[i].active_img.width/sprite_array[i].active_img.height);
      }

      else {
        sprite_array[i].sprite.scale = 0;
        sprite_array[i].sprite.position.x = -100;
      }
    }
  }

  occlude_sprites(sprite_buffer) {
    rectMode(CENTER);
    let occluded = false;

    for (let j=0; j<this.sprite_buffer.length; j++) {

      if (this.sprite_buffer[j].sprite.position.x < 0 || this.sprite_buffer[j].sprite.position.x >= SCREEN_WIDTH) {
        continue;
      }

      let sprite_dist = vector2_dist(this.pos, this.sprite_buffer[j].pos);
      let wall_dist = this.depth_buffer[SCREEN_WIDTH-floor(this.sprite_buffer[j].sprite.position.x)-1].dist*10

      // let xmin = max(floor(this.sprite_buffer[j].sprite.position.x-this.sprite_width_buffer[j]/2), 0);
      // let xmax = min(floor(this.sprite_buffer[j].sprite.position.x+this.sprite_width_buffer[j]/2), SCREEN_WIDTH);


      // console.log(`sprite: ${floor(sprite_dist)}, col: ${floor(enemies[j].sprite.position.x)},  wall: ${floor(wall_dist)}`);

      if (wall_dist > sprite_dist) {
        drawSprite(this.sprite_buffer[j].sprite);
      }
    }

    this.sprite_buffer = [];
  }

  input(map) {
    if (keyIsDown(13))
      requestPointerLock();

    this.vel.scale(0.9)
    this.pos.add(this.vel);

    if (keyIsDown(keycodes.A)) {
      let temp = this.dir.get_rotated(-1.57);

      let nextx = this.pos.x + temp.x;
      let nexty = this.pos.y + temp.y;
      let next_pos = new Vector2(nextx, nexty);
      
      if (!point_in_wall(next_pos, map)) {
        this.pos.add(temp.get_scaled(this.mov_speed * deltaTime));
      }
    }

    if (keyIsDown(keycodes.D)) {
      let temp = this.dir.get_rotated(+1.57);

      let nextx = this.pos.x + temp.x;
      let nexty = this.pos.y + temp.y;
      let next_pos = new Vector2(nextx, nexty);

      if (!point_in_wall(next_pos, map)) {
        this.pos.add(temp.get_scaled(this.mov_speed * deltaTime));
      }
    }

    if (keyIsDown(keycodes.W)) {
      let nextx = this.pos.x + this.dir.x;
      let nexty = this.pos.y + this.dir.y;
      let next_pos = new Vector2(nextx, nexty);

      if (!point_in_wall(next_pos, map)) {
        this.pos.add(this.dir.get_scaled(this.mov_speed * deltaTime));
      }
    }
   
    if (keyIsDown(keycodes.S)) {
      let nextx = this.pos.x - this.dir.x;
      let nexty = this.pos.y - this.dir.y;
      let next_pos = new Vector2(nextx, nexty);

      if (!point_in_wall(next_pos, map)) {
        this.pos.sub(this.dir.get_scaled(this.mov_speed * deltaTime));
      }
    }


    this.fist_L_sprite.position.y = 900 + 10*(sin(0.2*this.pos.x) + sin(0.2*(this.pos.y)));
    this.fist_R_sprite.position.y = 900 + 10*(cos(0.2*this.pos.x) + cos(0.2*(this.pos.y)));

    this.fist_L_sprite.position.x = 250 + 10*(cos(0.2*this.pos.x) + cos(0.2*(this.pos.y)));
    this.fist_R_sprite.position.x = 750 + 10*(sin(0.2*this.pos.x) + sin(0.2*(this.pos.y)));
    
    if (keyIsDown(keycodes.SPACE)) {
    this.fist_R_sprite.position.y = 700 + 20*(sin(0.2*this.pos.x) + sin(0.2*(this.pos.y)));
    }

    if (keyIsDown(LEFT_ARROW)) {
      this.plane.rotate(-this.rot_speed * deltaTime);
      this.dir.rotate(-this.rot_speed * deltaTime);
    }

    if (keyIsDown(RIGHT_ARROW)) {
      this.plane.rotate(+this.rot_speed * deltaTime);
      this.dir.rotate(+this.rot_speed * deltaTime);
    }

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
    return grid.colourmap[grid.width*yprime + xprime];
  }
}


