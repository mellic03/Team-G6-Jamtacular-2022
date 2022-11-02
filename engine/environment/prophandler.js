


class PropHandler {

  constructor() {
    this._props = [];
  }

  add(prop) {
    let validity = is_valid_prop(prop);

    if (validity == true) {
      this._props.push(prop);
    }
  
    else {
      console.log(`%cERROR: prop does not fit prop specification`, "color: red;");
      for (let reason of validity)
        console.log(`REASON: ${reason}`);
    }

  }


  remove(sub) {
    
  }

  preload() {
    for (let prop of this._props) {
      prop.preload();
    }
  }

  setup() {
    for (let prop of this._props) {
      prop.setup();
    }
  }

  draw() {
    for (let prop of this._props) {
      prop.draw();
    }
  }

}

/** Determine if an object fits the enemy specification
 *  described in this file.
 * @param {Object} enemy 
 * @returns {boolean | string} true if valid, error message otherwise.
 */
 function is_valid_prop(prop) {

  let errors = [];

  if (prop.preload == undefined)
    errors.push(`prop.preload() is undefined.`);

  if (prop.setup == undefined)
    errors.push(`prop.setup() is undefined.`);

  if (prop.draw == undefined)
    errors.push(`prop.draw() is undefined.`);

  if (!prop.hasOwnProperty("pos"))
    errors.push(`property "pos" does not exist.`);

  return (errors.length == 0) ? true : errors;
}