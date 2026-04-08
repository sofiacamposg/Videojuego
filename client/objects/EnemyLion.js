import { EnemyBase } from "./EnemyBase.js";
import { Rect } from "../libs/Rect.js";

class EnemyLion extends EnemyBase {  //2300 x 608 px
    constructor(position){
        super(position, 100, 15, 4);
        this.sheetCols = 4;
        this.setAnimation(0, 3, true, 200);
        this.scale = 0.8; 

        this.spriteWalk = new Image();
        this.spriteWalk.src = "./assets/enemy1/walk.png";

        //DEATH
        this.spriteDeath = new Image();
        this.spriteDeath.src = "./assets/enemy1/death.png";

        //ATTACK
        this.spriteAttack = new Image();
        this.spriteAttack.src = "./assets/enemy1/attack.png"; 

        //INITIAL
        this.spriteImage = this.spriteWalk;
        this.spriteRect = new Rect(0, 0, 575, 608);
    }
}
export { EnemyLion };