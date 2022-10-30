/*
  The player specification detailed here is subject to change.

  //--------------------------------------
  For a class to conform to the "player" standard,
  the following methods must be defined:
  
  - preload(void): void
  - setup(void): void
  - draw(void): void
 

  along with the following properties:

  - health: number
  - damage: number
  - pos: Vector2
  - vel: Vector2
  - dir: Vector2
  //--------------------------------------
*/

class PlayerHandler {
  
  constructor() {
    this._players = [];
  }

  /** Add a player to the PlayerHandler */
  add(player) {
    let validity = is_valid_player(player);
    if (validity == true)
      this._players.push(player);
    else {
      console.log(`%cERROR: player does not fit player specification\n`, "color: red;");
      for (let reason of validity)
        console.log(`REASON: ${reason}`);
    }
  }

  /** Remove a player from the PlayerHandler */
  remove(player) {
    for (let i=0; i<this._players.length; i++)
      if (player == this._players[i])
        this._players.splice(i, 1);
  }

  /** Execute the preload() function of all players in this._players[] */
  preload() {
    for (let player of this._players)
      player.preload();
  }

  /** Execute the setup() function of all players in this._players[] */
  setup() {
    for (let player of this._players)
      player.setup();
  }

  /** Execute the draw() function of all players in this._players[] */
  draw(world_data) {
    if (world_data == undefined || !world_data.hasOwnProperty("maps") || !world_data.hasOwnProperty("enemies")) {
      console.log(`%cERROR: world_data does not fit specification`, "color: red;");
      return;
    }
    for (let player of this._players)
      player.draw(world_data);
  }
}

/** Determine if an object fits the player specification
 *  described in this file.
 * @param {Object} player 
 * @returns {boolean | string} true if valid, error message otherwise.
 */
 function is_valid_player(player) {

  let errors = [];

  if (player.preload == undefined)
    errors.push(`player.preload() is undefined.`);

  if (player.setup == undefined)
    errors.push(`player.setup() is undefined.`);

  if (player.draw == undefined)
    errors.push(`player.draw() is undefined.`);

  if (!player.hasOwnProperty("health"))
    errors.push(`property "health" does not exist.`);

  if (!player.hasOwnProperty("damage"))
    errors.push(`property "damage" does not exist.`);

  if (!player.hasOwnProperty("pos"))
    errors.push(`property "pos" does not exist.`);

  if (!player.hasOwnProperty("vel"))
    errors.push(`property "vel" does not exist.`);

  if (!player.hasOwnProperty("dir"))
    errors.push(`property "dir" does not exist.`);

  return (errors.length == 0) ? true : errors;
}