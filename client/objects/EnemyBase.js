//Inherits from Animated Object
import { AnimatedObject } from "../libs/AnimatedObject.js";
import { hitboxOverlap } from "../libs/game_functions.js";
class EnemyBase extends AnimatedObject {

  constructor(position, hp = 100, damage = 20, speed = 4){
    super(position,200,200,"white","enemy",4)
    this.setCollider(140, 65);
    this.hp = hp;
    this.damage = damage;
    this.speed = speed;
    //HITBOX
    this.HITBOX_WIDTH = 60;  //range
    this.HITBOX_HEIGHT = 50; 
    this.HITBOX_OFFSET = 70;  
    //attack
    this.playeratack = false;  //default attack state
    this.attackFrames = 0;  //frames counter
    this.attackDuration = 10;  //frames the attack lasts
    this.hitPlayers = new Set();  //tracks player already hit in this attack swing  $
  }

  update(player){
    this.updateCollider();
    // movement
    this.updateAnimation(20);
    this.attackHitbox = null;

    //attack
    if (hitboxOverlap(this.collider, player) && player.position.x < this.position.x){ 
      this.spriteImage = this.spriteAttack;
      this.updateAnimation(2);
      this.createHitbox();  //hitbox to attack
      this.attackFrames++;
      if (this.attackFrames >= this.attackDuration) {  //reset to default 
        this.playeratack = false;
        this.attackFrames = 0;
        this.attackHitbox = null;  //turn off hitbox
        this.hitPlayers.clear();  //clean "hitbox" to accept enemies again
      }
    } else {
      this.spriteImage = this.spriteWalk;
    }
  }

  createHitbox(){
      this.attackHitbox = {
        x: this.position.x - this.HITBOX_WIDTH - this.HITBOX_OFFSET,
        y: this.position.y - this.HITBOX_HEIGHT / 2,
        width: this.HITBOX_WIDTH,
        height: this.HITBOX_HEIGHT
      };
  };

  takeDamage(hit){
    this.hp -= hit;
    if (this.hp <= 0) {
      this.spriteImage = this.spriteDeath;  //TODO setanmation
      this.updateAnimation(500);
      this.hp = 0;
    }
  }

  draw(ctx){
    super.draw(ctx)

     // DEBUG HITBOX (rojo)
    if (this.attackHitbox){
      ctx.strokeStyle = "blue";
      ctx.strokeRect(
      this.attackHitbox.x,
      this.attackHitbox.y,
      this.attackHitbox.width,
      this.attackHitbox.height);
    }
  }

}
export { EnemyBase }; 