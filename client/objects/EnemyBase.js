import { AnimatedObject } from "../libs/AnimatedObject.js";
import { hitboxOverlap, randomRange } from "../libs/game_functions.js";
import { Rect } from "../libs/Rect.js";

class EnemyBase extends AnimatedObject {
  constructor(position, config = {}) {
    const {
    //& le decimos al parametro 'config' que es lo que debe tener el config
    //& que le vamos a pasar desde level1 para que tenga una idea de que esperar, es como el this.hp = hp
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
    this.setCollider(140, 65);  //hurtbox
    this.scale = scale;
    this.hp = hp;
    this.damage = damage;
    this.speed = speed;
    this.speedBase = speed;
    this.damageBase = damage;
    //sprites, must have the same name to work
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
    //hitbox data
    this.HITBOX_WIDTH = 60;
    this.HITBOX_HEIGHT = 50;
    this.HITBOX_OFFSET = 70;
    //attack data
    this.attackFrames = 0;
    this.attackDuration = 1000;
    this.attackHitbox = null;
    this.hasHitPlayer = false;  //flag to limit only one hit per swing
  }

  update(player, deltaTime) {  //manage movement, hurtbox, attack
    this.walk(deltaTime);  //movement in x
    this.updateCollider();  //move de hurtbox with the enemy position
    this.attackHitbox = null;  //hitbox not activated

    //attack funtions
    this.shouldAttack(player, deltaTime); // is the player near enough to attack him?
    this.attackPlayer(player);  //my hitbox hit the player hurtbox?
  }

  walk(deltaTime){  //x position 
    this.spriteImage = (this.speed < 0) ? this.spriteRight : this.spriteLeft;
    this.updateAnimation(20);
    this.position.x -= this.speed * deltaTime;
  }

  takeDamage(hit, player) {  //damage made by player, look Playerbase to understand the whole logic
    this.hp -= hit;
    if (this.hp <= 0) {  //TODO hacer el flag de dying para que aparezca la animación
      this.spriteImage = this.spriteDeath;
      this.updateAnimation(500);
      this.hp = 0;
      if (player.lifeSteal){
        player.hp = (player.hp >= player.maxHp) ? player.maxHp : player.hp + 20;
      }
    }
  }

  createHitbox() {  //data hitbox
    this.attackHitbox = {
      x: this.position.x - this.HITBOX_WIDTH - this.HITBOX_OFFSET,
      y: this.position.y - this.HITBOX_HEIGHT * 1.5,
      width: this.HITBOX_WIDTH,
      height: this.HITBOX_HEIGHT,
    };
  }

  shouldAttack(player, deltaTime){  //logic to know when to attack
    //is my hitbox and his hurtbox touhing and is infront of me?
    if (hitboxOverlap(this.collider, player)) {
      this.spriteImage = (this.speed < 0) ? this.attackRight : this.attackLeft;
      this.updateAnimation(20);
      this.createHitbox();  //ememy hitbox to attack
      this.attackFrames += deltaTime;  
      if (this.attackFrames >= this.attackDuration) {  //if enemy already hit the player
        this.attackFrames = 0;  //reset everything
        this.attackHitbox = null;
        this.hasHitPlayer = false;
      }
    } else {  //keep walking
      this.spriteImage = (this.speed < 0) ? this.spriteRight : this.spriteLeft;
      this.updateAnimation(20);
    }
  }

  attackPlayer(player) {  //logic only for attack, apply damage to player
    if (!this.attackHitbox)  //enemy is attacking?
        return;
    if (this.hasHitPlayer)  //one hit per swing
        return;
    if (hitboxOverlap(this.attackHitbox, player)) { 
        this.hasHitPlayer = true;
        player.takeDamage(this.damage);
    }
  }

  bounce(){  //logic to change speed and damage everytime the enemy bounce
    let direction = this.speed > 0 ? -1 : 1;  //change direction
    if (this.isSlowed) this.speed *= 0.2;  //check for lions roar effect
    //random damage after bounce
    let minDamage = this.damage - 3;
    let maxDamage = this.damage + 3;
    this.damage = Math.abs(randomRange(maxDamage - minDamage +1, minDamage));
    if (this.damage < this.damageBase){  //if its damage is smaller than initial
      this.scale = 0.6;  //smaller
      let minSpeed = this.speedBase + 0.1;  //faster
      let maxSpeed = this.speedBase + 0.3;
      this.speed = randomRange(maxSpeed - minSpeed +1, minSpeed);
    } else {  //if its damage is bigger than initial
      this.scale = 1.0;  //bigger
      let minSpeed = this.speedBase - 0.3;  //slower
      let maxSpeed = this.speedBase - 0.1;
      this.speed = randomRange(maxSpeed - minSpeed +1, minSpeed);  //from gamefunctions.js
    }
    this.speed *= direction;  //assign direction
  }

  draw(ctx) {  //draw enemies, attack and death on canvas
    super.draw(ctx);

    //* only to test
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
