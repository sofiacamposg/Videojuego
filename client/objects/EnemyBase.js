//Hereda de Animated Object
import { AnimatedObject } from "../libs/AnimatedObject.js";

class EnemyBase extends AnimatedObject {

  constructor(position, hp = 100, damage = 10, speed = 2){
    super(position, 200, 200, "white", "enemy", 4);


    this.hp = hp;
    this.damage = damage;
    this.speed = speed;
  }

  update(){

  }

  draw(ctx){
    super.draw(ctx);
  }
}

export { EnemyBase };
