/* 
& All player mechanics logic, includes:
& movement, attack and take damage, lives. 

^ Note: We recommend installing the Colorful Comments extension to improve code readability 
^ https://marketplace.visualstudio.com/items?itemName=ParthR2031.colorful-comments
^ Color Legend:
    & pink: file description
    * green: section title
    ~ purple: general funtion description
*/

//* === imports ===
import { AnimatedObject } from "../libs/AnimatedObject.js";
import { hitboxOverlap } from "../libs/game_functions.js";
import { Rect } from "../libs/Rect.js";

//* === class player base ===
class PlayerBase extends AnimatedObject {  
  constructor(position, config = {}) {
    const {
    // all this data is included in the config object
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

    super(position, 160, 160, "white", "this", 4);
    this.setCollider(75, 130);  //hurtbox 
    this.setAnimation(0, 3, true, 200); 

    //mechanics info
    this.direction = "right";
    this.hp = hp;
    this.maxHp = maxHp;
    this.speed = speed;
    this.damage = damage;
    this.fame = 0; //"coins" to buy upgrades in the game
    this.velocityY = 0;
    this.gravity = 0.0028; // px/ms² 
    this.jumpStrength = -0.84; // px/ms
    this.isOnGround = true;
    this.isMoving = false;

    //sprites, must have the same name between all configs to work
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
    //hitbox platform colission
    this.hitbox = {
        width: 35,  
        height: 80   
    };
    this.HITBOX_WIDTH = 50;
    this.HITBOX_HEIGHT = 100;
    this.HITBOX_OFFSET = -15;
    this.hitEnemies = new Set();  //only can hit one time each enemy per swing

    // card system
    this.canJump = true;  // ceasar chains effect
    this.invincible = false;  //take the next hit without damage
    this.hearts = 5;
    this.maxHearts = 5;
    this.range = 1;
    this.doubleDeath = false;
    this.cardCostHP = false;
  }

  //* === functions ===
  update(goLeft, goRight, jumpPressed, platforms, groundY, deltaTime){  //~ manage movement, hurtbox, attack
    this.isMoving = false;
    this.walk(goLeft, goRight, deltaTime);
    this.jump(jumpPressed);
    this.applyGravity(deltaTime);
    this.checkPlatforms(platforms, groundY, deltaTime);
    this.updateCollider();

    //~ sprites depending on status (jump, walk, attack, ...)
    if (!this.isOnGround) {
      //case 1: jump (no attack allowed in the air)
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
      //case 3: walk
      this.spriteImage = (this.direction === "right") ? this.spriteRight : this.spriteLeft;
      this.updateAnimation(20);
      this.attackHitbox = null;
    } else {
      //case 4: stay
      this.spriteImage = (this.direction === "right") ? this.spriteRight : this.spriteLeft;
      this.frame = 0;  //returns variable to 0
      if (this.spriteRect) this.spriteRect.x = 0;  //returns image to initial frame (reset)

      this.attackHitbox = null;
    }
  };

  walk(goLeft, goRight, deltaTime){  //~ x position
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

  jump(jumpPressed){  //~ jump logic
    if (jumpPressed && this.isOnGround && this.canJump){ //this meets all requirements
        this.velocityY = this.jumpStrength;
        this.isOnGround = false;
    }
  }

  applyGravity(deltaTime){  //~ gravity parameters
    this.velocityY += this.gravity * deltaTime;
    this.position.y += this.velocityY *deltaTime;
  }
  
  checkPlatforms(platforms, groundY, deltaTime){  //~ check colision between player and platform
    //Platform collision
    this.isOnGround = false;
    platforms.forEach(p => {
        let playerBottom = this.position.y + this.hitbox.height / 2;
        let prevBottom = (this.position.y - this.velocityY * deltaTime) + this.hitbox.height / 2;
        let isFalling = this.velocityY >= 0;

        let footOffset = 20;
        let withinX =
            this.position.x + this.halfSize.x - footOffset > p.x &&
            this.position.x - this.halfSize.x + footOffset < p.x + p.width;

        let crossingTop =
            prevBottom <= p.y &&
            playerBottom >= p.y;

        if (isFalling && withinX && crossingTop) {
            this.position.y = p.y - this.hitbox.height / 2;
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
  
  takeDamage(hit){  //~ damage made by enemy, look EnemyBase to understand the whole logic
    if (this.invincible) {   // case1: divine shield effect: next hit does not make damage
      this.invincible = false; 
      return; 
    }  
    this.hp -= hit;
    if (this.hp <= 0) {
      if (this.doubleDeath) { // case2: senates judgment effect: next death cost 2 hearts
        this.hearts -= 1; 
        this.doubleDeath = false; 
      }  
      this.hearts--;  //case3: lose a heart
      if (this.hearts > 0) {
        this.hp = this.maxHp;  //reset hp for next heart
      } else {
        this.hp = 0;  //case4: dead
      }
    }
  }

  attackEnemy(enemies){  //~ make damage to enemies
    if (!this.playeratack || !this.attackHitbox) //player is attacking?
            return;  
        enemies.forEach(enemy => {
            if (this.hitEnemies.has(enemy))  //single attack, doesnt hit the same enemy more than once
                return;  
            if (hitboxOverlap(this.attackHitbox, enemy)) { //did player touch the enemy hurtbox?
                this.hitEnemies.add(enemy);
                enemy.takeDamage(this.damage, this);  // enemy manage take damage logic
            }
        });
  }

  createHitbox(){  //~ data hitbox, change position depending on direction (left/right)
    if (this.direction === "right") {
      this.attackHitbox = {
        x: (this.position.x + this.halfSize.x + this.HITBOX_OFFSET),
        y: this.position.y - this.HITBOX_HEIGHT * 1.2,
        width: this.HITBOX_WIDTH * this.range,
        height: this.HITBOX_HEIGHT
      };
    } else {
      this.attackHitbox = {
        x: (this.position.x - this.halfSize.x - this.HITBOX_WIDTH - this.HITBOX_OFFSET),
        y: this.position.y - this.HITBOX_HEIGHT * 1.2,
        width: this.HITBOX_WIDTH * this.range,  // colloseums fury: range of hitbox increase for 8 sec
        height: this.HITBOX_HEIGHT
      };
    }
  };

  draw(ctx){  //~ draw plyer, attack, jump and death on canvas
    super.draw(ctx)
  }
};

//* === exports ===
export { PlayerBase }; 
