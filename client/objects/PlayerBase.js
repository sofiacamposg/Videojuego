//Hereda de Animated Object
import { AnimatedObject } from "../libs/AnimatedObject.js";
class PlayerBase extends AnimatedObject {

  constructor(position){
    super(position,160,160,"white","player",6)
  }

  update(){
    // movimiento
    this.updateAnimation(20);
  }

  draw(ctx){
    super.draw(ctx)
  }

}
export { PlayerBase }; 