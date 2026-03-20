//Hereda de Animated Object
import { AnimatedObject } from "../libs/AnimatedObject.js";
class EnemyBase extends AnimatedObject {

  constructor(position){
    super(position,160,160,"white","enemy",4)
  }

  update(){
    // movimiento
    this.updateAnimation(20);
  }

  draw(ctx){
    super.draw(ctx)
  }

}
export { EnemyBase }; 