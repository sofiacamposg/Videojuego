//Inherits from Animated Object
import { AnimatedObject } from "../libs/AnimatedObject.js";
class EnemyBase extends AnimatedObject {

  constructor(position){
    super(position,200,200,"white","enemy",4)
  }

  update(){
    // movement
    this.updateAnimation(20);
  }

  draw(ctx){
    super.draw(ctx)
  }

}
export { EnemyBase }; 