const behaviour_scripts = {

  follow_player(enemy, world_data) {
    let player = world_data.players[0];

    let dir = vector2_sub(player.pos, enemy.pos);
    dir.normalise();
    enemy.pos.add(dir);
  }

};