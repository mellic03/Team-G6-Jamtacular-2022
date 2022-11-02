class UIHandler {

  constructor() {
    this._ui_objects = [];
  }

  add(ui_object) {
    this._ui_objects.push(ui_object);
  }

  preload() {
    for (let ui_object of this._ui_objects) {
      ui_object.preload();
    }
  }

  setup() {
    for (let ui_object of this._ui_objects) {
      ui_object.setup();
    }
  }

  draw(world_data) {
    for (let ui_object of this._ui_objects) {
      ui_object.draw(world_data);
    }
  }

}