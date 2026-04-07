import { PlayerBase } from "./PlayerBase.js";
import { Rect } from "../libs/Rect.js";

class Player2 extends PlayerBase {  //1736 x 470 px
    constructor(position){
        super(position);
        this.health = 100; //* TODO: get this info from the db
        this.speed = 4; 
        this.sheetCols = 4;
        this.setAnimation(0, 3, true, 200);  //I set it to 2 because otherwise it moves weirdly
        //From here down, these properties allow the character to stay idle when not moving and to be able to jump
        this.velocityY = 0; //how fast it jumps
        this.gravity = 0.8; 
        this.jumpStrength = -14;
        this.isOnGround = true;
        this.isMoving = false;

        //upload all the sprites
        this.spriteRight = new Image();
        this.spriteRight.src = "./assets/player2/5.png";  //walk right
        this.spriteLeft = new Image();
        this.spriteLeft.src = "./assets/player2/6.png";  //walk left

        this.spriteJumpRight = new Image();
        this.spriteJumpRight.src = "./assets/player2/7.png";  //jump right
        this.spriteJumpLeft = new Image();
        this.spriteJumpLeft.src = "./assets/player2/8.png";  //jump left

        this.attackRight = new Image();
        this.attackRight.src = "./assets/player2/attackright.png";  //attack right
        this.attackLeft = new Image();
        this.attackLeft.src = "./assets/player2/attackleft.png";  //attack left

        //initial sprite
        this.spriteImage = this.spriteRight;
        this.spriteRect = new Rect(0, 0, 434, 470);
    }
}
export { Player2 };