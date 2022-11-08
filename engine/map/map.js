class Map {
  
  name; next_name;
  filepath;

  background;

  projectile_count = 0;
  max_projectiles = 50;
  projectiles = [];
  props = [];
  pickups = [];
  enemies = [];

  spawn_x; spawn_y;
  exit_x;  exit_y;

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

    this.background = loadImage("engine/map/maps/" + this.name + ".png");

    loadJSON("engine/map/entities.json", (entity_data) => {

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
            this.spawn_x = (i%25)*25 + 12.5;
            this.spawn_y = floor(i/25)*25 + 12.5
          }

          else if (tokens[0] == "EXIT") {
            this.exit_x = (i%25)*25 + 12.5;
            this.exit_y = floor(i/25)*25 + 12.5
            let prop_name = "exit_portal";
            let obj = entity_data.static_props[prop_name];
            let prop = new Prop((i%25)*25 + 12.5, floor(i/25)*25 + 12.5, obj.directory, obj.frames, prop_name);
            prop.height = obj.height;
            prop.voffset = obj.vertical_offset;
            prop.collision_radius = obj.collision_radius;
            this.props.push(prop);
          }

          else if (tokens[0] == "PROP:") {
            let tok1 = splitTokens(tokens[1], ':');
            let prop_name;
            if (tok1.length == 2) {
              prop_name = tok1[0];
            }
            else {
              prop_name = tokens[1];
            }
            let obj = entity_data.static_props[prop_name];
            let prop;

            // If directional prop
            if (tok1.length == 2) {
              let dir;
              console.log(obj)
              switch (tok1[1]) {
                case ("north"): dir = new Vector2(+1,  0); break;
                case ("east"):  dir = new Vector2( 0, +1); break;
                case ("south"): dir = new Vector2(-1,  0); break;
                case ("west"):  dir = new Vector2( 0, -1); break;
              }
              prop = new DirectionalProp((i%25)*25 + 12.5, floor(i/25)*25 + 12.5, dir.x, dir.y, obj.directory, obj.frames, prop_name);
            }

            else if (obj.random_placement != undefined) {
              prop = new Prop((i%25)*25 + random(25), floor(i/25)*25 + random(25), obj.directory, obj.frames, prop_name);
            }
            else {
              prop = new Prop((i%25)*25 + 12.5, floor(i/25)*25 + 12.5, obj.directory, obj.frames, prop_name);
            }

            prop.height = obj.height;
            prop.voffset = obj.vertical_offset;
            prop.collision_radius = obj.collision_radius;
            this.props.push(prop);
          }

          else if (tokens[0] == "PICKUP:") {
            let pickup_name = tokens[1];
            let obj = entity_data.pickups[pickup_name];
            let pickup = new Pickup((i%25)*25 + 12.5, floor(i/25)*25 + 12.5, obj.directory, pickup_name);
            pickup.attribute = obj.attribute;
            pickup.amount = obj.amount;
            pickup.height = obj.height;
            pickup.voffset = obj.vertical_offset;
            this.pickups.push(pickup);
          }

          else if (tokens[0] == "ENEMY:") {
            let enemy_name = tokens[1];
            let obj = entity_data.enemies[enemy_name];

            let enemy;

            if (enemy_name == "cyberdemon")
              enemy = new CyberDemon((i%25)*25 + 12.5, floor(i/25)*25 + 12.5);

            else
              enemy = new EnemyType_1((i%25)*25 + 12.5, floor(i/25)*25 + 12.5, obj.directory);

            for (let script of obj.behaviour_scripts) {
              enemy.behaviour_scripts.push(behaviour_scripts[script]);
            }

            enemy.frames = obj.frames;
            enemy.height = obj.height;
            enemy.voffset = obj.vertical_offset;

            this.enemies.push(enemy);
          }
        }

        console.log(this.enemies);

        for (let enemy of this.enemies) {
          enemy.preload();
        }
        for (let prop of this.props) {
          prop.preload();
        }
        for (let pickup of this.pickups) {
          pickup.preload();
        }
      });

    });
  }

  setup() {
    for (let enemy of this.enemies) {
      enemy.setup();
    }
    for (let prop of this.props) {
      prop.setup();
    }
    for (let pickup of this.pickups) {
      pickup.setup();
    }
  }

  draw(world_data) {
    for (let enemy of this.enemies) {
      enemy.draw(world_data);
    }

    for (let prop of this.props) {
      prop.draw(world_data);
    }

    for (let projectile of this.projectiles) {
      projectile.draw(world_data);
      projectile.pos.x += projectile.xvel;
      projectile.pos.y += projectile.yvel;
    }

    if (this.projectiles.length >= this.max_projectiles) {
      this.projectiles.pop();
    }
  }

  point_in_grid(x, y) {

    let xprime = Math.floor(x/this.width);
    let yprime = Math.floor(y/this.width);
  
    if (this.tilemap[this.width*yprime + xprime] == 1) {
      return true
    }
  
    return false;
  }
  
}


function create_special_enemy(name, x, y) {

}