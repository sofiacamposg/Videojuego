import { hitboxOverlap } from "../libs/game_functions.js";
import { AnimatedObject } from "../libs/AnimatedObject.js";
import { Rect } from "../libs/Rect.js";
import { Vector } from "../libs/Vector.js";

const fireSound = new Audio("./assets/music/fire.mp3");
fireSound.volume = 0.5;

class HazardBase extends AnimatedObject {
    constructor(x, y, w, h) {
        super(new Vector(x + w/2, y + h), w, h, "transparent", "hazard", 2);
        this.tlX = x;  
        this.tlY = y;
        this.scale = 0.3;
        this.damageCooldown = 0;
        this.damageCooldownMax = 800;
        this.attackHitbox = null;
    }
    update(player, deltaTime){  //? handle attack and animation
        this.updateAnimation(deltaTime);  //moves frames
        if(this.damageCooldown > 0){  //control of hits
            this.damageCooldown -= deltaTime;
            return;
        }
        this.attackHitbox = {  //hitbox to hurt player
            x: this.position.x - this.halfSize.x * this.scale,
            y: this.position.y - this.size.y * this.scale,
            width: this.size.x * this.scale,
            height: this.size.y * this.scale,
        };
        if(hitboxOverlap(this.attackHitbox, player)){  //check for collision
            player.takeDamage(this.damage);
            this.damageCooldown = this.damageCooldownMax;
        }
    }
    draw(ctx){  //? draw the animation
        super.draw(ctx);
    }
}
class Spikes extends HazardBase {
    constructor(x, y) {
        super(x, y, 650, 350);
        this.damage = 10;
        this.spriteImage = new Image();
        this.spriteImage.src = "./assets/hazards/Spikes.png";
        this.spriteRect = new Rect(0, 0, 650, 350);
        this.setAnimation(0, 1, true, 600);
    }
}
class FirePit extends HazardBase {
    constructor(x, y) {
        super(x, y, 650, 350);
        this.damage = 30;
        this.spriteImage = new Image();
        this.spriteImage.src = "./assets/hazards/Firepit.png";
        this.spriteRect = new Rect(0, 0, 650, 350);
        this.setAnimation(0, 1, true, 600);
    }

    update(player, deltaTime) {
        this.updateAnimation(deltaTime);
        if (this.damageCooldown > 0) {
            this.damageCooldown -= deltaTime;
            return;
        }
        this.attackHitbox = {
            x: this.position.x - this.halfSize.x * this.scale,
            y: this.position.y - this.size.y * this.scale,
            width: this.size.x * this.scale,
            height: this.size.y * this.scale,
        };
        if (hitboxOverlap(this.attackHitbox, player)) {
            player.takeDamage(this.damage);
            fireSound.currentTime = 0;
            fireSound.play();
            this.damageCooldown = this.damageCooldownMax;
        }
    }
}
export { Spikes, FirePit };