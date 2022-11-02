
function enemy_init() {

  let enemy_handler = new EnemyHandler();
  
  let zombie = new Zombie(160, 60, "engine/enemy/zombie");

  enemy_handler.add(zombie);

  return enemy_handler;
}