import { PlayerBase } from "./PlayerBase.js";
import { Rect } from "../libs/Rect.js";

class Player3 extends PlayerBase {  //680 x 400 px
    constructor(position){
        super(position);
        this.health = 100; //ejemplo
        this.speed = 4; //ejemplo
        this.setSprite("./assets/Player3.png", new Rect (0, 0, 340, 400)); //dibuja solo una sección del sprite, el primer frame
        this.sheetCols = 2;
        this.setAnimation(0, 1, true, 200);
        //De aquí para abajo las propiedades son para que pueda quedarse quieto si no está en movimiento y que pueda saltar
        this.velocityY = 0; //qué tan rápido brinca
        this.gravity = 0.8; 
        this.jumpStrength = -14;
        this.isOnGround = true;
        this.isMoving = false;
    }
}
export { Player3 };