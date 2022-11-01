

class Map {

  filepath;

  width;
  data = [];
 
  
  constructor(filepath) {
    this.filepath = filepath;
  }

  preload() {
    loadImage(this.filepath, (image) => {
      image.loadPixels();
      this.width = image.width;
      for (let i=0; i<image.pixels.length; i+=1) {
        this.data[i] = image.pixels[i];//>0 ? 1 : 0;
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