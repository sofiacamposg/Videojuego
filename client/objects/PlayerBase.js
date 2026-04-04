//Hereda de Animated Object
import { AnimatedObject } from "../libs/AnimatedObject.js";
class PlayerBase extends AnimatedObject {

  constructor(position){
    super(position, 160, 160,"white","player",6)
    this.direction = "right";  //default direction
    this.playeratack = false;  //default attack state
    this.attackFrames = 0;  //frames counter
    this.attackDuration = 25;  //frames the attack lasts
  }

  update(){
    if (!this.isOnGround) {
      //case 1: jump (no attack allowed in the air)
      this.spriteImage = (this.direction === "right") ? this.spriteJumpRight : this.spriteJumpLeft;
      this.updateAnimation(20);
    } else if (this.playeratack) {
      //case 2: attack (only on the ground)
      this.spriteImage = (this.direction === "right") ? this.attackRight : this.attackLeft;  
      this.updateAnimation(20);
      this.attackFrames++;
      if (this.attackFrames >= this.attackDuration) {
        this.playeratack = false;
        this.attackFrames = 0;
      }
    } else if (this.isMoving) {
      //case 3: walk
      this.spriteImage = (this.direction === "right") ? this.spriteRight : this.spriteLeft;
      this.updateAnimation(20);
    } else {
      //case 4: stay
      this.spriteImage = (this.direction === "right") ? this.spriteRight : this.spriteLeft;
      this.frame = 0;  //returns variable to 0
      if (this.spriteRect) this.spriteRect.x = 0;  //returns image to initial frame (reset)
    }
  }

  draw(ctx){
    super.draw(ctx)
  }

}
export { PlayerBase }; 