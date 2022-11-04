function map_init() {

  let map_handler = new MapHandler();

  let m1 = new Map("map1", "engine/map/map1.txt");
  map_handler.add(m1);
  map_handler.active_map = m1;

  return map_handler;
}