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
Where [FILE] is the filepath to a .map file. If supplied, the .map file will be imported into the map editor.

### GUI (Windows)
On Windows, .map files can be dragged onto the mapedit executable to import them into the editor.

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
    - attackfront-sheet.png

3. Create a new entry in /engine/map/entities.json
    ```json
    "example_enemy": {
      "directory": "engine/enemy/example_enemy",
      "height": 0.2,
      "vertical_offset": 6000,
      "health": 100,
      "damage": 10,
      "speed": 2
    }
    ```
4. The new enemy can now be placed in the map editor by typing the enemy name in the "enemy" field


&nbsp;

# Planning For The Future

## TODO
- Cocaine
- Chad looks left or right with player rotation
- More props, enemy sprites
- Enemy behaviour scripting
- Boss
- Weapons -shiv, needle?
