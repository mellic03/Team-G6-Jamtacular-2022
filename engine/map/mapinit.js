function map_init() {

  let map_handler = new MapHandler();

  let m1 = new Map("m1", "engine/map/m1/m1.txt");
  map_handler.add(m1);
  map_handler.active_map = m1;

  return map_handler;
}