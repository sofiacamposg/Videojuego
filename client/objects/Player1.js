import { PlayerBase } from "./PlayerBase.js";
import { Rect } from "../libs/Rect.js";

class Player1 extends PlayerBase {  //1736 x 608 px
    constructor(position){
        super(position);
        this.health = 120; //* TODO: traer esta info de la db
        this.speed = 5; 
        this.sheetCols = 4;
        this.setAnimation(0, 1, true, 200);
        //De aquí para abajo las propiedades son para que pueda quedarse quieto si no está en movimiento y que pueda saltar
        this.velocityY = 0; //qué tan rápido brinca
        this.gravity = 0.8;
        this.jumpStrength = -14;
        this.isOnGround = true;
        this.isMoving = false;

        //upload all the sprites
        this.spriteRight = new Image();
        this.spriteRight.src = "./assets/player1/1.png";
        this.spriteLeft = new Image();
        this.spriteLeft.src = "./assets/player1/2.png";
        this.spriteJumpRight = new Image();
        this.spriteJumpRight.src = "./assets/player1/3.png";
        this.spriteJumpLeft = new Image();
        this.spriteJumpLeft.src = "./assets/player1/4.png";

        //initial sprite
        this.spriteImage = this.spriteRight;
        this.spriteRect = new Rect(0, 0, 434, 608);
    }
}
export { Player1 };