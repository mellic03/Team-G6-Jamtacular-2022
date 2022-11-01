class MapHandler {
  
  active_map;

  constructor() {
    this._maps = [];
  }

  set_active_map(map_name) {
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

  remove() {

  }

  
  preload() {
    for (let map of this._maps) {
      map.preload();
    }
  }

  setup() {
    for (let map of this._maps) {
      map.setup();
    }
  }

  draw() {
    for (let map of this._maps) {
      map.draw();
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

  return (errors.length == 0) ? true : errors;
}