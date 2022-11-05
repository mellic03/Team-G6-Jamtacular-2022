
class Map {
  
  name;
  filepath;

  props = [];
  pickups = [];
  enemies = [];

  player;

  width = 25;
  tilemap = [];   // Raycasting and collisions against walls, 1/4 size of colourmap
  colourmap = []; // coloured rendering

  constructor(name, filepath) {
    this.name = name;
    this.filepath = filepath;
  }

  /** Load map data from file, construct JavaScript objects with entity data
   */
  preload() {

    let entity_data = loadJSON("engine/map/entities.json");

    loadStrings(this.filepath, (file) => {

      for (let i=0; i<25*25; i++) {

        let tokens = splitTokens(file[i], " ");

        if (tokens[0] != "WALL:") {
          this.tilemap[i] = 0;
          this.colourmap[i] = [0, 0, 0, 0];
        }

        if (tokens[0] == "WALL:") {
          this.tilemap[i] = 1;
          let color = splitTokens(tokens[1], ",");
          this.colourmap[i] = [+color[0], +color[1], +color[2], 255];
        }

        else if (tokens[0] == "SPAWN") {
          this.player = new Player((i%25)*25 + 12.5, floor(i/25)*25 + 12.5);
          this.player.preload();
          player_handler.add(this.player);
        }

        else if (tokens[0] == "PROP:") {
          let prop_name = tokens[1];
          let obj = entity_data.static_props[prop_name];
          let prop = new Prop((i%25)*25 + 12.5, floor(i/25)*25 + 12.5, obj.directory);
          prop.height = obj.height;
          prop.voffset = obj.vertical_offset;
          this.props.push(prop);
        }

        else if (tokens[0] == "PICKUP:") {
          let pickup_name = tokens[1];
        }

        else if (tokens[0] == "ENEMY:") {
          let enemy_name = tokens[1];
          let obj = entity_data.enemies[enemy_name];
          let enemy = new EnemyType_1((i%25)*25 + 12.5, floor(i/25)*25 + 12.5, obj.directory);
          enemy.height = obj.height;
          enemy.voffset = obj.vertical_offset;
          this.enemies.push(enemy);
        }
      }

      for (let enemy of this.enemies) {
        enemy.preload();
      }
      for (let prop of this.props) {
        prop.preload();
      }
    });
  }

  setup() {
    for (let enemy of this.enemies) {
      enemy.setup();
    }
    for (let prop of this.props) {
      prop.setup();
    }
  }

  draw(world_data) {
    for (let enemy of this.enemies) {
      enemy.draw(world_data);
    }
    for (let prop of this.props) {
      prop.draw();
    }
  }


  point_in_grid(pos) {

    let xprime = Math.floor(pos.x/this.width);
    let yprime = Math.floor(pos.y/this.width);
  
    if (this.tilemap[this.width*yprime + xprime] ==1) {
      return true
    }
  
    return false;
  }
  


}