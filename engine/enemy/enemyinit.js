let lvl1_enemy = [];

function enemy_init() {

  let enemy_handler = new EnemyHandler();
  
  lvl1_enemy[0] = new Enemy(-600, 100);
  enemy_handler.add(lvl1_enemy[0]);

  lvl1_enemy[1] = new Enemy(150, 330);
  enemy_handler.add(lvl1_enemy[1]);


  return enemy_handler;
}