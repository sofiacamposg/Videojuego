import { EnemyBase } from "./EnemyBase.js";
import { Rect } from "../libs/Rect.js";

class EnemyLion extends EnemyBase {

    constructor(position){

        super(position, 100, 15, 4); 

        this.setSprite("./assets/enemy1/walk.png", new Rect(0, 0, 575, 872));
        this.sheetCols = 4;
        this.setAnimation(0, 3, true, 200);
    }

    update(){

        this.position.x -= this.speed;

        this.updateAnimation(20);
    }
}

export { EnemyLion };