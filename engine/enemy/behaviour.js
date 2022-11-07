const behaviour_scripts = {

  use_velocity(enemy) {
    enemy.vel.scale(0.95);
    enemy.pos.x += enemy.vel.x * 0.01 * deltaTime;
    enemy.pos.y += enemy.vel.y * 0.01 * deltaTime;
  },

  follow_player(enemy, world_data) {
    let player = world_data.players[0];

    let dir = vector2_sub(player.pos, enemy.pos);
    dir.normalise();
    enemy.pos.add(dir);
  },

  follow_player_zigzag(enemy, world_data) {

    let player = world_data.players[0];

    let dist = vector2_dist(player.pos, enemy.pos);

    let enemy_to_player = vector2_sub(player.pos, enemy.pos);
    enemy_to_player.normalise();
    let player_to_enemy = vector2_sub(enemy.pos, player.pos);

    // Move towards the player at the nearest 45 degree angle,
    // keep track of delta_dist, if delta_dist becomes negative, 
    // recalculate nearest 45 degree angle

    // circle(enemy.pos.x, enemy.pos.y, 10);

    // stroke(0, 255, 0);
    // line(enemy.pos.x, enemy.pos.y, enemy.pos.x+enemy.dir.x*40, enemy.pos.y+enemy.dir.y*40);

    // stroke(0, 0, 255);
    // line(enemy.pos.x, enemy.pos.y, enemy.pos.x+enemy.dirs[0].x*20, enemy.pos.y+enemy.dirs[0].y*20);
    // line(enemy.pos.x, enemy.pos.y, enemy.pos.x+enemy.dirs[1].x*20, enemy.pos.y+enemy.dirs[1].y*20);
    // line(enemy.pos.x, enemy.pos.y, enemy.pos.x+enemy.dirs[2].x*20, enemy.pos.y+enemy.dirs[2].y*20);
    // line(enemy.pos.x, enemy.pos.y, enemy.pos.x+enemy.dirs[3].x*20, enemy.pos.y+enemy.dirs[3].y*20);

    // stroke(0, 0, 0);
    // line(enemy.pos.x, enemy.pos.y, enemy.pos.x+enemy_to_player.x*30, enemy.pos.y+enemy_to_player.y*30);

    // fill(0, 255, 0);
    // circle(player.pos.x, player.pos.y, 10);

    if (enemy.player_delta_dist < 0.005*deltaTime) {
      let closest_dot = -1;
      
      for (let i=0; i<4; i++) {
        let dot = vector2_dot(enemy.dirs[i], enemy_to_player);
        if (dot > closest_dot) {
          closest_dot = dot;
          enemy.dir.x = enemy.dirs[i].x
          enemy.dir.y = enemy.dirs[i].y;
        }
      }
    }

    if (dist > 50) {
      if (world_data.active_map.point_in_grid(vector2_add(enemy.pos, enemy.dir.get_scaled(4))) == false)
        enemy.pos.add(enemy.dir.get_scaled(0.02*deltaTime));
      
      else {
        enemy.dir.rotate(0.78);
        enemy.pos.add(enemy.dir.get_scaled(2));
        enemy.time1 = enemy.time2 + 3
      }
    }

    else if (dist > 20) {
      enemy.dir.lerp(player_to_enemy, 0.005*deltaTime);
      enemy.dir.normalise();
      enemy.pos.add(enemy.dir.get_scaled(0.02*deltaTime));
    }

    else {
      enemy.dir.lerp(player_to_enemy, 0.005*deltaTime);
      enemy.dir.normalise();
      enemy.sprite.changeAnimation("attack");
    }

    if (dist < 7) {
      player.vel.add(enemy.dir.get_scaled(0.2));
    }

    enemy.player_delta_dist = abs(dist - enemy.player_last_dist);
    enemy.player_last_dist = dist;

    enemy.time2 = floor((new Date()).getTime() / 1000);
  },

  player_damage_enemy(enemy, world_data) {
    
    let player = world_data.players[0];

    if (vector2_dist(player.pos, enemy.pos) < 15 && keyIsDown(keycodes.SPACE)) {
      let dir = vector2_sub(enemy.pos, player.pos);
      dir.scale(1);
      enemy.vel.add(dir);
    }

  }
  

};