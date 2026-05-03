/* 
& All enemy mechanics logic, includes:
& movement, attack and take damage. 

^ Note: We recommend installing the Colorful Comments extension to improve code readability 
^ https://marketplace.visualstudio.com/items?itemName=ParthR2031.colorful-comments
^ Color Legend:
    & pink: file description
    * green: section title
    ~ purple: general funtion description
*/

//* === imports ===
import { AnimatedObject } from "../libs/AnimatedObject.js";
import { hitboxOverlap, randomRange } from "../libs/game_functions.js";
import { Rect } from "../libs/Rect.js";

//* === music effect when enemy attacks ===
const enemyAttackSound = new Audio("../Videojuego/assets/music/ataque_leon.wav");
enemyAttackSound.volume = 0.5;

//* === class enemy base ===
class EnemyBase extends AnimatedObject {
  constructor(position, config = {}) {
    // all this data is included in the config object
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

    //mechanics info
    super(position, 200, 200, "white", "enemy", 4);
    this.setCollider(140, 65);
    this.scale = scale;
    this.hp = hp;
    this.damage = damage;
    this.speed = speed;
    this.speedBase = speed;
    this.damageBase = damage;
    
    //sprites
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

    this.spriteImage = this.spriteLeft;
    this.spriteRect = new Rect(0, 0, 575, 608);
    this.setAnimation(0, 3, true, 200);

    //hitbox data
    this.HITBOX_WIDTH = 70;
    this.HITBOX_HEIGHT = 50;
    this.HITBOX_OFFSET = 70;
    this.attackFrames = 0;
    this.attackDuration = 1000;
    this.attackHitbox = null;
    this.isDying = false;
    this.deathTimer = 0;
    this.DEATH_DURATION = 400;
    this.hasHitPlayer = false;  //flag to limit only one hit per swing
    this.isSlowed = false; //lions roar effect
  }

  //* === functions ===
  update(player, deltaTime) {  //~ manage movement, hurtbox, attack
    if (this.hp <= 0) {  // start dying animation...
      this.updateAnimation(deltaTime);
      this.deathTimer += deltaTime;
      if (this.deathTimer >= this.DEATH_DURATION) {  //... then die
        this.isDying = true;
      }
      return;
    }
    this.walk(deltaTime);  //movement in x
    this.updateCollider();  //move de hurtbox with the enemy position
    this.createHitbox();

    //attack funtions
    this.shouldAttack(player, deltaTime); // is the player near enough to attack him?
    this.attackPlayer(player);  //my hitbox hit the player hurtbox?
  }

  walk(deltaTime){  //~ x position 
    let direction = this.speed < 0 ? -1 : 1;  //change direction, the < is to keep the direction of bounce

    if (this.isSlowed) {  //lions roar effect: enemies are slowed
      this.speed = this.speedBase * 0.1 * direction; 
    } else {
      this.speed = this.speedBase * direction;
    }
    this.spriteImage = (this.speed < 0) ? this.spriteRight : this.spriteLeft;  //is the enemy walking to the right or left?
    this.updateAnimation(deltaTime);
    this.position.x -= this.speed * (deltaTime/16);
  }

  takeDamage(hit, player) {  //~ damage made by player, look Playerbase to understand the whole logic
    if (this.hp <= 0) return;  //case1: if is dead, can´t take any more damage either reset the animation (dying animation running)
    this.hp -= hit;
    if (this.hp <= 0) {  // animation of dying logic
      this.hp = 0;
      this.spriteImage = (this.speed < 0) ? this.spriteDeathRight : this.spriteDeathLeft;  //which direction is the enemy dying?
      this.setAnimation(0, 3, false, 100);  //faster and false to not repeat the animation
      if (player.lifeSteal){  //gladiators blood effect: every kill gives hp to player
        player.hp = Math.min(player.hp + 30, player.maxHp);  
      }
    }
  }

  createHitbox() {  //~ hitbox changes depending on direction
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

  shouldAttack(player, deltaTime){  //~ logic to know when to attack
    //is my hitbox and his hurtbox touhing and is in front of me?
    if (hitboxOverlap(this.attackHitbox, player)) {  //start animation
      this.spriteImage = (this.speed < 0) ? this.attackRight : this.attackLeft;
      this.updateAnimation(20);
      this.attackFrames += deltaTime;  
      if (this.attackFrames >= this.attackDuration) {
        this.attackFrames = 0;
        this.attackHitbox = null;  //call the function to make damage
        this.hasHitPlayer = false;
      }
    } else {
      this.spriteImage = (this.speed < 0) ? this.spriteRight : this.spriteLeft;  //which direction is the enemy attacking?
      this.updateAnimation(deltaTime);
    }
  }

  attackPlayer(player) {  //~ make damage logic
    if (!this.attackHitbox)  //there is not a hitbox
        return;
    if (this.hasHitPlayer)  //only one hit per swing
        return;
    if (hitboxOverlap(this.attackHitbox, player)) { 
        this.hasHitPlayer = true;
        player.takeDamage(this.damage);  //player handle the logic
        enemyAttackSound.currentTime = 0;
        //enemyAttackSound.play();
    }
  }

  bounce(){  //~ logic to change speed and damage everytime the enemy bounce
    let direction = this.speed > 0 ? -1 : 1;  //change direction
    //random damage after bounce
    let minDamage = this.damage - 3;
    let maxDamage = this.damage + 3;
    this.damage = Math.abs(randomRange(maxDamage - minDamage +1, minDamage));
    //depending on damage, change scale and speed
    if (this.damage < this.damageBase){
      this.scale = 0.6;
      let minSpeed = this.speedBase + 0.1;
      let maxSpeed = this.speedBase + 0.3;
      this.speedBase = randomRange(maxSpeed - minSpeed + 1, minSpeed);
    }else {
      this.scale = 1.0;
      let minSpeed = this.speedBase - 0.3;
      let maxSpeed = this.speedBase - 0.1;
      this.speedBase = randomRange(maxSpeed - minSpeed + 1, minSpeed);
    }
    this.speed = this.speedBase * direction;
  }
  draw(ctx) {  //~ draw everything enemies do
    super.draw(ctx);
  }
}
//* === exports ===
export { EnemyBase };