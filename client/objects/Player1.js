import { PlayerBase } from "./PlayerBase.js";
import { Rect } from "../libs/Rect.js";

class Player1 extends PlayerBase {  //1736 x 470 px
    constructor(position){
        super(position);
        this.health = 120; //* TODO: get this info from the db
        this.speed = 5; 
        this.damage = 10;
        
        this.sheetCols = 4;
        this.setAnimation(0, 3, true, 200);  
        //From here down, these properties allow the character to stay idle when not moving and to be able to jump
        this.velocityY = 0; //how fast it jumps
        this.gravity = 0.8;
        this.jumpStrength = -14;
        this.isOnGround = true;
        this.isMoving = false;

        //upload all the sprites
        this.spriteRight = new Image();  //walk
        this.spriteRight.src = "./assets/player1/1.png";
        this.spriteLeft = new Image();
        this.spriteLeft.src = "./assets/player1/2.png";

        this.spriteJumpRight = new Image();  //jump
        this.spriteJumpRight.src = "./assets/player1/3.png";
        this.spriteJumpLeft = new Image();
        this.spriteJumpLeft.src = "./assets/player1/4.png";

        this.attackRight = new Image();
        this.attackRight.src = "./assets/player1/attackright.png";  //attack right
        this.attackLeft = new Image();
        this.attackLeft.src = "./assets/player1/attackleft.png";  //attack left

        //initial sprite
        this.spriteImage = this.spriteRight;
        this.spriteRect = new Rect(0, 0, 434, 470);
    }
}
export { Player1 };