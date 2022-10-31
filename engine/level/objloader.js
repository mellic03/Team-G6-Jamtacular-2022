
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

class Polygon {

  edges = [];

  draw() {
    for (let edge of this.edges) {
      edge.draw();
    }
  }

}

class Map {

  obj_filepath;

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

    loadStrings(this.obj_filepath, (file) => {
      for (let i=0; i<file.length; i++) {
        
        let tokens = splitTokens(file[i], " ");
        
        if (tokens[0]?.charAt(0) == 'v' && tokens[0]?.length == 1) {
          vertices.push(new Vector2(+tokens[1], -tokens[2]));
        }

        if (tokens[0]?.charAt(0) == 'v' && tokens[0]?.charAt(1) == 'n') {
          normals.push(new Vector2(+tokens[1], -tokens[2]));
        }

        if (tokens[0]?.charAt(0) == 'f' && tokens[0]?.length == 1) {

          let poly = new Polygon();

          let edge1 = new Edge();
          let edge2 = new Edge();
          let edge3 = new Edge();
          let edge4 = new Edge();

          let tok1 = splitTokens(tokens[1], '/');
          let tok2 = splitTokens(tokens[2], '/');
          let tok3 = splitTokens(tokens[3], '/');
          let tok4 = splitTokens(tokens[4], '/');

          edge1.p1 = new Vector2(vertices[+tok1[0]-1].x, vertices[+tok1[0]-1].y);
          edge1.p2 = new Vector2(vertices[+tok2[0]-1].x, vertices[+tok2[0]-1].y);
          
          edge2.p1 = new Vector2(vertices[+tok2[0]-1].x, vertices[+tok2[0]-1].y);
          edge2.p2 = new Vector2(vertices[+tok3[0]-1].x, vertices[+tok3[0]-1].y);
          
          edge3.p1 = new Vector2(vertices[+tok3[0]-1].x, vertices[+tok3[0]-1].y);
          edge3.p2 = new Vector2(vertices[+tok4[0]-1].x, vertices[+tok4[0]-1].y);
          
          edge4.p1 = new Vector2(vertices[+tok4[0]-1].x, vertices[+tok4[0]-1].y);
          edge4.p2 = new Vector2(vertices[+tok1[0]-1].x, vertices[+tok1[0]-1].y);
          
          poly.edges[0] = edge1;
          poly.edges[1] = edge2;
          poly.edges[2] = edge3;
          poly.edges[3] = edge4;

          // this.edges.push(edge1, edge2, edge3, edge4);
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
    for (let polygon of this.polygons) {
      polygon.draw();
    }
  }

  scale(alpha) {
    for (let polygon of this.polygons) {
      for (let edge of polygon.edges) {
        edge.p1.x *= alpha;
        edge.p1.y *= alpha;
        edge.p2.x *= alpha;
        edge.p2.y *= alpha;
      }
    }
  }

  translate(x, y) {
    for (let polygon of this.polygons) {
      for (let edge of polygon.edges) {
        edge.p1.x += x;
        edge.p1.y += y;
        edge.p2.x += x;
        edge.p2.y += y;
      }
    }
  }

}