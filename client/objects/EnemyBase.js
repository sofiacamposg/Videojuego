//Inherits from Animated Object
import { AnimatedObject } from "../libs/AnimatedObject.js";
class EnemyBase extends AnimatedObject {

  constructor(position, hp = 100, damage = 20, speed = 4){
    super(position,200,200,"white","enemy",4)
    this.setCollider(140, 65);
    this.hp = hp;
    this.damage = damage;
    this.speed = speed;
  }

  update(){
    this.updateCollider();
    // movement
    this.updateAnimation(20);
    this.attackHitbox = null;
  }

  createHitbox(){
    if (this.direction === "right") {
      this.attackHitbox = {
        x: this.position.x + this.width + this.HITBOX_OFFSET,
        y: this.position.y + this.height / 2 - this.HITBOX_HEIGHT / 2,
        width: this.HITBOX_WIDTH,
        height: this.HITBOX_HEIGHT
      };
    } else {
      this.attackHitbox = {
        x: this.position.x - this.HITBOX_WIDTH - this.HITBOX_OFFSET,
        y: this.position.y + this.height / 2 - this.HITBOX_HEIGHT / 2,
        width: this.HITBOX_WIDTH,
        height: this.HITBOX_HEIGHT
      };
    }
  };

  takeDamage(hit){
    this.hp -= hit;
    if (this.hp <= 0) {
      this.spriteImage = this.spriteDeath;  //TODO arrerglarla para que salga bien el sprite
      this.updateAnimation(500);
      this.hp = 0;
    }
  }

  draw(ctx){
    super.draw(ctx)

     // DEBUG HITBOX (rojo)
    if (this.attackHitbox) {
      ctx.strokeStyle = "red";
      ctx.strokeRect(
        this.attackHitbox.x,
        this.attackHitbox.y,
        this.attackHitbox.width,
        this.attackHitbox.height
      );
    }

  }

}
export { EnemyBase }; 