space_released = true;


class Player {

  health = 100;
  armor = 100;
  stamina = 100;

  DEFAULT_DAMAGE = 15;
  damage = 15;
  damage_range = 10;

  // POWERUPS
  //---------------------------------
  stimmed_up_on_ritalin = false;
  hitpoints_until_nostim = 0;

  frames_since_ritalin = 0;

  injury_sound;

  can_shoot = true;
  has_pistol = false;
  pistol = new Pistol(scr_wdth/2, scr_hght);
  shoot_sound;

  snort_sound;

  //---------------------------------
 
  can_punch = true;
  is_punching = false;
  dealing_damage = false;
  frames_since_punch = 0;

  headbob_count = 0;

  DEFAULT_MOV_SPEED = 2.5;
  mov_speed = 2.5;
  max_delta_v = 0.15;
  mov_friction = 0.94;

  rot_speed = 0.002;
  pos = new Vector2();
  vel = new Vector2(0, 0);
  dir = new Vector2(1, 0);
  plane = new Vector2(0, 0);
  fov = 1;
  inv_fov = 1;
  fov_modifier = 1;
  res = 1;

  tempvec_1 = new Vector2(0, 0);
  tempvec_2 = new Vector2(0, 0);

  fist_offset = 0;
  dir_L; dir_R;

  depth_buffer = [];
  sprite_buffer = [];

  fist_R_img
  fist_L_sprite;
  fist_R_sprite;
  using_left_fist = false;
  active_fist; inactive_fist;

  constructor(x, y) {
    this.pos.x = x;
    this.pos.y = y;

    for (let i=0; i<scr_wdth; i++) {
      this.depth_buffer[i] = {
        dist: 0,
        side: 0,
        index: 0
      }
    }
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

    loadSound("engine/player/dspistol.mp3", (sound) => {
      this.shoot_sound = sound;
    });

    loadSound("engine/player/dsoof.mp3", (sound) => {
      this.injury_sound = sound;
    });

    loadSound("engine/player/snort.mp3", (sound) => {
      this.snort_sound = sound;
    });

    this.pistol.preload();
  }

  setup() {
    this.dir_L = this.dir.get_rotated(-0.785);
    this.dir_R = this.dir.get_rotated(+0.785);
    this.fist_R_sprite.width = 200;
    this.fist_R_sprite.height = 200;
    this.fist_L_sprite.width = 200;
    this.fist_L_sprite.height = 200;
  
    this.active_fist = this.fist_R_sprite;
    this.inactive_fist = this.fist_L_sprite;
  
    this.pistol.setup();
  }

  count = 0;

  last_health = this.health;
  delta_health = 0;

  last_armor = this.armor;
  delta_armor = 0;

  draw(world_data) {

    if (this.health <= 0) {
      world_data.map_handler.active_map.reset(this);
      this.has_pistol = false;
      pistol_pickup.pos.x = -100;
      pistol_pickup.pos.y = -100;
      this.health = 100;
      this.armor = 100;
      this.stimmed_up_on_ritalin = false;
      this.hitpoints_until_nostim = 0;
      world_data.ui_handler.pause();
    }

    this.health = clamp(this.health, 0, 100);
    this.armor = clamp(this.armor, 0, 100);
    this.stamina = clamp(this.stamina, 0, 100);

    this.stamina += 0.006 * deltaTime;

    this.res = world_data.ui_handler.res_slider.value();
    this.fov = this.fov_modifier * (scr_hght/scr_wdth);
    this.inv_fov = 1 / this.fov;

    if (world_data.map_handler.active_map == undefined) {
      return;
    }

    translate(0, 5*cos(0.1*this.headbob_count));

    this.input(world_data.map_handler.active_map);
    this.collide_with_props(world_data.map_handler.active_map);
    this.collide_with_pickups(world_data.map_handler.active_map);
    this.collide_with_projectiles(world_data.map_handler.active_map)

    if (this.stimmed_up_on_ritalin)
      this.frames_since_ritalin += 1;
    else
      this.frames_since_ritalin = 0;

    if (this.mov_speed > 2*this.DEFAULT_MOV_SPEED && this.stimmed_up_on_ritalin) {
      this.mov_speed -= 0.05 / sqrt(this.frames_since_ritalin);
    }
    else if (this.mov_speed > this.DEFAULT_MOV_SPEED) {
      this.mov_speed -= 0.05 / sqrt(this.frames_since_ritalin);
    }
    
    this.march(world_data.map_handler.active_map);
    this.render_world(world_data.map_handler.active_map);
    this.render_sprites(
      world_data.map_handler.active_map.enemies.concat(
      world_data.map_handler.active_map.props).concat(
      world_data.map_handler.active_map.pickups).concat(
      world_data.map_handler.active_map.projectiles)
    );

    this.occlude_sprites(this.sprite_buffer);

    if (world_data.ui_handler.helmeton.getCurrentFrame() >= 14) {
      if (this.has_pistol) {
        drawSprite(this.pistol.sprite);
      }
      else {
        drawSprite(this.fist_L_sprite);
        drawSprite(this.fist_R_sprite);
      }
    }

    translate(0, -5*cos(0.1*this.headbob_count));

    this.delta_health = this.health - this.last_health;
    this.last_health = this.health;

    this.delta_armor = this.armor - this.last_armor;
    this.last_armor = this.armor;

    if (this.delta_health < 0 || this.delta_armor < 0) {
      this.injury_sound.setVolume(1);
      this.injury_sound.play();
    
      rectMode(CORNER);
      fill(255, 0, 0);
      rect(0, 0, scr_wdth, scr_hght);
    }
  }

  march_dir = new Vector2(0, 0);

  march(map) {

    this.dir.normalise();
    this.dir.scale(this.fov);

    for (let x=0; x<scr_wdth; x+=this.res) {
      let camx = (2*x)/(scr_wdth)-1;

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

        if (point_in_cell(mapX, mapY, map)) {
          hit = 1;
        }
      }

      if (side == 0) {
        for (let i=x; i<x+this.res; i++) {
          if (i >= scr_wdth)
            break;
          this.depth_buffer[i].dist = angle * (sideDistX - dx);
          this.depth_buffer[i].side = side;
          this.depth_buffer[i].index = 25*Math.floor(mapY/25) + Math.floor(mapX/25);
        }
      }
      else {
        for (let i=x; i<x+this.res; i++) {
          if (i >= scr_wdth)
            break;
          this.depth_buffer[i].dist = angle * (sideDistY - dy);
          this.depth_buffer[i].side = side;
          this.depth_buffer[i].index = 25*Math.floor(mapY/25) + Math.floor(mapX/25);
        }
      }
    }

    this.dir.normalise();
  }

  render_world(active_map) {

    let r, g, b;
    let line_height, line_start, line_end;

    for (let i=0; i<scr_wdth; i+=this.res) {

      r = active_map.colourmap[4*this.depth_buffer[i].index+0];
      g = active_map.colourmap[4*this.depth_buffer[i].index+1];
      b = active_map.colourmap[4*this.depth_buffer[i].index+2];

      if (this.depth_buffer[i].side) {
        r/=2, g/=2, b/=2;
      }

      line_height = 10 * this.fov_modifier * (scr_hght/this.depth_buffer[i].dist);

      line_start = (-line_height + scr_hght) / 2;
      line_end   = (+line_height + scr_hght) / 2;

      strokeWeight(this.res+1);
      stroke(r, g, b);
      line(i, line_start, i, line_end);
    }
    stroke(0);
    rectMode(CORNER);
  }

  player_to_sprite = new Vector2(0, 0);
  newpos = new Vector2(0, 0); 

  render_sprites(sprite_array) {

    // Sort sprites by distance
    sprite_array.sort((a, b) => {
      if (vector2_dist(a.pos, this.pos) > vector2_dist(b.pos, this.pos))
        return -1;
      else
        return 1;
    })
    
    for (let i=0; i<sprite_array.length; i++) {
      this.player_to_sprite.x = this.pos.x - sprite_array[i].pos.x;
      this.player_to_sprite.y = this.pos.y - sprite_array[i].pos.y;
      this.player_to_sprite.normalise();

      if (vector2_dot(this.dir, this.player_to_sprite) < 0) {
        this.dir.normalise();
        this.dir.scale(this.fov);

        this.sprite_buffer.push(sprite_array[i]);
        
        this.newpos.x = sprite_array[i].pos.x - this.pos.x;
        this.newpos.y = sprite_array[i].pos.y - this.pos.y;
        let invDet = 1 / (this.plane.x*this.dir.y - this.dir.x*this.plane.y);
        let transformX = invDet * (this.dir.y*this.newpos.x - this.dir.x*this.newpos.y);
        let transformY = invDet * (-this.plane.y*this.newpos.x + this.plane.x*this.newpos.y);

        let dist = p2oint_plane_dist(this.dir.x, this.dir.y, (this.pos.x+this.dir.x), (this.pos.y+this.dir.y), sprite_array[i].pos.x, sprite_array[i].pos.y);

        dist = (dist <= 0.5) ? 0.5 : dist;

        sprite_array[i].sprite.position.x = Math.floor((scr_wdth/2) * (1 + transformX/transformY));
        
        let vdiv = (sprite_array[i].height*(scr_hght/1000)) / this.fov;
        let vmove = (sprite_array[i].voffset*(scr_hght/1000)) / this.fov;
        // let vmove = sprite_array[i].voffset / this.fov;
        let vMoveScreen = floor(vmove/transformY);

        let sprite_height = abs(scr_hght/(dist*vdiv)) * (scr_hght / 1000);
        let scaling_factor = sprite_height / sprite_array[i].active_img.height;

        sprite_array[i].sprite.scale = scaling_factor * this.fov_modifier;
        sprite_array[i].sprite.position.y = scr_hght/2 + vMoveScreen * this.fov_modifier;
      }

      else {
        sprite_array[i].sprite.scale = 0;
        sprite_array[i].sprite.position.x = -100;
      }
    }
    this.dir.normalise();
  }

  plane_pos = new Vector2(0, 0);

  occlude_sprites(sprite_buffer) {
    rectMode(CENTER);
    for (let j=0; j<this.sprite_buffer.length; j++) {

      this.plane_pos.x = this.pos.x + this.dir.x;
      this.plane_pos.y = this.pos.y + this.dir.y;

      let sprite_dist = p2oint_plane_dist(
        this.dir.x, this.dir.y,
        this.plane_pos.x, this.plane_pos.y,
        this.sprite_buffer[j].pos.x,
        this.sprite_buffer[j].pos.y
      );

      let c1 = this.sprite_buffer[j].sprite.position.x < 0 && sprite_dist < this.depth_buffer[0].dist;
      let c2 = this.sprite_buffer[j].sprite.position.x >= scr_wdth && sprite_dist < this.depth_buffer[scr_wdth-1].dist;

      if (c1 || c2) {
        drawSprite(this.sprite_buffer[j].sprite);
        continue;
      }

      else if (this.sprite_buffer[j].sprite.position.x < 0 || this.sprite_buffer[j].sprite.position.x >= scr_wdth) {
        continue;
      }

      let wall_dist = this.depth_buffer[floor(this.sprite_buffer[j].sprite.position.x)].dist;

      if (wall_dist > sprite_dist) {
        drawSprite(this.sprite_buffer[j].sprite);
      }
    }

    this.sprite_buffer = [];
  }

  next_pos = new Vector2(0, 0);
  delta_vel = new Vector2(0, 0);
  move_dir = new Vector2(0, 0);

  input(map) {

    if (game_paused)
      return;

    this.vel.scale(this.mov_friction);

    let deltav_x = this.vel.x * this.mov_speed;
    let deltav_y = this.vel.y * this.mov_speed;

    let dv_mag = sqrt(deltav_x**2 + deltav_y**2);

    if (point_in_wall(this.pos.x+(deltav_x/dv_mag)*5, this.pos.y+(deltav_y/dv_mag)*5, map)) {
      deltav_x = 0;
      deltav_y = 0;
    }

    this.delta_vel.x = 0;
    this.delta_vel.y = 0;

    this.pos.x += deltav_x * (deltaTime/7);
    this.pos.y += deltav_y * (deltaTime/7);

    let headbob = false;

    if (keyIsDown(keycodes.A)) {
      this.move_dir.x = this.dir.x;
      this.move_dir.y = this.dir.y;
      this.move_dir.rotate(-1.57);
      this.delta_vel.x += this.move_dir.x*this.mov_speed;
      this.delta_vel.y += this.move_dir.y*this.mov_speed;
      headbob = true;
    }

    if (keyIsDown(keycodes.D)) {
      this.move_dir.x = this.dir.x;
      this.move_dir.y = this.dir.y;
      this.move_dir.rotate(+1.57);
      this.delta_vel.x += this.move_dir.x*this.mov_speed;
      this.delta_vel.y += this.move_dir.y*this.mov_speed;
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

    
    if (this.has_pistol) {
      this.pistol.sprite.position.x = scr_wdth/2;
      this.pistol.sprite.position.y = scr_hght - 200;

      if (keyIsDown(keycodes.SPACE) && this.can_shoot && space_released) {
        this.shoot_sound.play();
        this.can_shoot = false;
        space_released = false;
        this.pistol.sprite.animation.play();
        this.tempvec_1.x = this.dir.x;
        this.tempvec_1.y = this.dir.y;
        this.tempvec_1.normalise();
        this.tempvec_1.scale(10);

        this.tempvec_2.x = this.pos.x;
        this.tempvec_2.y = this.pos.y;
        this.tempvec_2.add(this.tempvec_1);
        this.tempvec_1.normalise();
        this.tempvec_1.scale(5);

        world_data.map_handler.active_map.create_projectile(this.tempvec_2, this.tempvec_1.x, this.tempvec_1.y, 50, 2);
      }

      if (this.pistol.sprite.animation.frame == 4) {
        this.pistol.sprite.animation.stop();
        this.can_shoot = true;
        this.pistol.sprite.animation.frame = 0;
      }
    }

    else {

      if (keyIsDown(keycodes.SPACE) && this.can_punch && this.stamina >= 10) {
        this.stamina -= 10;
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
  
          if (this.using_left_fist == true) {
            this.active_fist = this.fist_R_sprite;
            this.inactive_fist = this.fist_L_sprite;
          }
          else {
            this.active_fist = this.fist_L_sprite;
            this.inactive_fist = this.fist_R_sprite;
          }
    
          this.using_left_fist = !this.using_left_fist;
        }
      }

      this.fist_L_sprite.scale = 3 * scr_hght/1000;
      this.fist_R_sprite.scale = 3 * scr_hght/1000;
  
      if (this.is_punching) {
        this.active_fist.position.y = (800 + 20*(sin(0.2*this.pos.x) + sin(0.2*(this.pos.y)))) * ratio_y;
      }
      if (!this.is_punching) {
        this.active_fist.position.y = (1000 + 10*(cos(0.1*this.pos.x) + cos(0.1*(this.pos.y)))) * ratio_y;
      }
  
      this.inactive_fist.position.y = (1000 + 10*(cos(0.1*this.pos.x) + cos(0.1*(this.pos.y)))) * ratio_y;
      
      this.fist_R_sprite.position.x = (scr_wdth/2)+this.fist_L_sprite.scale*100 + (10*(sin(0.1*this.pos.x) + sin(0.1*(this.pos.y))));
      this.fist_L_sprite.position.x = (scr_wdth/2)-this.fist_L_sprite.scale*100 + (10*(cos(0.1*this.pos.x) + cos(0.1*(this.pos.y))));
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
        for (let i=0; i<pickup.attributes.length; i++) {
          this[pickup.attributes[i]] += pickup.amounts[i];
        }
        pickup.pos.x = -100;
        pickup.pos.y = -100;
      
        if (pickup.name == "ritalin") {
          this.snort_sound.play();
        }
      }
    }
  }

  collide_with_projectiles(map) {
    for (let projectile of map.projectiles) {
      if (vector2_dist(projectile.pos, this.pos) < projectile.radius) {
        projectile.pos.x = -100; projectile.pos.y = -100;
        projectile.xvel = 0; projectile.yvel = 0;

        if (this.armor > 0)
          this.armor -= projectile.damage;
        else
          this.health -= projectile.damage;
        
        if (this.hitpoints_until_nostim > 0)
          this.hitpoints_until_nostim -= projectile.damage;

        else {
          this.stimmed_up_on_ritalin = false;
          this.damage = this.DEFAULT_DAMAGE;
          this.mov_speed = this.DEFAULT_MOV_SPEED;
        }
      }
    }
  }

  set_dir(x, y) {
    this.dir.x = x;
    this.dir.y = y;

    this.plane.x = x;
    this.plane.y = y;
    this.plane.rotate(Math.PI/2);
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

  if (grid.tilemap[grid.width*yprime + xprime]) {
    return true;
  }
  return false;
}

function mouseMoved(event) {
  if (game_paused == false) {
    world_data.players[0].plane.rotate(0.003 * event.movementX * 1);
    world_data.players[0].dir.rotate(0.003 * event.movementX * 1);
  }
}

function keyReleased(event) {
  if (event.keyCode == 32) {
    space_released = true;
  }
}