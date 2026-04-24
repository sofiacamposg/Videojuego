import { AnimatedObject } from "../libs/AnimatedObject.js";
import { hitboxOverlap, randomRange } from "../libs/game_functions.js";
import { Rect } from "../libs/Rect.js";

// Sonido de ataque del enemigo
const enemyAttackSound = new Audio("./assets/music/ataque_leon.mp3");
enemyAttackSound.volume = 0.5;

class EnemyBase extends AnimatedObject {
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
      deathSrc = "",
    } = config;

    super(position, 200, 200, "white", "enemy", 4);
    this.setCollider(140, 65);
    this.scale = scale;
    this.hp = hp;
    this.damage = damage;
    this.speed = speed;
    this.speedBase = speed;
    this.damageBase = damage;
    this.spriteRight = new Image(); 
    this.spriteRight.src = walkRightSrc;
    this.spriteLeft = new Image(); 
    this.spriteLeft.src = walkLeftSrc;
    this.attackRight = new Image(); 
    this.attackRight.src = attackRightSrc;
    this.attackLeft = new Image(); 
    this.attackLeft.src = attackLeftSrc;
    this.spriteDeath = new Image();
    this.spriteDeath.src = deathSrc;

    this.spriteImage = this.spriteLeft;
    this.spriteRect = new Rect(0, 0, 575, 608);
    this.setAnimation(0, 3, true, 200);
    this.HITBOX_WIDTH = 60;
    this.HITBOX_HEIGHT = 50;
    this.HITBOX_OFFSET = 70;
    this.attackFrames = 0;
    this.attackDuration = 1000;
    this.attackHitbox = null;
    this.hasHitPlayer = false;
  }

  update(player, deltaTime) {
    this.walk(deltaTime);
    this.updateCollider();
    this.attackHitbox = null;
    this.shouldAttack(player, deltaTime);
    this.attackPlayer(player);
  }

  walk(deltaTime){
    this.spriteImage = (this.speed < 0) ? this.spriteRight : this.spriteLeft;
    this.updateAnimation(20);
    this.position.x -= this.speed * deltaTime;
  }

  takeDamage(hit, player) {
    this.hp -= hit;
    if (this.hp <= 0) {
      this.spriteImage = this.spriteDeath;
      this.updateAnimation(500);
      this.hp = 0;
      if (player.lifeSteal){
        player.hp = (player.hp >= player.maxHp) ? player.maxHp : player.hp + 20;
      }
    }
  }

  createHitbox() {
    this.attackHitbox = {
      x: this.position.x - this.HITBOX_WIDTH - this.HITBOX_OFFSET,
      y: this.position.y - this.HITBOX_HEIGHT * 1.5,
      width: this.HITBOX_WIDTH,
      height: this.HITBOX_HEIGHT,
    };
  }

  shouldAttack(player, deltaTime){
    if (hitboxOverlap(this.collider, player)) {
      this.spriteImage = (this.speed < 0) ? this.attackRight : this.attackLeft;
      this.updateAnimation(20);
      this.createHitbox();
      this.attackFrames += deltaTime;  
      if (this.attackFrames >= this.attackDuration) {
        this.attackFrames = 0;
        this.attackHitbox = null;
        this.hasHitPlayer = false;
      }
    } else {
      this.spriteImage = (this.speed < 0) ? this.spriteRight : this.spriteLeft;
      this.updateAnimation(20);
    }
  }

  attackPlayer(player) {
    if (!this.attackHitbox)
        return;
    if (this.hasHitPlayer)
        return;
    if (hitboxOverlap(this.attackHitbox, player)) { 
        this.hasHitPlayer = true;
        player.takeDamage(this.damage);
        enemyAttackSound.currentTime = 0;
        enemyAttackSound.play();
    }
  }

  bounce(){
    let direction = this.speed > 0 ? -1 : 1;
    if (this.isSlowed) this.speed *= 0.2;
    let minDamage = this.damage - 3;
    let maxDamage = this.damage + 3;
    this.damage = Math.abs(randomRange(maxDamage - minDamage +1, minDamage));
    if (this.damage < this.damageBase){
      this.scale = 0.6;
      let minSpeed = this.speedBase + 0.1;
      let maxSpeed = this.speedBase + 0.3;
      this.speed = randomRange(maxSpeed - minSpeed +1, minSpeed);
    } else {
      this.scale = 1.0;
      let minSpeed = this.speedBase - 0.3;
      let maxSpeed = this.speedBase - 0.1;
      this.speed = randomRange(maxSpeed - minSpeed +1, minSpeed);
    }
    this.speed *= direction;
  }

  draw(ctx) {
    super.draw(ctx);

    if (this.attackHitbox) {
      ctx.strokeStyle = "blue";
      ctx.strokeRect(
        this.attackHitbox.x,
        this.attackHitbox.y,
        this.attackHitbox.width,
        this.attackHitbox.height
      );
    }
  }
}

export { EnemyBase };