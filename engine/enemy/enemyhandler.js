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
    
    else {
      console.log(`%cERROR: enemy does not fit enemy specification`, "color: red;");
      for (let reason of validity)
        console.log(`REASON: ${reason}`);
    }
  }

  /** Remove an enemy from the EnemyHandler */
  remove(enemy) {
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
  draw(world_data) {
    for (let enemy of this._enemies)
      enemy.draw(world_data);
  }
}

/** Determine if an object fits the enemy specification
 *  described in this file.
 * @param {Object} enemy 
 * @returns {boolean | string} true if valid, error message otherwise.
 */
function is_valid_enemy(enemy) {

  let errors = [];

  if (enemy.preload == undefined)
    errors.push(`enemy.preload() is undefined.`);

  if (enemy.setup == undefined)
    errors.push(`enemy.setup() is undefined.`);

  if (enemy.draw == undefined)
    errors.push(`enemy.draw() is undefined.`);

  if (!enemy.hasOwnProperty("health"))
    errors.push(`property "health" does not exist.`);

  if (!enemy.hasOwnProperty("damage"))
    errors.push(`property "damage" does not exist.`);

  if (!enemy.hasOwnProperty("pos"))
    errors.push(`property "pos" does not exist.`);

  return (errors.length == 0) ? true : errors;
}