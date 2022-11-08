# Using the Map Editor

## Creating a Map
- Clicking on and keeping the mouse over the "RGB", "PROP", "PICKUP" or "ENEMY" buttons allows the user to type the name of an entity into that field (e.g. "255,255,255" or "pillar"). With one of these selected, left-clicking the mouse can be used to place these entities on the map. Read through /engine/map/entities.json to view which entities exist and are placeable.

- Clicking on the entrance/exit buttons allows the user to place map entrance/exit points.

- Right clicking erases blocks.

## Importing Files
### Command-line (Windows & UNIX)
```bash
./mapedit [FILE]
```
Where [FILE] is the filepath to a map file. If supplied, the map file will be imported into the map editor.

### GUI (Windows)
On Windows, map files can be dragged onto the mapedit executable to import them into the editor.

&nbsp;

# Creating New Entities for the Map Editor

## Creating a New Enemy
1. Create a directory named after the enemy in /engine/enemy with a subdirectory named spritesheets
    > /engine/enemy/example_enemy/spritesheets
2. Populate the spritesheets directory with the following spritesheets
    - walkback-sheet.png
    - walkbackangle-sheet.png
    - walkfront-sheet.png
    - walkfrontangle-sheet.png
    - walkside-sheet.png
    - attack-sheet.png
    - death-sheet.png

3. Create a new entry in /engine/map/entities.json
    ```json
    "example_enemy": {
      "directory": "engine/enemy/example_enemy",
      "behaviour_scripts": ["follow_player"],
      "height": 0.2,
      "vertical_offset": 6000,
      "health": 100,
      "damage": 10,
      "speed": 2
    }
    ```
4. The new enemy can now be placed in the map editor by typing the enemy name in the "enemy" field

## Enemy Behaviour Scripts
Scripts can be assigned to an enemy by adding the name of the script to the behaviour_scripts array of the enemy in entities.json. Behaviour scripts are defined in /engine/enemy/behaviour.js as properties of the behaviour_scripts object.

- Example behaviour script:
    ```JavaScript
    const behaviour_scripts = {

      follow_player(enemy, world_data) {
        let dir = vector2_sub(world_data.player.pos, enemy.pos);
        dir.normalise();
        enemy.pos.add(dir);
      }

    }
    ```
- Behaviour scripts must take the enemy as the first parameter and world_data as the second.
- Multiple scripts can be added to the entities behaviour_scripts array.
- Each script will be executed once per frame.

&nbsp;

## Creating a New Static Prop
1. Create a directory named after the prop in /engine/prop populated with a single spritesheet
    > /engine/prop/example_prop/

3. Create a new entry in /engine/map/entities.json
    ```json
    "example_prop": {
      "directory": "engine/prop/example_prop",
      "frames": 1,
      "collision_radius": 1,
      "height": 0.2,
      "vertical_offset": 6000,
    }
    ```
4. The new prop can now be placed in the map editor by typing the prop name in the "prop" field

&nbsp;

## Creating a New Directional Prop
1. Create a directory named after the prop in /engine/prop populated with the following spritesheets:
    - front.png
    - frontangle.png
    - side.png
    - backangle.png
    - back.png

3. Create a new entry in /engine/map/entities.json
    ```json
    "example_prop": {
      "directory": "engine/prop/example_prop",
      "frames": 1,
      "collision_radius": 1,
      "height": 0.2,
      "vertical_offset": 6000,
    }
    ```
4. The new prop can now be placed in the map editor by typing the prop name in the "prop" field with the direction the prop should be facing separated by a colon:
    > example_prop:north

&nbsp;

## Creating a New Pickup
1. Create a directory named after the pickup in /engine/pickup populated with a single spritesheet:
    > engine/pickup/health/health.png

3. Create a new entry in /engine/map/entities.json
    ```json
    "health": {
      "directory": "engine/pickup/health",
      "attribute": "health",
      "amount": 10,
      "height": 0.2,
      "vertical_offset": 3500
    },
    ```
4. The new pickup can now be placed in the map editor by typing the pickup name in the "pickup" field.

&nbsp;

# Planning For The Future

## TODO
- [ ] Pickups -cocaine, ritalin?
- [x] Chad looks left or right with player rotation
- [ ] More props, enemy sprites
- [x] Enemy behaviour scripting
- [ ] Boss, bosses?
- [ ] Weapons -shiv, needle?
- [ ] Gameplay loop
    - [ ] Combat
    - [ ] Dying
    - [x] enemy death
- [x] Map transitions
