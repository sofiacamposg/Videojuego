//& PlayerBase.js
//& Base class for the player character — handles movement, jumping, gravity,
//& platform collision, attacking, taking damage, and all card effect properties

import { AnimatedObject } from "../libs/AnimatedObject.js";
import { hitboxOverlap } from "../libs/game_functions.js";
import { Rect } from "../libs/Rect.js";

class PlayerBase extends AnimatedObject {  

  //* initializes the player with stats and sprites from the selected archetype config
  constructor(position, config = {}) {
    // destructure config with defaults — these get overridden by the archetype values from the API
    const {
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
    this.setCollider(75, 130);  // hurtbox — smaller than sprite so hits feel fair
    this.direction = "right";

    //? base stats from archetype
    this.hp = hp;
    this.maxHp = maxHp;
    this.speed = speed;
    this.damage = damage;
    this.fame = 0;  // accumulated fame used to buy upgrades in the shop

    //? physics setup
    this.setAnimation(0, 3, true, 200); 
    this.velocityY = 0;
    this.gravity = 0.0028;     // px/ms² — compatible with deltaTime in ms
    this.jumpStrength = -0.84; // px/ms — negative because Y increases downward
    this.isOnGround = true;
    this.isMoving = false;

    //? load all sprite images from config paths
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

    this.spriteImage = this.spriteRight;  // default facing right
    this.spriteRect = new Rect(0, 0, 434, 470);

    //? attack state tracking
    this.playeratack = false;
    this.attackFrames = 0;
    this.attackDuration = 10;  // frames the attack lasts

    //? platform collision hitbox — separate from the hurtbox
    this.hitbox = {
        width: 35,  
        height: 80   
    };

    //? attack hitbox dimensions
    this.HITBOX_WIDTH = 50;
    this.HITBOX_HEIGHT = 100;
    this.HITBOX_OFFSET = -15;
    this.hitEnemies = new Set();  // tracks which enemies were hit in the current swing

    //? card effect properties — modified by card effects during the run
    this.canJump = true;       // chains of caesar disables this
    this.invincible = false;   // divine shield sets this to true
    this.hearts = 5;           // current lives
    this.maxHearts = 5;        // max lives
    this.range = 1;            // attack range multiplier — colosseum's fury increases this
    this.doubleDeath = false;  // senate's judgment — lose 2 hearts on death
    this.cardCostHP = false;   // hunger of the plebs — using a card costs half a heart
  }

  //* main update loop — handles movement, sprite selection and attack state each frame
  update(goLeft, goRight, jumpPressed, platforms, groundY, deltaTime){
    this.isMoving = false;
    this.walk(goLeft, goRight, deltaTime);
    this.jump(jumpPressed);
    this.applyGravity(deltaTime);
    this.checkPlatforms(platforms, groundY, deltaTime);
    this.updateCollider();

    //? select the correct sprite based on current player state
    if (!this.isOnGround) {
      //? case 1: in the air — show jump sprite, no attacking allowed
      this.spriteImage = (this.direction === "right") ? this.spriteJumpRight : this.spriteJumpLeft;
      this.updateAnimation(20);
      this.attackHitbox = null;

    } else if (this.playeratack) {
      //? case 2: attacking on the ground — show attack sprite and create hitbox
      this.spriteImage = (this.direction === "right") ? this.attackRight : this.attackLeft;
      this.updateAnimation(20);
      this.createHitbox();
      this.attackFrames++;
      if (this.attackFrames >= this.attackDuration) {  // attack animation finished
        this.playeratack = false;
        this.attackFrames = 0;
        this.attackHitbox = null;   // disable hitbox
        this.hitEnemies.clear();    // reset hit tracking for next swing
      }

    } else if (this.isMoving) {
      //? case 3: walking — show walk sprite
      this.spriteImage = (this.direction === "right") ? this.spriteRight : this.spriteLeft;
      this.updateAnimation(20);
      this.attackHitbox = null;

    } else {
      //? case 4: idle — show first frame of walk sprite
      this.spriteImage = (this.direction === "right") ? this.spriteRight : this.spriteLeft;
      this.frame = 0;  // reset to first frame
      if (this.spriteRect) this.spriteRect.x = 0;  // reset spritesheet position
      this.attackHitbox = null;
    }
  };

  //* moves the player left or right based on key input and updates direction
  walk(goLeft, goRight, deltaTime){
    //? case 1: only left keys pressed
    if (goLeft && !goRight) {
        this.position.x -= this.speed * deltaTime;
        this.isMoving = true;
        this.direction = "left";
    //? case 2: only right keys pressed
    } else if (goRight && !goLeft) {
        this.position.x += this.speed * deltaTime;
        this.isMoving = true;
        this.direction = "right";
    }
  }

  //* triggers a jump if the player is on the ground and jumping is allowed
  jump(jumpPressed){
    if (jumpPressed && this.isOnGround && this.canJump){
        this.velocityY = this.jumpStrength;  // launch upward
        this.isOnGround = false;
    }
  }

  //* applies gravity each frame — accelerates the player downward over time
  applyGravity(deltaTime){
    this.velocityY += this.gravity * deltaTime;
    this.position.y += this.velocityY * deltaTime;
  }
  
  //* checks collision between the player and all platforms and the ground
  checkPlatforms(platforms, groundY, deltaTime){
    this.isOnGround = false;

    platforms.forEach(p => {
        let playerBottom = this.position.y + this.hitbox.height / 2;
        let prevBottom = (this.position.y - this.velocityY * deltaTime) + this.hitbox.height / 2;
        let isFalling = this.velocityY >= 0;

        let footOffset = 20;  // narrows the foot area to avoid catching edges

        //? check if player feet are horizontally within the platform
        let withinX =
            this.position.x + this.halfSize.x - footOffset > p.x &&
            this.position.x - this.halfSize.x + footOffset < p.x + p.width;

        //? check if player crossed the top surface of the platform this frame
        let crossingTop =
            prevBottom <= p.y &&
            playerBottom >= p.y;

        //? land on platform if falling and crossing its top edge
        if (isFalling && withinX && crossingTop) {
            this.position.y = p.y - this.hitbox.height / 2;
            this.velocityY = 0;
            this.isOnGround = true;
        }
    });

    //? fixed ground level — clamp player Y so they can't fall through the floor
    if (this.position.y >= groundY){
        this.position.y = groundY;
        this.velocityY = 0;
        this.isOnGround = true;
    }
  }
  
  //* applies damage to the player — handles card effects that modify how damage works
  takeDamage(hit){
    //? divine shield — absorb the hit and disable invincibility
    if (this.invincible) { this.invincible = false; return; }

    this.hp -= hit;

    if (this.hp <= 0) {
      //? senate's judgment — lose an extra heart on death
      if (this.doubleDeath) { this.hearts -= 1; this.doubleDeath = false; }

      this.hearts--;  // lose one heart

      //? still has hearts — reset HP for the next heart
      if (this.hearts > 0) {
        this.hp = this.maxHp;
      } else {
        //? no hearts left — fully dead, game over will trigger
        this.hp = 0;
      }
    }
  }

  //* checks if the player's attack hitbox overlaps any enemy and deals damage
  //* hitEnemies set prevents hitting the same enemy twice in one swing
  attackEnemy(enemies){
    if (!this.playeratack || !this.attackHitbox) return;  // not attacking

    enemies.forEach(enemy => {
        if (this.hitEnemies.has(enemy)) return;  // already hit this enemy this swing
        if (hitboxOverlap(this.attackHitbox, enemy)) {
            this.hitEnemies.add(enemy);
            enemy.takeDamage(this.damage, this);
        }
    });
  }

  //* creates the attack hitbox in front of the player based on facing direction
  //* range property scales the width — modified by colosseum's fury card
  createHitbox(){
    //? facing right — hitbox extends to the right
    if (this.direction === "right") {
      this.attackHitbox = {
        x: (this.position.x + this.halfSize.x + this.HITBOX_OFFSET),
        y: this.position.y - this.HITBOX_HEIGHT * 1.2,
        width: this.HITBOX_WIDTH * this.range,
        height: this.HITBOX_HEIGHT
      };
    //? facing left — hitbox extends to the left
    } else {
      this.attackHitbox = {
        x: (this.position.x - this.halfSize.x - this.HITBOX_WIDTH - this.HITBOX_OFFSET),
        y: this.position.y - this.HITBOX_HEIGHT * 1.2,
        width: this.HITBOX_WIDTH * this.range,
        height: this.HITBOX_HEIGHT
      };
    }
  };

  //* delegates drawing to the parent AnimatedObject class
  draw(ctx){
    super.draw(ctx);
  }
};
export { PlayerBase };