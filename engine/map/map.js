
class Map {
  
  name;
  filepath;

  props = [];
  pickups = [];
  enemies = [];

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

        else if (tokens[0] == "PROP:") {
          let prop_name = tokens[1];

        }

        else if (tokens[0] == "PICKUP:") {
          let pickup_name = tokens[1];

        }

        else if (tokens[0] == "ENEMY:") {
          let enemy_name = tokens[1];
          let enemy = entity_data.enemies[enemy_name];
          enemy.x = floor(i/25) * 25;
          enemy.y = i%25 * 25;
          this.enemies.push(entity_data.enemies[enemy_name]);
        }
      }
      console.log(this.enemies);

    });

    // loadImage(this.filepath, (image) => {
    //   image.loadPixels();
    //   this.width = image.width;
    //   for (let i=0; i<image.pixels.length; i+=4) {
    //     this.tilemap[i/4] = image.pixels[i] | image.pixels[i+1] | image.pixels[i+2];
    //   }
    //   for (let i=0; i<image.pixels.length; i+=1) {
    //     this.colourmap[i] = image.pixels[i];
    //   }
    // });
  }

  setup() {

  }

  draw() {
  
  }

}