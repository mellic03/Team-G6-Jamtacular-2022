const SCREEN_WIDTH = 1000;
const SCREEN_HEIGHT = 1000;

const GRAV_CONSTANT = 0.3;

const keycodes = {
  
  LEFT: 37, RIGHT: 39,
  UP: 38, DOWN: 40,
  SPACE: 32,

  A: 65, B: 66, C: 67, D: 68,
  E: 69, F: 70, G: 71, H: 72,
  I: 73, J: 74, K: 75, L: 76,
  M: 77, N: 78, O: 79, P: 80,
  Q: 81, R: 82, S: 83, T: 84,
  U: 85, V: 86, W: 87, X: 88,
  Y: 89, Z: 90,
};

function copy_image(src) {
  
  let width = src.width;
  let height = src.height;
  let new_image = createImage(width, height);
  
  let row = 4*width;

  src.loadPixels();
  new_image.loadPixels();
  for (let i=0; i<src.pixels.length; i++) {
    new_image.pixels[i] = src.pixels[i];
  }
  new_image.updatePixels();

  return new_image;
}