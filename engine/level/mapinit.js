function map_init() {

  let map_handler = new MapHandler();

  let m1 = new Map("engine/level/levels/map1.obj");



  map_handler.add(m1);


  return map_handler;

}