import { AnimatedObject } from "../libs/AnimatedObject.js";

class PlayerBase extends AnimatedObject {

  constructor(position){
    super(position, 160, 160,"white","player",6)

    this.direction = "right";  
    this.playeratack = false;  

    this.attackFrames = 0;  
    this.attackDuration = 25;  

    // HITBOX (constantes)
    this.HITBOX_WIDTH = 60;
    this.HITBOX_HEIGHT = 40;
    this.HITBOX_OFFSET = 20;

    this.attackHitbox = null;
  }

  update(goLeft, goRight, jumpPressed, platforms, groundY){  //manage movement, hurtbox, attack
    this.isMoving = false;
    this.walk(goLeft, goRight);
    this.jump(jumpPressed);
    this.applyGravity();
    this.checkPlatforms(platforms, groundY);
    this.updateCollider();

    //sprites depending on status (jump, walk, attack, ...)
    if (!this.isOnGround) {

      // SALTO
      this.spriteImage = (this.direction === "right") ? this.spriteJumpRight : this.spriteJumpLeft;
      this.updateAnimation(20);

    } else if (this.playeratack) {

      // ATAQUE
      this.spriteImage = (this.direction === "right") ? this.attackRight : this.attackLeft;  
      this.updateAnimation(20);

      this.createHitbox();

      this.attackFrames++;

      if (this.attackFrames >= this.attackDuration) {
        this.playeratack = false;
        this.attackFrames = 0;
        this.attackHitbox = null;
      }

    } else if (this.isMoving) {

      // CAMINAR
      this.spriteImage = (this.direction === "right") ? this.spriteRight : this.spriteLeft;
      this.updateAnimation(20);
      this.attackHitbox = null;
    } else {

      // QUIETO
      this.spriteImage = (this.direction === "right") ? this.spriteRight : this.spriteLeft;
      this.frame = 0;  
      if (this.spriteRect) this.spriteRect.x = 0;

      this.attackHitbox = null;
    }
  }

  createHitbox(){
    if (this.direction === "right") {
      this.attackHitbox = {
        x: this.position.x + this.width + this.HITBOX_OFFSET,
        y: this.position.y + this.height / 2 - this.HITBOX_HEIGHT / 2,
        width: this.HITBOX_WIDTH,
        height: this.HITBOX_HEIGHT
      };
    } else {
      this.attackHitbox = {
        x: this.position.x - this.HITBOX_WIDTH - this.HITBOX_OFFSET,
        y: this.position.y + this.height / 2 - this.HITBOX_HEIGHT / 2,
        width: this.HITBOX_WIDTH,
        height: this.HITBOX_HEIGHT
      };
    }
  }

  draw(ctx){
    super.draw(ctx);

    // DEBUG HITBOX (rojo)
    if (this.attackHitbox) {
      ctx.strokeStyle = "red";
      ctx.strokeRect(
        this.attackHitbox.x,
        this.attackHitbox.y,
        this.attackHitbox.width,
        this.attackHitbox.height
      );
    }
  }

}

export { PlayerBase };
