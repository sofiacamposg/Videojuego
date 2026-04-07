import { EnemyBase } from "./EnemyBase.js";
import { Rect } from "../libs/Rect.js";

class EnemyLion extends EnemyBase {  //2300 x 608 px
    constructor(position){
        super(position);
        this.health = 100; //example data
        this.speed = 4; //example data
        this.setSprite("./assets/enemy1/walk.png", new Rect (0, 0, 575, 608)); 
        this.sheetCols = 4;
        this.setAnimation(0, 3, true, 200);
        this.scale = 0.8; 
    }
}
export { EnemyLion };