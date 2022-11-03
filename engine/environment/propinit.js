function prop_init(map_handler) {

  let prop_handler = new PropHandler();

  let stool = new Prop("engine/environment/stool");
  stool.pos.x = 250;
  stool.pos.y = 60;

  prop_handler.add(stool);

  return prop_handler;
}