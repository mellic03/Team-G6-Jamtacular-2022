
function MIN(a, b) {
  return a<b ? a : b;
}

function MAX(a, b) {
  return a>b ? a : b;
}

class Edge {
  
  p1 = new Vector2();
  p2 = new Vector2();

  face_normal = new Vector2();

  draw() {
    line(this.p1.x, this.p1.y, this.p2.x, this.p2.y);
  }

  draw_normals() {
    line((this.p1.x+this.p2.x)/2, (this.p1.y+this.p2.y)/2, (this.p1.x+this.p2.x)/2+ 10*this.face_normal.x, (this.p1.y+this.p2.y)/2 + 10*this.face_normal.y);
  }

}


function calculate_barycentric(x, y, v1, v2, v3, denom)
{
  let w0 = ((v2.y-v3.y)*(x-v3.x) + (v3.x-v2.x)*(y-v3.y)) / denom;
  let w1 = ((v3.y-v1.y)*(x-v3.x) + (v1.x-v3.x)*(y-v3.y)) / denom;
  let w2 = 1 - w0 - w1;

  return [w0, w1, w2];
}

class Polygon {

  texture_data = [];
  texture_width;

  verts = [];
  edges = [];
  uvs = [];


  draw() {

    for (let edge of this.edges) {
      edge.draw();
      edge.draw_normals();
    }

    // let v0 = new Vector2(this.verts[0].x-camera.position.x + SCREEN_WIDTH/2, this.verts[0].y-camera.position.y + SCREEN_HEIGHT/2);
    // let v1 = new Vector2(this.verts[1].x-camera.position.x + SCREEN_WIDTH/2, this.verts[1].y-camera.position.y + SCREEN_HEIGHT/2);
    // let v2 = new Vector2(this.verts[2].x-camera.position.x + SCREEN_WIDTH/2, this.verts[2].y-camera.position.y + SCREEN_HEIGHT/2);

    // let xmin = Math.floor(MIN(v0.x, MIN(v1.x, v2.x)));
    // let xmax = Math.floor(MAX(v0.x, MAX(v1.x, v2.x)));
    // let ymin = Math.floor(MIN(v0.y, MIN(v1.y, v2.y)));
    // let ymax = Math.floor(MAX(v0.y, MAX(v1.y, v2.y)));

    // xmin = MAX(xmin, 0); xmin = MIN(xmin, SCREEN_WIDTH);
    // xmax = MAX(xmax, 0); xmax = MIN(xmax, SCREEN_WIDTH);
    // ymin = MAX(ymin, 0); ymin = MIN(ymin, SCREEN_HEIGHT);
    // ymax = MAX(ymax, 0); ymax = MIN(ymax, SCREEN_HEIGHT);


    // let denom = (v1.y-v2.y)*(v0.x-v2.x) + (v2.x-v1.x)*(v0.y-v2.y);
    
    // fill(0, 200, 0);
    // triangle(this.verts[0].x, this.verts[0].y, this.verts[1].x, this.verts[1].y, this.verts[2].x, this.verts[2].y);

    // iterate over bounding box of triangle
    

    // for (let x=xmin; x<=xmax; x++) {
    //   for (let y=ymin; y<=ymax; y++) {

    //     let weights = calculate_barycentric(x, y, v0, v1, v2, denom);

    //     if (weights[0] >= 0 && weights[1] >= 0 && weights[2] >= 0) {

    //       let u = abs(Math.floor((weights[0]*this.uvs[0].x + weights[1]*this.uvs[1].x + weights[2]*this.uvs[2].x)*356)) % 356;
    //       let v = abs(Math.floor((weights[0]*this.uvs[0].y + weights[1]*this.uvs[1].y + weights[2]*this.uvs[2].y)*350)) % 350;


    //       let r = this.texture_data[(4*356*v + 4*u+0)];
    //       let g = this.texture_data[(4*356*v + 4*u+1)];
    //       let b = this.texture_data[(4*356*v + 4*u+2)];

    //       pixels[(4*SCREEN_WIDTH*y + 4*x+0)] = r;
    //       pixels[(4*SCREEN_WIDTH*y + 4*x+1)] = g;
    //       pixels[(4*SCREEN_WIDTH*y + 4*x+2)] = b;
    //       pixels[(4*SCREEN_WIDTH*y + 4*x+3)] = 255;
    //     }
    //   }
    // }
  }

  scale(alpha) {

    for (let vert of this.verts) {
      vert.scale(alpha);
    }

    for (let edge of this.edges) {
      edge.p1.x *= alpha;
      edge.p1.y *= alpha;
      edge.p2.x *= alpha;
      edge.p2.y *= alpha;
    }
  }

  translate(x, y) {
    for (let vert of this.verts) {
      vert.translate(x, y);
    }

    for (let edge of this.edges) {
      edge.p1.translate(x, y);
      edge.p2.translate(x, y);
    }
  }

}

class Map {

  obj_filepath;

  texture_data = [];
  texture_width;

  polygons = [];
  edges = [];

  /**
   * @param {string} filepath
   */
  constructor(filepath) { 
    this.obj_filepath = filepath;
  }

  preload() {

    let vertices = [];
    let normals = [];
    let uvs = [];

    loadImage("engine/level/levels/mouth.jpg", (img) => {
      img.loadPixels();
      this.texture_width = img.width;
      for (let i=0; i<img.pixels.length; i++) {
        this.texture_data[i] = img.pixels[i];
      }
    });

    loadStrings(this.obj_filepath, (file) => {
      for (let i=0; i<file.length; i++) {
        
        let tokens = splitTokens(file[i], " ");
        
        if (tokens[0]?.charAt(0) == 'v' && tokens[0]?.length == 1) {
          vertices.push(new Vector2(+tokens[1], -tokens[2]));
        }

        if (tokens[0]?.charAt(0) == 'v' && tokens[0]?.charAt(1) == 't') {
          uvs.push(new Vector2(1-tokens[1], 1-tokens[2]));
        }
        
        if (tokens[0]?.charAt(0) == 'f' && tokens[0]?.length == 1) {

          let poly = new Polygon();

          let edge1 = new Edge();
          let edge2 = new Edge();
          let edge3 = new Edge();

          let tok1 = splitTokens(tokens[1], '/');
          let tok2 = splitTokens(tokens[2], '/');
          let tok3 = splitTokens(tokens[3], '/');

          edge1.p1 = new Vector2(vertices[+tok1[0]-1].x, vertices[+tok1[0]-1].y);
          edge1.p2 = new Vector2(vertices[+tok2[0]-1].x, vertices[+tok2[0]-1].y);
          
          edge2.p1 = new Vector2(vertices[+tok2[0]-1].x, vertices[+tok2[0]-1].y);
          edge2.p2 = new Vector2(vertices[+tok3[0]-1].x, vertices[+tok3[0]-1].y);
          
          edge3.p1 = new Vector2(vertices[+tok3[0]-1].x, vertices[+tok3[0]-1].y);
          edge3.p2 = new Vector2(vertices[+tok1[0]-1].x, vertices[+tok1[0]-1].y);
          
          poly.edges[0] = edge1;
          poly.edges[1] = edge2;
          poly.edges[2] = edge3;

          poly.verts[0] = new Vector2(vertices[+tok1[0]-1].x, vertices[+tok1[0]-1].y);
          poly.verts[1] = new Vector2(vertices[+tok2[0]-1].x, vertices[+tok2[0]-1].y);
          poly.verts[2] = new Vector2(vertices[+tok3[0]-1].x, vertices[+tok3[0]-1].y);

          poly.uvs[0] = new Vector2(uvs[+tok1[1]-1].x, uvs[+tok1[1]-1].y);
          poly.uvs[1] = new Vector2(uvs[+tok2[1]-1].x, uvs[+tok2[1]-1].y);
          poly.uvs[2] = new Vector2(uvs[+tok3[1]-1].x, uvs[+tok3[1]-1].y);

          poly.texture_data = this.texture_data;
          poly.texture_width = this.texture_width;

          this.polygons.push(poly);
        }
      }
      // console.log(this.edges);

      // Calculate surface normals
      for (let polygon of this.polygons) {
        for (let edge of polygon.edges) {
          edge.face_normal = vector2_sub(edge.p2, edge.p1);
          edge.face_normal.normalise();
          edge.face_normal.rotate(1.57);
        }
      }

      // console.log(this.edges);
    });
  }

  setup() {
    this.scale(25);
    this.translate(SCREEN_WIDTH/2, SCREEN_HEIGHT/2);
  }

  draw() {
    // loadPixels();
    for (let polygon of this.polygons) {
      polygon.draw();
    }
    // updatePixels();
  }

  scale(alpha) {
    for (let polygon of this.polygons) {
      polygon.scale(alpha);
    }
  }

  translate(x, y) {
    for (let polygon of this.polygons) {
      polygon.translate(x, y);
    }
  }

}