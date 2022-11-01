
class Map {

  filepath;

  width;
  tilemap = [];
  colourmap = [];

  constructor(filepath) {
    this.filepath = filepath;
  }

  preload() {
    loadImage(this.filepath, (image) => {
      image.loadPixels();
      this.width = image.width;
      for (let i=0; i<image.pixels.length; i+=4) {
        this.tilemap[i] = image.pixels[i] | image.pixels[i+1] | image.pixels[i+2];
      }
      for (let i=0; i<image.pixels.length; i+=1) {
        this.colourmap[i] = image.pixels[i];
      }
      console.log(image);
    });
  }

  setup() {

  }

  draw() {
    // let ratio = this.width / RES_X;
    // let rect_size = 1/ratio;

    // for (let i=0; i<this.width; i++)
    //   for (let j=0; j<this.width; j++)
    //     if (map1.data[this.width*j + i] == 1)
    //       rect(i/ratio, j/ratio, rect_size, rect_size);
  }

}