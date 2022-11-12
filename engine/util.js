let scr_wdth = 800;
let scr_hght = 800;

let game_paused = true;
let pistol_pickup;
let cyberdemon;
let enemies_killed = 0;

const keycodes = {
  
  LEFT: 37, RIGHT: 39,
  UP: 38, DOWN: 40,
  SPACE: 32,
  ESC: 27, TAB: 9,

  A: 65, B: 66, C: 67, D: 68,
  E: 69, F: 70, G: 71, H: 72,
  I: 73, J: 74, K: 75, L: 76,
  M: 77, N: 78, O: 79, P: 80,
  Q: 81, R: 82, S: 83, T: 84,
  U: 85, V: 86, W: 87, X: 88,
  Y: 89, Z: 90,
};

function MIN(value1, value2) {
  return value1 < value2 ? value1 : value2;
}

function MAX(value1, value2) {
  return value1 > value2 ? value1 : value2;
}

function clamp(value, min, max) {
  return MIN(MAX(value, min), max);
}

let ray;

/** Determine if two points have clear line-of-sight
 */
function obstructed(x1, y1, x2, y2, map) {

  if (ray == undefined)
    ray =  new Vector2(0, 0);

  let dist = sqrt((x1-x2)**2 + (y1-y2)**2);

  let dir_x = x2 - x1;
  let dir_y = y2 - y1;
  let mag = sqrt(dir_x**2 + dir_y**2);

  dir_x /= mag;
  dir_y /= mag;

  ray.x = dir_x;
  ray.y = dir_y;

  const resolution = 2;
  let steps = 1;

  while (ray.mag() < dist) {
    ray.normalise();
    ray.scale(steps);

    if (map.point_in_grid(x1 + ray.x, y1 + ray.y))
      return true;

    steps += resolution;
  }

  return false;
}