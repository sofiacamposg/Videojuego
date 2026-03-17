import { PlayerBase } from "./PlayerBase.js";
import { Rect } from "../libs/Rect.js";

class Player2 extends PlayerBase {  //708 x 414 px
    constructor(position){
        super(position);
        this.health = 100; //ejemplo
        this.speed = 4; //ejemplo
        this.setSprite("./assets/Player2.png", new Rect (0, 0, 354, 414)); //dibuja solo una sección del sprite, el primer frame
        this.sheetCols = 2;
        this.setAnimation(0, 1, true, 200);
    }
}
export { Player2 };