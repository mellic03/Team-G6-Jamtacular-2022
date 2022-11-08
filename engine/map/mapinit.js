function map_init() {

  let map_handler = new MapHandler();

  let m1 = new Map("m1", "engine/map/maps/m2.txt");
  map_handler.add(m1);
  
  map_handler.add(new Map("m2", "engine/map/maps/m2.txt"));
  map_handler.add(new Map("m3", "engine/map/maps/m3.txt"));
  map_handler.add(new Map("m4", "engine/map/maps/m4.txt"));
  // map_handler.add(new Map("m5", "engine/map/maps/m5.txt"));


  map_handler.active_map = m1;
  return map_handler;
}