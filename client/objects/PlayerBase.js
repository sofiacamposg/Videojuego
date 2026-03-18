//Hereda de Animated Object
import { AnimatedObject } from "../libs/AnimatedObject.js";
class PlayerBase extends AnimatedObject {

  constructor(position){
    super(position,160,160,"white","player",6)
  }

  update(){
    // movimiento
    if(this.isMoving){ //Si hay movimiento haz update de frame
      this.updateAnimation(20);
    }
    else{
      this.frame = 0;
      if(this.spriteRect){ //si no se mueve quedate en el frame 0
        this.spriteRect.x = 0;
      }
    }
    
  }

  draw(ctx){
    super.draw(ctx)
  }

}
export { PlayerBase }; 