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

class EnemyHandler {
  
  constructor() {
    this._enemies = [];
  }

  /** Add an enemy to the EnemyHandler */
  add(enemy) {
    let validity = is_valid_enemy(enemy);
    if (validity == true)
      this._enemies.push(enemy);
    else
      console.log(`WARNING: enemy does not fit enemy specification\nREASON: ${validity}`);
  }

  /** Remove an enemy from the EnemyHandler */
  rem(enemy) {
    for (let i=0; i<this._enemies.length; i++)
      if (enemy == this._enemies[i])
        this._enemies.splice(i, 1);
  }

  /** Execute the preload() function of all enemies in this._enemies[] */
  preload() {
    for (let enemy of this._enemies)
      enemy.preload();
  }

  /** Execute the setup() function of all enemies in this._enemies[] */
  setup() {
    for (let enemy of this._enemies)
      enemy.setup();
  }

  /** Execute the draw() function of all enemies in this._enemies[] */
  draw() {
    for (let enemy of this._enemies)
      enemy.draw();
  }
}

/** Determine if an object fits the enemy specification
 *  described in this file.
 * @param {Object} enemy 
 * @returns {boolean | string} true if valid, error message otherwise.
 */
function is_valid_enemy(enemy) {

  if (enemy.preload == undefined)
    return `enemy.preload() is undefined.`;

  if (enemy.setup == undefined)
    return `enemy.setup() is undefined.`;

  if (enemy.draw == undefined)
    return `enemy.draw() is undefined.`;

  if (!enemy.hasOwnProperty("health"))
    return `property "health" does not exist.`;

  if (!enemy.hasOwnProperty("damage"))
    return `property "damage" does not exist.`;

  if (!enemy.hasOwnProperty("pos"))
    return `property "pos" does not exist.`;

  return true;
}