import { EnemyBase } from "./EnemyBase.js";
import { Rect } from "../libs/Rect.js";

class EnemyLion extends EnemyBase {  //2300 x 608 px
    constructor(position){
        super(position, 100, 15, 4);

        this.setSprite("./assets/enemy1/walk.png", new Rect (0, 0, 575, 608)); 
        this.sheetCols = 4;
        this.setAnimation(0, 3, true, 200);
        this.scale = 0.8; 

        //DEATH
    this.spriteDeath = new Image();
    this.spriteDeath.src = "./assets/enemy1/death.png";
    }
}
export { EnemyLion };