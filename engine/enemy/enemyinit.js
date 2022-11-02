
function enemy_init() {

  let enemy_handler = new EnemyHandler();
  
  let zombie1 = new Zombie(160, 60, "engine/enemy/zombie");
  let zombie2 = new Zombie(200, 60, "engine/enemy/zombie");
  
  enemy_handler.add(zombie1);
  // enemy_handler.add(zombie2);

  return enemy_handler;
}