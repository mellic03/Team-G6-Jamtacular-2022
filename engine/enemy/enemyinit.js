let lvl1_enemy;

function enemy_init() {

  let enemy_handler = new EnemyHandler();
  lvl1_enemy = new Enemy();

  return enemy_handler;
}