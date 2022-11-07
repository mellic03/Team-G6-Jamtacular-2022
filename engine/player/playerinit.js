function player_init(map_handler) {
  
  let player_handler = new PlayerHandler();
  player_handler.add(new Player(0, 0));

  return player_handler;
}