//Hereda de Animated Object
import { AnimatedObject } from "../libs/AnimatedObject.js";
class PlayerBase extends AnimatedObject {

  constructor(position){
    super(position,160,160,"white","player",6)
    this.direction = "right";  //default direction
  }

  update(){
    if (!this.isOnGround) {
      //case 1: jump
      this.spriteImage = (this.direction === "right") ? this.spriteJumpRight : this.spriteJumpLeft;
      this.frame = 0;  
      if (this.spriteRect) this.spriteRect.x = 0;  //return to initial frame
    } else if (this.isMoving) {
      //case 2: walk
      this.spriteImage = (this.direction === "right") ? this.spriteRight : this.spriteLeft;
      this.updateAnimation(15);
    } else {
      //case 3: stay
      this.spriteImage = (this.direction === "right") ? this.spriteRight : this.spriteLeft;
      this.frame = 0;  //returns variable to 0
      if (this.spriteRect) this.spriteRect.x = 0;  //returns image to initial frame
    }
  }

  draw(ctx){
    super.draw(ctx)
  }

}
export { PlayerBase }; 