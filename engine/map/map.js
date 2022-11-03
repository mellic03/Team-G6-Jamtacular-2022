
class Map {

  name;

  filepath;

  width;
  tilemap = [];   // Raycasting and collisions against walls, 1/4 size of colourmap
  colourmap = []; // coloured rendering

  constructor(name, filepath) {
    this.name = name;
    this.filepath = filepath;
  }

  preload() {
    loadImage(this.filepath, (image) => {
      image.loadPixels();
      this.width = image.width;
      for (let i=0; i<image.pixels.length; i+=4) {
        this.tilemap[i/4] = image.pixels[i] | image.pixels[i+1] | image.pixels[i+2];
      }
      for (let i=0; i<image.pixels.length; i+=1) {
        this.colourmap[i] = image.pixels[i];
      }
    });
  }

  setup() {

  }

  draw() {
  
  }

}