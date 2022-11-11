class MapHandler {
  
  map_number = 1;
  active_map;

  transitioning = true;

  assets = {};

  constructor() {
    this._maps = [];
  }

  set_active_map(map_name, player) {
    for (let map of this._maps) {
      if (map.name == map_name) {
        this.active_map = map;
        player.pos.x = map.spawn_x;
        player.pos.y = map.spawn_y;
        this.transitioning = true;
      }
    }
  }

  add(map) {
    
    let validity = is_valid_map(map);

    if (validity == true) {
      this._maps.push(map);
    }

    else {
      console.log(`%cERROR: map does not fit map specification\n`, "color: red;");
      for (let reason of validity)
        console.log(`REASON: ${reason}`);
    }
  }

  
  preload() {
    for (let map of this._maps) {
      map.preload();
    }

    loadImage("engine/prop/projectile/projectile.png", (img) => {
      this.assets.projectile_img = img;
    });

  }

  setup(player_handler) {
    for (let map of this._maps) {
      map.setup();
    }
    player_handler._players[0].pos.x = this.active_map.spawn_x;
    player_handler._players[0].pos.y = this.active_map.spawn_y;

    player_handler._players[0].set_dir(this.active_map.spawn_dir_x, this.active_map.spawn_dir_y);
  }

  draw(world_data) {
    let player = world_data.players[0];
    this.active_map.draw(world_data);
    // if player.pos is on top of exit, load next map

    for (let i=0; i<this.active_map.exit_xs.length; i++) {
      if (floor(player.pos.x/25) == floor(this.active_map.exit_xs[i]/25) && floor(player.pos.y/25) == floor(this.active_map.exit_ys[i]/25)) {
        this.set_active_map(this.active_map.exit_mapnames[i], player);
      }
    }

    if (floor(player.pos.x/25) == floor(this.active_map.exit_x/25) && floor(player.pos.y/25) == floor(this.active_map.exit_y/25)) {
      this.map_number += 1;
      this.set_active_map("m" + this.map_number, player);
    }
  }

}

/** Determine if an object fits the player specification
 *  described in this file.
 * @param {Object} map 
 * @returns {boolean | string} true if valid, error message otherwise.
 */
function is_valid_map(map) {

  let errors = [];

  if (map.preload == undefined)
    errors.push(`map.preload() is undefined.`);

  if (map.setup == undefined)
    errors.push(`map.setup() is undefined.`);

  if (map.draw == undefined)
    errors.push(`map.draw() is undefined.`);

  if (!map.hasOwnProperty("name"))
    errors.push(`property "name" does not exist.`);

  return (errors.length == 0) ? true : errors;
}
