//  Inherits from Animated Object
import { AnimatedObject } from "../libs/AnimatedObject.js";
class PlayerBase extends AnimatedObject {

  constructor(position){
    super(position, 160, 160,"white","player",6)
    this.direction = "right";  //default direction
    //attack
    this.playeratack = false;  //default attack state
    this.attackFrames = 0;  //frames counter
    this.attackDuration = 10;  //frames the attack lasts
    //hitbox
    this.HITBOX_WIDTH = 50;  //range
    this.HITBOX_HEIGHT = 80; 
    this.HITBOX_OFFSET = -15;  
    this.hitEnemies = new Set();  //tracks enemies already hit in this attack swing  $

    //THIS ARE FOR WHEN WE ENABLE CARD SYSTEM
    //player.damage = 10;
    //player.invincible = false;
    //player.canJump = true;
    //player.lifeSteal = false;
  }

  update(){
    if (!this.isOnGround) {
      //case 1: jump (no attack allowed in the air)
      this.spriteImage = (this.direction === "right") ? this.spriteJumpRight : this.spriteJumpLeft;
      this.updateAnimation(20);
      this.attackHitbox = null;
    } else if (this.playeratack) {
      //case 2: attack (only on the ground)
      this.spriteImage = (this.direction === "right") ? this.attackRight : this.attackLeft;
      this.updateAnimation(20);
      this.createHitbox();  //hitbox to attack
      this.attackFrames++;
      if (this.attackFrames >= this.attackDuration) {  //reset to default 
        this.playeratack = false;
        this.attackFrames = 0;
        this.attackHitbox = null;  //turn off hitbox
        this.hitEnemies.clear();  //clean "hitbox" to accept enemies again
      }
    } else if (this.isMoving) {
      //case 3: walk
      this.spriteImage = (this.direction === "right") ? this.spriteRight : this.spriteLeft;
      this.updateAnimation(20);
      this.attackHitbox = null;
    } else {
      //case 4: stay
      this.spriteImage = (this.direction === "right") ? this.spriteRight : this.spriteLeft;
      this.frame = 0;  //returns variable to 0
      if (this.spriteRect) this.spriteRect.x = 0;  //returns image to initial frame (reset)

      this.attackHitbox = null;
    }
  };

  createHitbox(){
    if (this.direction === "right") {
      this.attackHitbox = {
        x: this.position.x + this.halfSize.x + this.HITBOX_OFFSET,
        y: this.position.y - this.HITBOX_HEIGHT / 2,
        width: this.HITBOX_WIDTH,
        height: this.HITBOX_HEIGHT
      };
    } else {
      this.attackHitbox = {
        x: this.position.x - this.halfSize.x - this.HITBOX_WIDTH - this.HITBOX_OFFSET,
        y: this.position.y - this.HITBOX_HEIGHT / 2,
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
};
export { PlayerBase }; 