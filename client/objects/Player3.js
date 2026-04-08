import { PlayerBase } from "./PlayerBase.js";
import { Rect } from "../libs/Rect.js";

class Player3 extends PlayerBase {  //1736 x 470 px
    constructor(position){
        super(position);
        this.hp = 150; //* TODO: traer esta info de la db
        this.speed = 3; 
        this.damage = 20;  //TODO: cambiar daño en el canvas

        this.sheetCols = 4;
        this.setAnimation(0, 3, true, 200);
        //De aquí para abajo las propiedades son para que pueda quedarse quieto si no está en movimiento y que pueda saltar
        this.velocityY = 0; //qué tan rápido brinca
        this.gravity = 0.8; 
        this.jumpStrength = -14;
        this.isOnGround = true;
        this.isMoving = false;

        //upload all the sprites
        this.spriteRight = new Image();  //walk
        this.spriteRight.src = "./assets/player3/9.png";
        this.spriteLeft = new Image();
        this.spriteLeft.src = "./assets/player3/10.png";

        this.spriteJumpRight = new Image();  //jump
        this.spriteJumpRight.src = "./assets/player3/11.png";
        this.spriteJumpLeft = new Image();
        this.spriteJumpLeft.src = "./assets/player3/12.png";

        this.attackRight = new Image();
        this.attackRight.src = "./assets/player3/attackright.png";  //attack right
        this.attackLeft = new Image();
        this.attackLeft.src = "./assets/player3/attackleft.png";  //attack left


        //initial sprite
        this.spriteImage = this.spriteRight;
        this.spriteRect = new Rect(0, 0, 434, 470);
    }
}
export { Player3 };