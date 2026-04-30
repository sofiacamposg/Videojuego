//& EnemyBase.js
//& Base class for all enemies in the game — handles movement, attacking, taking damage,
//& death animation, and the bounce mechanic that randomizes speed and damage on wall hits

import { AnimatedObject } from "../libs/AnimatedObject.js";
import { hitboxOverlap, randomRange } from "../libs/game_functions.js";
import { Rect } from "../libs/Rect.js";

// enemy attack sound played when the enemy hits the player
const enemyAttackSound = new Audio("./assets/music/ataque_leon.wav");
enemyAttackSound.volume = 0.5;

class EnemyBase extends AnimatedObject {
  //* initializes the enemy with stats and sprites from the level config
  constructor(position, config = {}) {
    const {
      hp = 100,
      damage = 20,
      speed = 4,
      scale = 1.0,
      walkRightSrc = "",
      walkLeftSrc = "",
      attackRightSrc = "",
      attackLeftSrc = "",
      deathLeftSrc = "",
      deathRightSrc = "",
    } = config;

    super(position, 200, 200, "white", "enemy", 4);
    this.setCollider(140, 65);
    this.scale = scale;
    this.hp = hp;
    this.damage = damage;
    this.speed = speed;
    this.speedBase = speed;    // base speed saved for bounce calculations
    this.damageBase = damage;  // base damage saved for bounce calculations

    // load all sprite images from config paths
    this.spriteRight = new Image(); 
    this.spriteRight.src = walkRightSrc;
    this.spriteLeft = new Image(); 
    this.spriteLeft.src = walkLeftSrc;
    this.attackRight = new Image(); 
    this.attackRight.src = attackRightSrc;
    this.attackLeft = new Image(); 
    this.attackLeft.src = attackLeftSrc;
    this.spriteDeathLeft = new Image();
    this.spriteDeathLeft.src = deathLeftSrc;
    this.spriteDeathRight = new Image();
    this.spriteDeathRight.src = deathRightSrc;

    this.spriteImage = this.spriteLeft;  // default facing left
    this.spriteRect = new Rect(0, 0, 575, 608);
    this.setAnimation(0, 3, true, 200);

    //? hitbox configuration
    this.HITBOX_WIDTH = 70;
    this.HITBOX_HEIGHT = 50;
    this.HITBOX_OFFSET = 70;
    this.attackFrames = 0;
    this.attackDuration = 1000;  // ms before the attack resets
    this.attackHitbox = null;
    this.isDying = false;
    this.deathTimer = 0;
    this.DEATH_DURATION = 400;   // ms the death animation plays before removing the enemy
    this.hasHitPlayer = false;   // flag to limit only one hit per swing
    this.isSlowed = false;       // lions roar card effect
  }

  //* main update loop — handles death animation or normal movement and attack each frame
  update(player, deltaTime) {
    //? if dead, play death animation and mark for removal after duration
    if (this.hp <= 0) {
      this.updateAnimation(deltaTime);
      this.deathTimer += deltaTime;
      if (this.deathTimer >= this.DEATH_DURATION) {
        this.isDying = true;  // signals levelBase to remove this enemy
      }
      return;
    }

    //? normal update — move, reposition collider, create hitbox and check attacks
    this.walk(deltaTime);
    this.updateCollider();
    this.createHitbox();
    this.shouldAttack(player, deltaTime);  // is the player close enough to attack?
    this.attackPlayer(player);             // did the hitbox overlap the player hurtbox?
  }

  //* moves the enemy horizontally based on speed and applies the slowed effect if active
  walk(deltaTime){
    let direction = this.speed < 0 ? -1 : 1;  // preserve direction through bounce

    //? lions roar card effect — reduce speed to 10% while slowed
    if (this.isSlowed) {
      this.speed = this.speedBase * 0.1 * direction; 
    } else {
      this.speed = this.speedBase * direction;
    }

    // face the correct direction based on movement
    this.spriteImage = (this.speed < 0) ? this.spriteRight : this.spriteLeft;
    this.updateAnimation(deltaTime);
    this.position.x -= this.speed * (deltaTime/16);
  }

  //* applies damage to the enemy and triggers death if HP reaches 0
  takeDamage(hit, player) {
    if (this.hp <= 0) return;  // already dead, ignore further damage
    this.hp -= hit;

    //? death — switch to death sprite and trigger non-looping animation
    if (this.hp <= 0) {
      this.hp = 0;
      this.spriteImage = (this.speed < 0) ? this.spriteDeathRight : this.spriteDeathLeft;
      this.setAnimation(0, 3, false, 100);  // faster, non-looping death animation

      //? gladiators blood card effect — restore HP on kill
      if (player.lifeSteal){
        player.hp = Math.min(player.hp + 30, player.maxHp);  
      }
    }
  }

  //* creates the attack hitbox in front of the enemy based on which direction it faces
  createHitbox() {
    const facingRight = this.speed < 0;
    this.attackHitbox = {
      x: facingRight
        ? this.position.x + this.HITBOX_OFFSET
        : this.position.x - this.HITBOX_WIDTH - this.HITBOX_OFFSET,
      y: this.position.y - this.HITBOX_HEIGHT * 1.5,
      width: this.HITBOX_WIDTH,
      height: this.HITBOX_HEIGHT,
    };
  }

  //* checks if the player is within attack range and switches to attack animation if so
  shouldAttack(player, deltaTime){
    //? player is in range — switch to attack sprite and count attack frames
    if (hitboxOverlap(this.attackHitbox, player)) {
      this.spriteImage = (this.speed < 0) ? this.attackRight : this.attackLeft;
      this.updateAnimation(20);
      this.attackFrames += deltaTime;

      //? attack cooldown finished — reset so the enemy can hit again
      if (this.attackFrames >= this.attackDuration) {
        this.attackFrames = 0;
        this.attackHitbox = null;
        this.hasHitPlayer = false;
      }
    } else {
      //? player out of range — return to walk animation
      this.spriteImage = (this.speed < 0) ? this.spriteRight : this.spriteLeft;
      this.updateAnimation(deltaTime);
    }
  }

  //* applies damage to the player if the attack hitbox overlaps their hurtbox
  //* hasHitPlayer ensures only one hit per swing
  attackPlayer(player) {
    if (!this.attackHitbox) return;   // no active hitbox
    if (this.hasHitPlayer) return;    // already hit this swing
    if (hitboxOverlap(this.attackHitbox, player)) { 
        this.hasHitPlayer = true;
        player.takeDamage(this.damage);
        enemyAttackSound.currentTime = 0;
        //enemyAttackSound.play();
    }
  }

  //* randomizes speed and damage when the enemy bounces off a world boundary
  //* faster enemies get slightly weaker, slower ones get slightly stronger
  bounce(){
    let direction = this.speed > 0 ? -1 : 1;  // flip direction on bounce

    //? randomize damage within a small range
    let minDamage = this.damage - 3;
    let maxDamage = this.damage + 3;
    this.damage = Math.abs(randomRange(maxDamage - minDamage + 1, minDamage));

    //? if damage dropped below base — enemy is weaker, make it faster and smaller
    if (this.damage < this.damageBase){
      this.scale = 0.6;
      let minSpeed = this.speedBase + 0.1;
      let maxSpeed = this.speedBase + 0.3;
      this.speedBase = randomRange(maxSpeed - minSpeed + 1, minSpeed);
    } else {
      //? if damage is at or above base — enemy is stronger, make it slower and normal size
      this.scale = 1.0;
      let minSpeed = this.speedBase - 0.3;
      let maxSpeed = this.speedBase - 0.1;
      this.speedBase = randomRange(maxSpeed - minSpeed + 1, minSpeed);
    }
    this.speed = this.speedBase * direction;
  }

  //* delegates drawing to the parent AnimatedObject class
  draw(ctx) {
    super.draw(ctx);
  }
}
export { EnemyBase };