let lvl1_enemy;

function enemy_init() {

  let enemy_handler = new EnemyHandler();
  
  lvl1_enemy = new Enemy(-600, -100);
  enemy_handler.add(lvl1_enemy);

  return enemy_handler;
}