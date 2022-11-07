
class CyberDemon {

  img_walk_front;
  img_walk_front_left;
  img_walk_front_right;
  img_walk_left;
  img_walk_right;
  img_walk_back_left;
  img_walk_back_right;
  img_walk_back;

  anim_walk_front;
  anim_walk_front_left;
  anim_walk_front_right;
  anim_walk_left;
  anim_walk_right;
  anim_walk_back_left;
  anim_walk_back_right;
  anim_walk_back;

  img_attack;

  pos; vel; dir;

  constructor(x, y) {
    this.pos = new Vector2(x, y);
    this.vel = new Vector2(0, 0);
    this.dir = new Vector2(1, 0);

    loadImage("engine/enemy/cyberdemon/spritesheets/walkfront-sheet.png", (img) => {
      
    });

  }




}