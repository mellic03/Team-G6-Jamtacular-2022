class Map {
  
  name; next_name;
  filepath;

  background;

  max_projectiles = 50;
  projectile_count = 0;
  projectiles = [];

  props = [];
  pickups = [];
  enemies = [];

  spawn_dir_x = 1; spawn_dir_y = 0;

  spawn_x; spawn_y;
  exit_x;  exit_y;
  exit_xs = []; exit_ys = [];
  exit_mapnames = [];

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

    loadImage("engine/prop/projectile/projectile.png", (img) => {
      for (let i=0; i<this.max_projectiles; i++) {
        let proj = new Projectile(-100, -100, 0, 0);
        proj.init(img);
        this.projectiles.push(proj);
      }
    })

    this.background = loadImage("engine/map/maps/" + this.name + ".png");

    loadJSON("engine/map/entities.json", (entity_data) => {

      loadStrings(this.filepath, (file) => {

        for (let i=0; i<25*25; i++) {

          let tokens = splitTokens(file[i], " ");

          if (tokens[0] != "WALL:") {
            this.tilemap[i] = 0;
            this.colourmap[4*i+0] = 0;
            this.colourmap[4*i+1] = 0;
            this.colourmap[4*i+2] = 0;
            this.colourmap[4*i+3] = 0;
          }


          if (tokens[0] == "WALL:") {
            this.tilemap[i] = 1;
            let color = splitTokens(tokens[1], ",");
            this.colourmap[4*i+0] = +color[0];
            this.colourmap[4*i+1] = +color[1];
            this.colourmap[4*i+2] = +color[2];
            this.colourmap[4*i+3] = 255;
          }


          else if (tokens[0] == "SPAWN") {
            this.spawn_x = (i%25)*25 + 12.5;
            this.spawn_y = floor(i/25)*25 + 12.5
          }


          else if (tokens[0] == "EXIT") {

            this.exit_x = (i%25)*25 + 12.5;
            this.exit_y = floor(i/25)*25 + 12.5;
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

            // Jank entrance/exit prop (lord forgive me)
            //------------------------------------------
            if (tok1.length == 2) {

              if (tok1[0] == "SPAWN") {
                this.spawn_x = (i%25)*25 + 12.5;
                this.spawn_y = floor(i/25)*25 + 12.5;
                switch (tok1[1]) {
                  case ("north"): this.spawn_dir_x =  0, this.spawn_dir_y = -1; break;
                  case ("east"):  this.spawn_dir_x = +1, this.spawn_dir_y =  0; break;
                  case ("south"): this.spawn_dir_x =  0, this.spawn_dir_y = +1; break;
                  case ("west"):  this.spawn_dir_x = -1, this.spawn_dir_y =  0; break;
                }
              }

              if (tok1[0] == "EXIT") {
                this.exit_xs.push((i%25)*25 + 12.5);
                this.exit_ys.push(floor(i/25)*25 + 12.5);
                this.exit_mapnames.push(tok1[1]);
                let prop_name = "exit_portal";
                let obj = entity_data.static_props[prop_name];
                let prop = new Prop((i%25)*25 + 12.5, floor(i/25)*25 + 12.5, obj.directory, obj.frames, prop_name);
                prop.height = obj.height;
                prop.voffset = obj.vertical_offset;
                prop.collision_radius = obj.collision_radius;
                this.props.push(prop);
              }
              continue;
            }
            //------------------------------------------

            if (tok1.length >= 2) {
              prop_name = tok1[0];
            }
            else {
              prop_name = tokens[1];
            }
            let obj = entity_data.static_props[prop_name];
            let prop;


            // If directional prop
            if (tok1.length >= 2) {
              let dir;
              let prop_x = (i%25)*25 + 12.5;
              let prop_y = floor(i/25)*25 + 12.5;

              switch (tok1[1]) {
                case ("north"): dir = new Vector2( 0, -1); break;
                case ("east"):  dir = new Vector2(+1,  0); break;
                case ("south"): dir = new Vector2( 0,  1); break;
                case ("west"):  dir = new Vector2(-1,  0); break;
              }
              if (tok1.length == 3) {
                switch (tok1[2]) {
                  case ("north"): prop_x += 0,  prop_y -= 10; break;
                  case ("east"):  prop_x += 10, prop_y += 0;  break;
                  case ("south"): prop_x += 0,  prop_y += 10; break;
                  case ("west"):  prop_x -= 10, prop_y += 0;  break;
                }
              }
              prop = new DirectionalProp(prop_x, prop_y, dir.x, dir.y, obj.directory, obj.frames, prop_name);
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
            for (let attribute of obj.attributes) {
              pickup.attributes.push(attribute);
            }
            for (let amount of obj.amounts) {
              pickup.amounts.push(amount);
            }

            pickup.height = obj.height;
            pickup.voffset = obj.vertical_offset;
            this.pickups.push(pickup);
          }


          else if (tokens[0] == "ENEMY:") {

            let tok1 = splitTokens(tokens[1], ':');
            let enemy_name;
            if (tok1.length == 2) {
              enemy_name = tok1[0];
            }
            else {
              enemy_name = tokens[1];
            }

            let obj = entity_data.enemies[enemy_name];
            let enemy;

            // If spawning multiple enemies
            if (tok1.length == 2) {

              for (let j=0; j<+tok1[1]; j++) {
                enemy = new EnemyType_1((i%25)*25 + 12.5 + random(-5, 5), floor(i/25)*25 + 12.5 + random(-5, 5), obj.directory);

                for (let script of obj.behaviour_scripts) {
                  enemy.behaviour_scripts.push(behaviour_scripts[script]);
                }

                enemy.frames = obj.frames;
                enemy.height = obj.height;
                enemy.voffset = obj.vertical_offset;
                
                enemy.health = obj.health;
                enemy.damage = obj.damage;
                enemy.speed = obj.speed;
                
                enemy.follow_range = obj.follow_range;
                enemy.chase_range = obj.chase_range;
                enemy.attack_range = obj.attack_range;
                enemy.push_range = obj.push_range;

                this.enemies.push(enemy);
              }
            }

            else {
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
              
              enemy.health = obj.health;
              enemy.damage = obj.damage;
              enemy.speed = obj.speed;
              enemy.attack_speed = (obj.attack_speed != undefined) ? obj.attack_speed : 1;
              
              enemy.follow_range = obj.follow_range;
              enemy.chase_range = obj.chase_range;
              enemy.attack_range = obj.attack_range;
              enemy.push_range = obj.push_range;

              this.enemies.push(enemy);
            }

          }
        }

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
    if (game_paused)
      return;
    
    for (let enemy of this.enemies) {
      enemy.draw(world_data);
    }

    for (let prop of this.props) {
      prop.draw(world_data);
    }

    for (let projectile of this.projectiles) {
      projectile.draw(world_data);

      if (this.point_in_grid(projectile.pos.x, projectile.pos.y)) {
        projectile.pos.x = -100;
        projectile.pos.y = -100;
        projectile.xvel = 0;
        projectile.yvel = 0;
      }
      
      projectile.pos.x += projectile.xvel * 0.1 * deltaTime;
      projectile.pos.y += projectile.yvel * 0.1 * deltaTime;
    }
  }

  point_in_grid(x, y) {

    let xprime = Math.floor(x/this.width);
    let yprime = Math.floor(y/this.width);
  
    if (this.tilemap[this.width*yprime + xprime] == 1)
      return true
  
    return false;
  }
 
  create_projectile(pos, xvel, yvel) {
    this.projectile_count = (this.projectile_count+1)%this.max_projectiles;
    this.projectiles[this.projectile_count].pos.x = pos.x;
    this.projectiles[this.projectile_count].pos.y = pos.y;
    this.projectiles[this.projectile_count].xvel = xvel;
    this.projectiles[this.projectile_count].yvel = yvel;
  }
  
}

