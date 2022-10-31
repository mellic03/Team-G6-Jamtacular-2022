class Vector2 {
  x; y;
  
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  add(v2) {
    this.x += v2.x, this.y += v2.y;
  }

  sub(v2) {
    this.x -= v2.x, this.y -= v2.y;
  }

  scale(alpha) {
    this.x *= alpha, this.y *= alpha;
  }

  translate(x, y, z) {
    this.x += x, this.y += y, this.z += z;
  }

  dot(v2) {
    return this.x*v2.x + this.y*v2.y;
  }

  mag() {
    return Math.sqrt(this.x**2 + this.y**2);
  }

  normalise() {
    let mag = this.mag();
    this.x /= mag;
    this.y /= mag;
  }

  get_normalised() {
    let mag = this.mag();
    return new Vector2(this.x/mag, this.y/mag);
  }
  
  rotate(theta) {
    let mag = this.mag();
    let x = this.x, y = this.y;
    this.x = x*Math.cos(theta) - y*Math.sin(theta);
    this.y = x*Math.sin(theta) + y*Math.cos(theta);
    this.normalise();
    this.scale(mag);
  }

  get_rotated(theta) {
    let mag = this.mag();
    let x = this.x;
    let y = this.y;
    let new_vec = new Vector2(
      x*Math.cos(theta) - y*Math.sin(theta),
      x*Math.sin(theta) + y*Math.cos(theta)
    );
    new_vec.normalise();
    new_vec.scale(mag);
    return new_vec;
  }

  copy() {
    let new_vec = new Vector2(this.x, this.y);
    return new_vec;
  }


  lerp(v2, alpha) {
    let dir = vector2_sub(this, v2);
    dir.normalise();
    dir.scale(alpha);
    this.add(dir);
  }

  get_lerped(v2, alpha) {
    let dir = vector2_sub(this, v2);
    dir.normalise();
    dir.scale(alpha);
    return new Vector2(this.x + dir.x, this.y + dir.y);
  }

}

function vector2_sub(v0, v1) {
  return new Vector2(v0.x-v1.x, v0.y-v1.y);
}

function vector2_dist(v0, v1) {
  return Math.sqrt((v0.x-v1.x)*(v0.x-v1.x) + (v0.y-v1.y)*(v0.y-v1.y));
}

function vector2_mag(v0) {
  return Math.sqrt(v0.x*v0.x + v0.y*v0.y);
}

function vector2_normalise(v0)
{
  let mag = vector2_mag(v0);
  v0.x /= mag;
  v0.y /= mag;
}

function vector2_dot(v0, v1) {
  return v0.x*v1.x + v0.y*v1.y;
}

function vector2_angle(v0, v1) {
  // console.log(vector2_dot(v0, v1))
  return Math.acos(vector2_dot(v0, v1)/(v0.mag()*v1.mag()));
}

function point_plane_dist(plane_normal, plane_pos, point_pos) {
  return vector2_dot(plane_normal, vector2_sub(point_pos, plane_pos));
}
