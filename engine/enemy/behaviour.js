const behaviour_scripts = {

  use_velocity(enemy, world_data) {
    enemy.vel.scale(0.95);
    let dv_x = enemy.vel.x;
    let dv_y = enemy.vel.y;

    let mag = sqrt(dv_x**2 + dv_y**2);
    let dv_xn = dv_x/mag;
    let dv_yn = dv_y/mag;

    if (world_data.map_handler.active_map.point_in_grid(enemy.pos.x+dv_xn*enemy.push_range, enemy.pos.y+dv_yn*enemy.push_range)) {
      dv_x *= -1;
      dv_y *= -1;
      enemy.vel.x = 0;
      enemy.vel.y = 0;
    }

    dv_x *= 0.01 * deltaTime;
    dv_y *= 0.01 * deltaTime;

    enemy.pos.x += dv_x;
    enemy.pos.y += dv_y;
  },

  follow_player_zigzag(enemy, world_data) {

    if (enemy.health <= 0) {
      return;
    }

    let player = world_data.players[0];

    enemy.to_player.x = player.pos.x - enemy.pos.x;
    enemy.to_player.y = player.pos.y - enemy.pos.y;

    enemy.to_player.normalise();

    let movement_x = 0;
    let movement_y = 0;

    let dist = vector2_dist(player.pos, enemy.pos);

    // Move towards the player at the nearest 45 degree angle,
    // keep track of delta_dist, if delta_dist becomes too small, 
    // recalculate nearest 45 degree angle

    // circle(400+enemy.pos.x, 50+enemy.pos.y, 10);

    // stroke(0, 255, 0);
    // line(400+enemy.pos.x, 50+enemy.pos.y, 400+enemy.pos.x+enemy.dir.x*40, 50+enemy.pos.y+enemy.dir.y*40);

    // stroke(0, 0, 255);
    // line(400+enemy.pos.x, 50+enemy.pos.y, 400+enemy.pos.x+enemy.dirs[0].x*20, 50+enemy.pos.y+enemy.dirs[0].y*20);
    // line(400+enemy.pos.x, 50+enemy.pos.y, 400+enemy.pos.x+enemy.dirs[1].x*20, 50+enemy.pos.y+enemy.dirs[1].y*20);
    // line(400+enemy.pos.x, 50+enemy.pos.y, 400+enemy.pos.x+enemy.dirs[2].x*20, 50+enemy.pos.y+enemy.dirs[2].y*20);
    // line(400+enemy.pos.x, 50+enemy.pos.y, 400+enemy.pos.x+enemy.dirs[3].x*20, 50+enemy.pos.y+enemy.dirs[3].y*20);

    // stroke(0, 0, 0);
    // line(400+enemy.pos.x, 50+enemy.pos.y, 400+enemy.pos.x+enemy.to_player.x*30, 50+enemy.pos.y+enemy.to_player.y*30);

    // fill(0, 255, 0);
    // circle(400+player.pos.x, 50+player.pos.y, 10);


    if (dist <= enemy.attack_range) {
      return;
    }

    else if (dist <= enemy.chase_range) {
      enemy.dir.lerp(enemy.to_player, 0.03);
      enemy.dir.normalise();
    }

    else if (dist <= enemy.follow_range) {
      
      if (enemy.player_delta_dist < 0.01) {

        let dot = -1;
        for (let i=0; i<4; i++) {
          let new_dot = vector2_dot(enemy.dirs[i], enemy.to_player);
          if (new_dot > dot) {
            dot = new_dot;
            enemy.dir.x = enemy.dirs[i].x;
            enemy.dir.y = enemy.dirs[i].y;
          }
        }
      }
    }

    if (world_data.map_handler.active_map.point_in_grid(enemy.pos.x+enemy.dir.x*enemy.push_range, enemy.pos.y+enemy.dir.y*enemy.push_range)) {
      let index = floor(random(0, 4));
      enemy.dir.x = enemy.dirs[index].x;
      enemy.dir.y = enemy.dirs[index].y;
    }

    enemy.player_delta_dist = abs(dist - enemy.player_last_dist);
    enemy.player_last_dist = dist;

    // movement_x = enemy.dir.x;
    // movement_y = enemy.dir.y;

    // mag = sqrt(movement_x**2 + movement_y**2);
    // movement_x = (mag != 0) ? movement_x/mag : 0;
    // movement_y = (mag != 0) ? movement_y/mag : 0;

    // movement_x *= enemy.speed;
    // movement_y *= enemy.speed;

    enemy.pos.x += enemy.dir.x * 0.01 * deltaTime;
    enemy.pos.y += enemy.dir.y * 0.01 * deltaTime;
  },

  push_player(enemy, world_data) {

    if (enemy.health <= 0)
      return;

    let player = world_data.players[0];
    let dist = vector2_dist(player.pos, enemy.pos);

    if (dist <= enemy.push_range) {

      enemy.to_player.x = player.pos.x - enemy.pos.x;
      enemy.to_player.y = player.pos.y - enemy.pos.y;
  
      enemy.to_player.normalise();
      enemy.to_player.scale(0.1);

      player.vel.x = 0;
      player.vel.y = 0;
      player.vel.x += enemy.to_player.x;
      player.vel.y += enemy.to_player.y;
    }
  },

  killable(enemy, world_data) {
    
    if (enemy.health <= 0 && enemy.death_sound_play == false) {
      enemy.sound_death.play();
      enemy.death_sound_play = true;
      enemy.sprite.changeAnimation("death");
      return;
    }

    else if (enemy.health <= 0)
      return;

    let player = world_data.players[0];

    enemy.to_this.x = enemy.pos.x - player.pos.x;
    enemy.to_this.y = enemy.pos.y - player.pos.y;
    enemy.to_this.normalise();

    const cond1 = vector2_dist(player.pos, enemy.pos) <= player.damage_range && player.dealing_damage;
    const cond2 = vector2_dot(player.dir, enemy.to_this) > 0;

    if (cond1 && cond2) {
      enemy.sound_injury.play();
      enemy.to_this.x = enemy.pos.x - player.pos.x;
      enemy.to_this.y = enemy.pos.y - player.pos.y;
      enemy.to_this.normalise();
      enemy.to_this.scale(player.damage);
      enemy.vel.add(enemy.to_this);
      enemy.health -= player.damage;
    }
  },
  
  melee_player(enemy, world_data) {

    if (enemy.health <= 0)
      return;

    let player = world_data.players[0];

    let dist = vector2_dist(player.pos, enemy.pos);

    const cond1 = dist <= enemy.attack_range;
    const cond2 = vector2_dot(player.dir, enemy.dir) < 0;

    if (cond1 && cond2) {
      enemy.sprite.changeAnimation("attack");

      enemy.dir.lerp(enemy.to_player, enemy.track_speed);
      enemy.dir.normalise();

      if (enemy.sprite.animations.attack.frame == 3) {
        enemy.sprite.animations.attack.frame = 0;
        enemy.sound_attack.play();

        if (player.armor > 0)
          player.armor -= enemy.damage;
        else
          player.health -= enemy.damage;
        
        if (player.hitpoints_until_nostim > 0)
          player.hitpoints_until_nostim -= enemy.damage;

        else {
          player.stimmed_up_on_ritalin = false;
          player.damage = player.DEFAULT_DAMAGE;
          player.mov_speed = player.DEFAULT_MOV_SPEED;
        }
      }
    }
  },

  shoot_player(enemy, world_data) {

    if (enemy.health <= 0)
      return;

    let player = world_data.players[0];
    let e2p_x = player.pos.x - enemy.pos.x;
    let e2p_y = player.pos.y - enemy.pos.y;
    
    let mag = sqrt(e2p_x**2 + e2p_y**2);
    
    e2p_x /= mag;
    e2p_y /= mag;
    
    let dist = vector2_dist(player.pos, enemy.pos);
    
    if (dist <= enemy.attack_range) {
      enemy.sprite.changeAnimation("attack");

      enemy.dir.lerp(enemy.to_player, enemy.track_speed);
      enemy.dir.normalise();

      if (enemy.sprite.animations.attack.frame == 3)
      {
        let map = world_data.map_handler.active_map;
        if (obstructed(player.pos.x, player.pos.y, enemy.pos.x, enemy.pos.y, map))
          return;

        enemy.sprite.animations.attack.frame = 0;
        world_data.map_handler.active_map.create_projectile(enemy.pos, 1*e2p_x, 1*e2p_y, enemy.damage);
        enemy.sound_attack.play();
      }
    }
  },

  shoot_player_shotgun(enemy, world_data) {

    if (enemy.health <= 0)
      return;
      
    let player = world_data.players[0];
    
    enemy.temp_dir1.x = player.pos.x - enemy.pos.x;
    enemy.temp_dir1.y = player.pos.y - enemy.pos.y;
    enemy.temp_dir1.normalise();

    let dist = vector2_dist(player.pos, enemy.pos);
    
    if (dist <= enemy.attack_range) {
      
      enemy.sprite.changeAnimation("attack");

      enemy.dir.lerp(enemy.to_player, enemy.track_speed);
      enemy.dir.normalise();

      if (enemy.sprite.animations.attack.frame == 3) {
        enemy.sprite.animations.attack.frame = 0;

        let map = world_data.map_handler.active_map;
        if (obstructed(player.pos.x, player.pos.y, enemy.pos.x, enemy.pos.y, map)) {
          return;
        }

        enemy.temp_dir1.rotate(-0.25);

        for (let i=0; i<10; i++) {
          world_data.map_handler.active_map.create_projectile(enemy.pos, 1*enemy.temp_dir1.x, 1*enemy.temp_dir1.y, enemy.damage);
          enemy.temp_dir1.rotate(0.05);
        }

        enemy.sound_attack.play();
      }
    }
  },

  shoot_player_shotgun_narrow(enemy, world_data) {

    if (enemy.health <= 0)
      return;
      
    let player = world_data.players[0];
    
    enemy.temp_dir1.x = player.pos.x - enemy.pos.x;
    enemy.temp_dir1.y = player.pos.y - enemy.pos.y;
    enemy.temp_dir1.normalise();

    let dist = vector2_dist(player.pos, enemy.pos);
    
    if (dist <= enemy.attack_range) {
      
      enemy.sprite.changeAnimation("attack");

      enemy.dir.lerp(enemy.to_player, enemy.track_speed);
      enemy.dir.normalise();

      if (enemy.sprite.animations.attack.frame == 3) {
        enemy.sprite.animations.attack.frame = 0;

        let map = world_data.map_handler.active_map;
        if (obstructed(player.pos.x, player.pos.y, enemy.pos.x, enemy.pos.y, map)) {
          return;
        }

        enemy.temp_dir1.rotate(-0.025);

        for (let i=0; i<5; i++) {
          world_data.map_handler.active_map.create_projectile(enemy.pos, 3*enemy.temp_dir1.x, 3*enemy.temp_dir1.y, enemy.damage);
          enemy.temp_dir1.rotate(0.01);
        }

        enemy.sound_attack.play();
      }
    }
  }

};