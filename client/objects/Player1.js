import { PlayerBase } from "./PlayerBase.js";
import { Rect } from "../libs/Rect.js";

class Player1 extends PlayerBase {  //720 x 390 px
    constructor(position){
        super(position);
        this.health = 100; //ejemplo
        this.speed = 4; //ejemplo
        this.setSprite("./assets/Player1.png", new Rect (0, 0, 360, 390)); //dibuja solo una sección del sprite, el primer frame
        this.sheetCols = 2;
        this.setAnimation(0, 1, true, 200);
    }
}
export { Player1 };