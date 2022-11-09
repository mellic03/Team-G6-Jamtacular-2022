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
      enemy.sprite.changeAnimation("death");
      return;
    }

    let player = world_data.players[0];

    enemy.to_player.x = player.pos.x - enemy.pos.x;
    enemy.to_player.y = player.pos.y - enemy.pos.y;

    enemy.to_player.normalise();
    enemy.to_player.scale(0.1);

    enemy.to_this.x = enemy.pos.x - player.pos.x;
    enemy.to_this.y = enemy.pos.y - player.pos.y;


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


    if (dist <= enemy.push_range) {
      player.vel.x = 0;
      player.vel.y = 0;
      player.vel.x += enemy.to_player.x;
      player.vel.y += enemy.to_player.y;
    }

    if (dist <= enemy.attack_range) {
      enemy.sprite.changeAnimation("attack");
      return;
    }

    else if (dist <= enemy.chase_range) {
      enemy.dir.lerp(enemy.to_this, 0.01);
      enemy.dir.normalise();
    }

    else if (dist <= enemy.follow_range) {
      
      if (enemy.player_delta_dist < 0.1) {

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

    movement_x = enemy.dir.x;
    movement_y = enemy.dir.y;

    mag = sqrt(movement_x**2 + movement_y**2);
    movement_x = (mag != 0) ? movement_x/mag : 0;
    movement_y = (mag != 0) ? movement_y/mag : 0;

    movement_x *= enemy.speed;
    movement_y *= enemy.speed;

    enemy.pos.x += movement_x * 0.01 * deltaTime;
    enemy.pos.y += movement_y * 0.01 * deltaTime;

  },

  killable(enemy, world_data) {
    
    if (enemy.health <= 0 && enemy.death_sound_play == false) {
      enemy.sound_death.play();
      enemy.death_sound_play = true;
      return;
    }

    let player = world_data.players[0];

    if (vector2_dist(player.pos, enemy.pos) < 2*enemy.push_range && player.dealing_damage) {
      enemy.to_this.x = enemy.pos.x - player.pos.x;
      enemy.to_this.y = enemy.pos.y - player.pos.y;
      enemy.to_this.normalise();
      enemy.to_this.scale(player.damage);
      enemy.vel.add(enemy.to_this);
      enemy.health -= player.damage;
    }
  },
  
  melee_player(enemy, world_data) {
    let player = world_data.players[0];
    let e2p_x = player.pos.x - enemy.pos.x;
    let e2p_y = player.pos.y - enemy.pos.y;
  
    let mag = sqrt(e2p_x**2 + e2p_y**2);
     
    e2p_x /= mag;
    e2p_y /= mag;

    let dist = vector2_dist(player.pos, enemy.pos);

    if (dist <= enemy.attack_range) {

      if (enemy.sprite.animations.attack.frame == 3) {
        enemy.sprite.animations.attack.frame = 0;
        if (player.armor > 0)
          player.armor -= enemy.damage;
        else
          player.health -= enemy.damage;
        player.stimmed_up_on_ritalin = false;
        player.damage = 10;
      }
    }
  },

  shoot_player(enemy, world_data) {
    let player = world_data.players[0];
    let e2p_x = player.pos.x - enemy.pos.x;
    let e2p_y = player.pos.y - enemy.pos.y;
  
    let mag = sqrt(e2p_x**2 + e2p_y**2);
     
    e2p_x /= mag;
    e2p_y /= mag;

    let dist = vector2_dist(player.pos, enemy.pos);

    if (dist <= enemy.attack_range) {

      if (enemy.sprite.animations.attack.frame == 3) {
        enemy.sprite.animations.attack.frame = 0;
        world_data.map_handler.active_map.create_projectile(enemy.pos, 0.5*e2p_x, 0.5*e2p_y);
      }
    }
  }

};