import { AnimatedObject } from "../libs/AnimatedObject.js";
import { hitboxOverlap } from "../libs/game_functions.js";
import { Rect } from "../libs/Rect.js";

class EnemyBase extends AnimatedObject {
  constructor(position, config = {}) {
    const {  
    //& le decimos al parametro 'config' que es lo que debe tener el config
    //& que le vamos a pasar desde level1 para que tenga una idea de que esperar, es como el this.hp = hp
    //enemy info  
      hp = 100,
      damage = 20,
      speed = 4,
      scale = 1.0,
    //animation info
      sheetCols = 4,  //same value for all enemies
      frameWidth = 575,  //same value for all enemies
      frameHeight = 608,  //same value for all enemies
      animMinFrame = 0,  //same value for all enemies
      animMaxFrame = 3,  //same value for all enemies 
      animDuration = 200,  //same value for all enemies
    //sprites info
      walkSrc = "",
      attackSrc = "",
      deathSrc = "",
    //hurtbox
      colliderWidth = 140,  //same value for all enemies
      colliderHeight = 65,  //same value for all enemies
    //hitbox
      hitboxWidth = 60,  //same value for all enemies
      hitboxHeight = 50,  //same value for all enemies
      hitboxOffset = 70,  //same value for all enemies
      attackDuration = 300,  //same value for all enemies, miliseconds
    } = config;

    super(position, frameWidth, frameHeight, "white", "enemy", sheetCols);
    this.setCollider(colliderWidth, colliderHeight);  //hurtbox
    this.scale = scale;
    this.hp = hp;
    this.damage = damage;
    this.speed = speed;
    this.damageBase = damage;  //intial damage stored for later

    // Sprites, they must have the same name in order to work
    this.spriteWalk = new Image();
    this.spriteWalk.src = walkSrc;

    this.spriteAttack = new Image();
    this.spriteAttack.src = attackSrc;

    this.spriteDeath = new Image();
    this.spriteDeath.src = deathSrc;

    this.spriteImage = this.spriteWalk;
    this.spriteRect = new Rect(0, 0, frameWidth, frameHeight);
    this.setAnimation(animMinFrame, animMaxFrame, true, animDuration);

    //hitbox
    this.HITBOX_WIDTH = hitboxWidth;
    this.HITBOX_HEIGHT = hitboxHeight;
    this.HITBOX_OFFSET = hitboxOffset;

    //attack data
    this.attackFrames = 0;
    this.attackDuration = attackDuration;
    this.attackHitbox = null;
    this.hitPlayers = new Set();
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
    this.position.x -= this.speed * deltaTime;
  }

  takeDamage(hit) {  //damage made by player, look Playerbase to understand the whole logic
    this.hp -= hit;
    if (this.hp <= 0) {  //TODO hacer el flag de dying para que aparezca la animación
      this.spriteImage = this.spriteDeath;
      this.updateAnimation(500);
      this.hp = 0;
    }
  }

  createHitbox() {  //data hitbox
    this.attackHitbox = {
      x: this.position.x - this.HITBOX_WIDTH - this.HITBOX_OFFSET,
      y: this.position.y - this.HITBOX_HEIGHT / 2,
      width: this.HITBOX_WIDTH,
      height: this.HITBOX_HEIGHT,
    };
  }

  shouldAttack(player, deltaTime){  //logic to know when to attack
    //is my hitbox and his hurtbox touhing and is infront of me?
    if (hitboxOverlap(this.collider, player) && player.position.x < this.position.x) {
      this.spriteImage = this.spriteAttack;  //attack sprite
      this.updateAnimation(2);
      this.createHitbox();  //ememy hitbox to attack
      this.attackFrames += deltaTime;  
      if (this.attackFrames >= this.attackDuration) {  //if enemy already hit the player
        this.attackFrames = 0;  //reset everything
        this.attackHitbox = null;
        this.hitPlayers.clear();
      }
    } else {  //keep walking
      this.spriteImage = this.spriteWalk;
      this.updateAnimation(20);
    }
  }

  attackPlayer(player) {  //logic only for attack, apply damage to player
    if (!enemy.attackHitbox)  //enemy is attacking?
        return;
    if (enemy.hitPlayers.has(player))  //one hit per swing
        return;
    if (hitboxOverlap(enemy.attackHitbox, player)) { 
        enemy.hitPlayers.add(player);
        console.log(`enemy ${enemy} hit player for ${enemy.damage}`);
        player.takeDamage(enemy.damage);
    }
  }

  bounce(){  //logic to change speed and damage everytime the enemy bounce
    let direction = this.speed > 0 ? -1 : 1;  //change direction
    //random damage after bounce
    let minDamage = this.damage - 5;
    let maxDamage = this.damage + 5;
    this.damage = Math.floor(Math.random() * (maxDamage - minDamage + 1)) + minDamage;
    if (this.damage < this.damageBase){  //if its damage is smaller than initial
      this.scale = 0.6;  //smaller
      let minSpeed = Math.abs(this.speed) + 5;  //faster
      let maxSpeed = Math.abs(this.speed) + 10;
      this.speed = Math.floor(Math.random() * (maxSpeed - minSpeed + 1)) + minSpeed;
    } else {  //if its damage is bigger than initial
      this.scale = 1.0;  //bigger
      let minSpeed = Math.abs(this.speed) - 10;  //slower
      let maxSpeed = Math.abs(this.speed) - 5;
      this.speed = Math.floor(Math.random() * (maxSpeed - minSpeed + 1)) + minSpeed;
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
