//Inherits from Animated Object
import { AnimatedObject } from "../libs/AnimatedObject.js";
class EnemyBase extends AnimatedObject {

  constructor(position){
    super(position,200,200,"white","enemy",4)

    
  }

  update(){
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