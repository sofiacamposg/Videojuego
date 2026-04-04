import { EnemyBase } from "./EnemyBase.js";
import { Rect } from "../libs/Rect.js";

class EnemyLion extends EnemyBase {  //2300 x 872 px
    constructor(position){
        super(position);
        this.health = 100; //ejemplo
        this.speed = 4; //ejemplo
        this.setSprite("./assets/enemy1/walk.png", new Rect (0, 0, 575, 872)); //dibuja solo una sección del sprite, el primer frame
        this.sheetCols = 4;
        this.setAnimation(0, 3, true, 200);
    }
}
export { EnemyLion };