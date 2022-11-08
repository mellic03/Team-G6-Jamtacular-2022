class Player {

  health = 100;
  armor = 100;
  stamina = 100;
  damage = 10;

  // POWERUPS
  //---------------------------------
  stimmed_up_on_ritalin = false; 
  //---------------------------------

  can_punch = true;
  is_punching = false;
  dealing_damage = false;
  frames_since_punch = 0;

  headbob_count = 0;

  mov_speed = 0.4;
  max_delta_v = 0.15;
  mov_friction = 0.94;

  rot_speed = 0.002;
  pos = new Vector2();
  vel = new Vector2(0, 0);
  dir = new Vector2(1, 0);
  plane = new Vector2(0, +SCREEN_WIDTH/SCREEN_HEIGHT);

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

  count = 0;

  draw(world_data) {
    
    this.health = clamp(this.health, 0, 100)

    if (world_data.active_map == undefined) {
      return;
    }

    translate(0, 5*cos(0.1*this.headbob_count));

    this.depth_buffer = [];
    this.input(world_data.map_handler.active_map);
    this.collide_with_props(world_data.map_handler.active_map);
    this.collide_with_pickups(world_data.map_handler.active_map);
    this.march(world_data.map_handler.active_map);
    this.world_render();
    // this.sprite_render(world_data.active_map.enemies.concat(world_data.props));
    // console.log(world_data.active_map.enemies);
    this.sprite_render(world_data.map_handler.active_map.enemies.concat(world_data.map_handler.active_map.props).concat(world_data.map_handler.active_map.pickups));
    this.occlude_sprites(this.sprite_buffer);
    // this.draw_minimap(world_data.active_map);
    drawSprite(this.fist_L_sprite);
    drawSprite(this.fist_R_sprite);

    translate(0, -5*cos(0.1*this.headbob_count));
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

  march_dir = new Vector2(0, 0);

  march(map) {
    this.depth_buffer = [];

    for (let x=0; x<SCREEN_WIDTH; x+=1) {

      let camx = (2*x)/(SCREEN_WIDTH)-1;

      this.march_dir.x = this.dir.x + this.plane.x*camx;
      this.march_dir.y = this.dir.y + this.plane.y*camx;

      let angle = vector2_angle(this.dir, this.march_dir);

      let dx = sqrt(1 + (this.march_dir.y**2 / this.march_dir.x**2));
      let dy = sqrt(1 + (this.march_dir.x**2 / this.march_dir.y**2));

      let step_x, step_y;

      let mapX = Math.floor(this.pos.x);
      let mapY = Math.floor(this.pos.y);

      let sideDistX, sideDistY;

      if (this.march_dir.x < 0) {
        step_x = -1;
        sideDistX = (this.pos.x - mapX) * dx;
      }
      else {
        step_x = 1;
        sideDistX = (mapX + 1.0 - this.pos.x) * dx;
      }

      if (this.march_dir.y < 0) {
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

      let steps = 0;

      while (hit == 0 && steps < 1000) {
        steps++;
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

      line_start = -line_height/2 + SCREEN_HEIGHT/2;
      line_end = line_height/2 + SCREEN_HEIGHT/2;

      // strokeWeight(2);
      stroke(r, g, b);
      line(i, line_start, i+1, line_end);
    }
    stroke(0);
    rectMode(CORNER);
  }

  player_to_sprite = new Vector2(0, 0);
  newpos = new Vector2(0, 0); 

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
      this.player_to_sprite.x = this.pos.x - sprite_array[i].pos.x;
      this.player_to_sprite.y = this.pos.y - sprite_array[i].pos.y;
      this.player_to_sprite.normalise();

      if (vector2_dot(this.dir, this.player_to_sprite) < -0.1) {

        this.sprite_buffer.push(sprite_array[i]);
        
        this.newpos.x = sprite_array[i].pos.x - this.pos.x;
        this.newpos.y = sprite_array[i].pos.y - this.pos.y;
        let invDet = 1 / (this.plane.x*this.dir.y - this.dir.x*this.plane.y);
        let transformX = invDet * (this.dir.y*this.newpos.x - this.dir.x*this.newpos.y);
        let transformY = invDet * (-this.plane.y*this.newpos.x + this.plane.x*this.newpos.y);

        // let dist = point_plane_dist(this.dir, vector2_add(this.pos, this.dir), sprite_array[i].pos);
        let dist = p2oint_plane_dist(this.dir.x, this.dir.y, (this.pos.x+this.dir.x), (this.pos.y+this.dir.y), sprite_array[i].pos.x, sprite_array[i].pos.y);

        dist = (dist < 3) ? 3 : dist;

        sprite_array[i].sprite.position.x = (SCREEN_WIDTH/2) * (1 + transformX/dist);
        
        let vdiv = sprite_array[i].height;
        let vmove = sprite_array[i].voffset;
        let vMoveScreen = floor(vmove / transformY);

        let sprite_height = abs(SCREEN_HEIGHT / dist) / vdiv;
        let scaling_factor = sprite_height / sprite_array[i].active_img.height;


        let drawStartY = -sprite_height / 2 + SCREEN_HEIGHT / 2 + vMoveScreen;
        let drawEndY = sprite_height / 2 + SCREEN_HEIGHT / 2 + vMoveScreen;


        sprite_array[i].sprite.scale = scaling_factor;
        sprite_array[i].sprite.position.y = (drawStartY + drawEndY)/2;

        // console.log(`height: ${sprite_height} * scale: ${scaling_factor} == ${sprite_height*scaling_factor}, y = ${sprite_array[i].sprite.position.y}`);

        this.sprite_width_buffer[i] = sprite_height*(sprite_array[i].active_img.width/sprite_array[i].active_img.height)/sprite_array[i].frames;
      }

      else {
        sprite_array[i].sprite.scale = 0;
        sprite_array[i].sprite.position.x = -100;
      }
    }
  }

  occlude_sprites(sprite_buffer) {
    rectMode(CENTER);
    for (let j=0; j<this.sprite_buffer.length; j++) {

      let sprite_dist = point_plane_dist(this.dir, vector2_add(this.pos, this.dir), this.sprite_buffer[j].pos);

      let c1 = this.sprite_buffer[j].sprite.position.x < 0 && sprite_dist < this.depth_buffer[0].real_dist;
      let c2 = this.sprite_buffer[j].sprite.position.x >= SCREEN_WIDTH && sprite_dist < this.depth_buffer[SCREEN_WIDTH-1].real_dist;

      if (c1 || c2) {
        drawSprite(this.sprite_buffer[j].sprite);
        continue;
      }

      else if (this.sprite_buffer[j].sprite.position.x < 0 || this.sprite_buffer[j].sprite.position.x >= SCREEN_WIDTH) {
        continue;
      }

      let wall_dist = this.depth_buffer[floor(this.sprite_buffer[j].sprite.position.x)].real_dist;

      if (wall_dist > sprite_dist) {
        drawSprite(this.sprite_buffer[j].sprite);
      }
    }

    this.sprite_buffer = [];
  }

  next_pos = new Vector2(0, 0);
  delta_vel = new Vector2(0, 0);

  input(map) {
    if (keyIsDown(13))
      requestPointerLock();

    this.vel.scale(this.mov_friction);

    let deltav_x = this.vel.x * this.mov_speed * deltaTime;
    let deltav_y = this.vel.y * this.mov_speed * deltaTime;

    if (point_in_wall(this.pos.x+deltav_x, this.pos.y+deltav_y, map)) {
      deltav_x = 0;
      deltav_y = 0;
    }

    this.pos.x += deltav_x;
    this.pos.y += deltav_y;

    this.delta_vel.x = 0;
    this.delta_vel.y = 0;

    let headbob = false;

    if (keyIsDown(keycodes.A)) {
      let temp = this.dir.get_rotated(-1.57);
      this.delta_vel.x += temp.x*this.mov_speed;
      this.delta_vel.y += temp.y*this.mov_speed;
      headbob = true;
    }

    if (keyIsDown(keycodes.D)) {
      let temp = this.dir.get_rotated(+1.57);
      this.delta_vel.x += temp.x*this.mov_speed;
      this.delta_vel.y += temp.y*this.mov_speed;
      headbob = true;
    }

    if (keyIsDown(keycodes.W)) {
      this.delta_vel.x += this.dir.x*this.mov_speed;
      this.delta_vel.y += this.dir.y*this.mov_speed;
      headbob = true;
    }

    if (keyIsDown(keycodes.S)) {
      this.delta_vel.x -= this.dir.x*this.mov_speed;
      this.delta_vel.y -= this.dir.y*this.mov_speed;
      headbob = true;
    }

    if (headbob) this.headbob_count += 0.1 * deltaTime;

    this.vel.x += this.delta_vel.x;
    this.vel.y += this.delta_vel.y;

    let mag = this.delta_vel.mag();
    if (mag > this.max_delta_v) {
      this.vel.normalise();
      this.vel.scale(this.max_delta_v);
    }


    if (keyIsDown(keycodes.SPACE) && this.can_punch) {
      this.can_punch = false;
      this.dealing_damage = true;
      this.is_punching = true;
      this.frames_since_punch = 0;
    }

    if (this.is_punching) {
      this.frames_since_punch += 1;
    }

    if (this.frames_since_punch > 1) {
      this.dealing_damage = false;
      if (!keyIsDown(keycodes.SPACE) && this.frames_since_punch > 10) {
        this.is_punching = false;
        this.can_punch = true;
      }
    }

    if (this.is_punching) {
      this.fist_R_sprite.position.y = (700 + 20*(sin(0.2*this.pos.x) + sin(0.2*(this.pos.y)))) * (SCREEN_HEIGHT/1000);
    }
    if (!this.is_punching) {
      this.fist_R_sprite.position.y = (900 + 10*(cos(0.1*this.pos.x) + cos(0.1*(this.pos.y)))) * (SCREEN_HEIGHT/1000);
      this.fist_R_sprite.position.x = (750 + 10*(sin(0.1*this.pos.x) + sin(0.1*(this.pos.y)))) * (SCREEN_WIDTH/1000);
    }

    this.fist_L_sprite.position.y = (900 + 10*(sin(0.1*this.pos.x) + sin(0.1*(this.pos.y)))) * (SCREEN_HEIGHT/1000);
    this.fist_L_sprite.position.x = (250 + 10*(cos(0.1*this.pos.x) + cos(0.1*(this.pos.y)))) * (SCREEN_WIDTH/1000);
    
    if (keyIsDown(LEFT_ARROW)) {
      this.plane.rotate(-this.rot_speed * deltaTime);
      this.dir.rotate(-this.rot_speed * deltaTime);
    }

    if (keyIsDown(RIGHT_ARROW)) {
      this.plane.rotate(+this.rot_speed * deltaTime);
      this.dir.rotate(+this.rot_speed * deltaTime);
    }



  }

  prop_dir = new Vector2(0, 0);

  collide_with_props(map) {

    for (let prop of map.props) {
      let dist = vector2_dist(this.pos, prop.pos);
      if (dist < prop.collision_radius) {
        this.prop_dir.x = this.pos.x - prop.pos.x;
        this.prop_dir.y = this.pos.y - prop.pos.y;
        this.prop_dir.normalise();
        this.vel.x = 0;
        this.vel.y = 0;
        this.prop_dir.scale(0.06);
        this.vel.add(this.prop_dir);
      }
    }

  }

  collide_with_pickups(map) {

    for (let pickup of map.pickups) {
      let dist = vector2_dist(this.pos, pickup.pos);
      if (dist < 5) {

        this[pickup.attribute] += pickup.amount;
        pickup.pos = -100;

      }
    }

  }

}


/** Determine if a point is inside a wall
 * @param pos position of player
 * @param grid tilemap
 */
function point_in_wall(x, y, grid) {

  let xprime = Math.floor(x/grid.width);
  let yprime = Math.floor(y/grid.width);

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

function keyReleased(event) {

  if (event.code == "Space") {
    // world_data.players[0].can_punch = true;
  }

}


function mouseMoved(event) {

  world_data.players[0].plane.rotate(0.0003 * event.movementX * deltaTime);
  world_data.players[0].dir.rotate(0.0003 * event.movementX * deltaTime);

}