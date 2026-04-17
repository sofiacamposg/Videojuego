import { AnimatedObject } from "../libs/AnimatedObject.js";
import { hitboxOverlap } from "../libs/game_functions.js";
import { Rect } from "../libs/Rect.js";

class PlayerBase extends AnimatedObject {  
  constructor(position, config = {}) {
    const {
    //& le decimos al parametro 'config' que es lo que debe tener el config
    //& que le vamos a pasar desde level1 para que tenga una idea de que esperar, es como el this.hp = hp
        hp = 100,
        maxHp = 100,
        speed = 5,
        damage = 20,
        walkRightSrc = "",
        walkLeftSrc = "",
        jumpRightSrc = "",
        jumpLeftSrc = "",
        attackRightSrc = "",
        attackLeftSrc = "",
    } = config;

    super(position, 160, 160, "white", "player", 4);
    this.setCollider(75, 130);  //hurtbox 
    this.direction = "right";

    this.hp = hp;
    this.maxHp = maxHp;
    this.speed = speed;
    this.damage = damage;

    this.setAnimation(0, 3, true, 200); 
    this.velocityY = 0;
    this.gravity = 0.8;
    this.jumpStrength = -14;
    this.isOnGround = true;
    this.isMoving = false;
    //sprites, must have the same name to work
    this.spriteRight = new Image(); 
    this.spriteRight.src = walkRightSrc;
    this.spriteLeft = new Image(); 
    this.spriteLeft.src = walkLeftSrc;
    this.spriteJumpRight = new Image(); 
    this.spriteJumpRight.src = jumpRightSrc;
    this.spriteJumpLeft = new Image(); 
    this.spriteJumpLeft.src = jumpLeftSrc;
    this.attackRight = new Image(); 
    this.attackRight.src = attackRightSrc;
    this.attackLeft = new Image(); 
    this.attackLeft.src = attackLeftSrc;

    this.spriteImage = this.spriteRight;
    this.spriteRect = new Rect(0, 0, 434, 470);

    // attack state
    this.playeratack = false;
    this.attackFrames = 0;
    this.attackDuration = 10;
    this.HITBOX_WIDTH = 50;
    this.HITBOX_HEIGHT = 100;
    this.range = 1;  //colosseums fury effect
    this.HITBOX_OFFSET = -15;
    this.hitEnemies = new Set();

    // card system
    this.canJump = true;  //chains ceaser effect
    this.invincible = false;  //divine shield effect
    this.lifeSteal = false;  //gladiators blood effect
    this.doubleDeathPenalty = false;  //senates judgement effect
    this.hearts = 5;
    this.maxHearts = 5;
  }

  update(goLeft, goRight, jumpPressed, platforms, groundY, deltaTime){  //manage movement, hurtbox, attack
    this.isMoving = false;
    this.walk(goLeft, goRight, deltaTime);
    this.jump(jumpPressed);
    this.applyGravity();
    this.checkPlatforms(platforms, groundY);
    this.updateCollider();

    //sprites depending on status (jump, walk, attack, ...)
    if (!this.isOnGround) {

      // SALTO
      this.spriteImage = (this.direction === "right") ? this.spriteJumpRight : this.spriteJumpLeft;
      this.updateAnimation(20);
      this.attackHitbox = null;
    } else if (this.playeratack) {
      //case 2: attack (only on the ground)
      this.spriteImage = (this.direction === "right") ? this.attackRight : this.attackLeft;
      this.updateAnimation(20);
      this.createHitbox();  //hitbox to attack
      this.attackFrames++;
      if (this.attackFrames >= this.attackDuration) {  //reset to default 
        this.playeratack = false;
        this.attackFrames = 0;
        this.attackHitbox = null;  //turn off hitbox
        this.hitEnemies.clear();  //clean "hitbox" to accept enemies again
      }
    } else if (this.isMoving) {

      // CAMINAR
      this.spriteImage = (this.direction === "right") ? this.spriteRight : this.spriteLeft;
      this.updateAnimation(20);
      this.attackHitbox = null;
    } else {

      // QUIETO
      this.spriteImage = (this.direction === "right") ? this.spriteRight : this.spriteLeft;
      this.frame = 0;  //returns variable to 0
      if (this.spriteRect) this.spriteRect.x = 0;  //returns image to initial frame (reset)

      this.attackHitbox = null;
    }
  };

  walk(goLeft, goRight, deltaTime){  //x position
    if (goLeft && !goRight) {  //case 1: only left keys are pressed
        this.position.x -= this.speed * deltaTime;
        this.isMoving = true;
        this.direction = "left";
    } else if (goRight && !goLeft) {  //case 2: only right keys are pressed
        this.position.x += this.speed * deltaTime;
        this.isMoving = true;
        this.direction = "right";
    }
  }

  jump(jumpPressed){  //jump logic
    if (jumpPressed && this.isOnGround && this.canJump){ //player meets all requirements
        this.velocityY = this.jumpStrength;
        this.isOnGround = false;
    }
  }

  applyGravity(){  //gravity parameters
    this.velocityY += this.gravity;
    this.position.y += this.velocityY;
  }

  checkPlatforms(platforms, groundY){  //check colision between player and platform
    this.isOnGround = false;
    platforms.forEach(p => {
        let isFalling = this.velocityY >= 0;
        let prevY = this.position.y - this.velocityY;
        let withinX =
            this.position.x + this.halfSize.x > p.x &&
            this.position.x - this.halfSize.x < p.x + p.width;
        let crossingTop = prevY <= p.y && this.position.y >= p.y;
        if (isFalling && withinX && crossingTop) {
            this.position.y = p.y;
            this.velocityY = 0;
            this.isOnGround = true;
        }
    });
    if (this.position.y >= groundY){ //fixed ground level
        this.position.y = groundY;
        this.velocityY = 0;
        this.isOnGround = true;
    }
  }
  
  takeDamage(hit){  //damage made by enemy, look EnemyBase to understand the whole logic
    if (this.invincible){
      this.invincible = false;
      return;
    }
    this.hp -= hit;
    if (this.hp <= 0) {
      if (this.doubleDeathPenalty) {  //senates judgment effect
        this.hearts -= 2;
        this.doubleDeathPenalty = false;
      } else {
        this.hearts--;
      }
      if (this.hearts > 0) {
        this.hp = this.maxHp;  //reset hp for next heart
      } else {
        this.hp = 0;  //dead
      }
    }
  }

  attackEnemy(enemies){
    if (!this.playeratack || !this.attackHitbox) //"player is attacking?"
            return;  
        enemies.forEach(enemy => {
            if (this.hitEnemies.has(enemy))  //single attack doesnt hit the same enemy more than once
                return;  
            if (hitboxOverlap(this.attackHitbox, enemy)) {
                this.hitEnemies.add(enemy);
                enemy.takeDamage(this.damage, this);
            }
        });
  }

  createHitbox(){  //data hitbox, left/right
    if (this.direction === "right") {
      this.attackHitbox = {
        x: this.position.x + this.halfSize.x + this.HITBOX_OFFSET,
        y: this.position.y - this.HITBOX_HEIGHT * 1.2,
        width: this.HITBOX_WIDTH * this.range,  //to increase range if colosseums fury is active
        height: this.HITBOX_HEIGHT
      };
    } else {
      this.attackHitbox = {
        x: this.position.x - this.halfSize.x - (this.HITBOX_WIDTH * this.range) - this.HITBOX_OFFSET,
        y: this.position.y - this.HITBOX_HEIGHT * 1.2,
        width: this.HITBOX_WIDTH * this.range,
        height: this.HITBOX_HEIGHT
      };
    }
  };

  draw(ctx){  //draw player, attack, jump and death on canvas
    super.draw(ctx)
    //* only to test
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
};
export { PlayerBase }; 
