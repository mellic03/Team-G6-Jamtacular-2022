let lvl1_enemy;

function enemy_init() {

  let enemy_handler = new EnemyHandler();
  
  lvl1_enemy = new Enemy(0, 0);
  enemy_handler.add(lvl1_enemy);

  return enemy_handler;
}