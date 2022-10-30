/*
  The enemy specification detailed here is subject to change.

  //--------------------------------------
  For a class to conform to the "enemy" standard,
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
    else
      console.log(`WARNING: player does not fit player specification\nREASON: ${validity}`);
  }

  /** Remove a player from the PlayerHandler */
  rem(player) {
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
  draw() {
    for (let player of this._players)
      player.draw();
  }
}

function is_valid_player(player) {
  if (0)
    return `0 == 1`;
  
  return true;
}