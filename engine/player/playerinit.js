function player_init(map_handler) {
  
  let player_handler = new PlayerHandler();

  let player = new Player(-400, 100);

  player_handler.add(player);


  

  return player_handler;
}