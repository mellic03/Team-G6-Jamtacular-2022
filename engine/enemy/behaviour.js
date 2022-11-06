const behaviour_scripts = {

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

    if (enemy.time2 - enemy.time1 > 2) {
      enemy.time1 = enemy.time2;
      let closest_dot = -1;
      
      for (let i=0; i<4; i++) {
        let dot = vector2_dot(enemy.dirs[i], enemy_to_player);
        if (dot > closest_dot) {
          closest_dot = dot;
          enemy.closest_dir.x = enemy.dirs[i].x
          enemy.closest_dir.y = enemy.dirs[i].y;
        }
      }
      enemy.closest_dir.normalise();
      enemy.dir = enemy.closest_dir;
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
      world_data.players[0].vel.add(enemy.dir.get_scaled(0.02*deltaTime));
    }

    enemy.time2 = floor((new Date()).getTime() / 1000);
  }


};