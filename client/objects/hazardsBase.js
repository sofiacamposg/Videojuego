//& hazardsBase.js
//& Defines all hazard objects in the game — Spikes and FirePit
//& Both extend HazardBase which handles animation and damage cooldown logic
//& FirePit overrides update() to add a fire sound effect on player contact

import { hitboxOverlap } from "../libs/game_functions.js";
import { AnimatedObject } from "../libs/AnimatedObject.js";
import { Rect } from "../libs/Rect.js";
import { Vector } from "../libs/Vector.js";

// fire damage sound played when the player steps on a fire pit
const fireSound = new Audio("./assets/music/fire.mp3");
fireSound.volume = 0.5;

//* base class for all hazards — handles hitbox creation, damage cooldown and animation
class HazardBase extends AnimatedObject {
    constructor(x, y, w, h) {
        super(new Vector(x + w/2, y + h), w, h, "transparent", "hazard", 2);
        this.tlX = x;   // top-left X for reference
        this.tlY = y;   // top-left Y for reference
        this.scale = 0.3;              // hazards are drawn smaller than their logical size
        this.damageCooldown = 0;       // current cooldown timer in ms
        this.damageCooldownMax = 800;  // ms between each damage tick
        this.attackHitbox = null;
    }

    //* updates the hazard each frame — ticks the cooldown and checks for player collision
    update(player, deltaTime){
        this.updateAnimation(deltaTime);  // advance sprite animation

        //? cooldown active — skip damage check until it expires
        if(this.damageCooldown > 0){
            this.damageCooldown -= deltaTime;
            return;
        }

        //? build the attack hitbox scaled to the hazard's visual size
        this.attackHitbox = {
            x: this.position.x - this.halfSize.x * this.scale,
            y: this.position.y - this.size.y * this.scale,
            width: this.size.x * this.scale,
            height: this.size.y * this.scale,
        };

        //? if player is touching the hazard, deal damage and start cooldown
        if(hitboxOverlap(this.attackHitbox, player)){
            player.takeDamage(this.damage);
            this.damageCooldown = this.damageCooldownMax;
        }
    }

    //* delegates drawing to the parent AnimatedObject class
    draw(ctx){
        super.draw(ctx);
    }
}

//* spikes hazard — active from level 2, deals low damage on contact
class Spikes extends HazardBase {
    constructor(x, y) {
        super(x, y, 650, 350);
        this.damage = 10;  // low damage — punishes careless movement
        this.spriteImage = new Image();
        this.spriteImage.src = "./assets/hazards/Spikes.png";
        this.spriteRect = new Rect(0, 0, 650, 350);
        this.setAnimation(0, 1, true, 600);
    }
}

//* fire pit hazard — active from level 3, deals high damage and plays a fire sound on contact
class FirePit extends HazardBase {
    constructor(x, y) {
        super(x, y, 650, 350);
        this.damage = 30;  // high damage — more dangerous than spikes
        this.spriteImage = new Image();
        this.spriteImage.src = "./assets/hazards/Firepit.png";
        this.spriteRect = new Rect(0, 0, 650, 350);
        this.setAnimation(0, 1, true, 600);
    }

    //* overrides the base update to add fire sound effect when the player is hit
    update(player, deltaTime) {
        this.updateAnimation(deltaTime);

        //? cooldown active — skip damage check
        if (this.damageCooldown > 0) {
            this.damageCooldown -= deltaTime;
            return;
        }

        //? build scaled attack hitbox
        this.attackHitbox = {
            x: this.position.x - this.halfSize.x * this.scale,
            y: this.position.y - this.size.y * this.scale,
            width: this.size.x * this.scale,
            height: this.size.y * this.scale,
        };

        //? player touched fire — deal damage, play sound and start cooldown
        if (hitboxOverlap(this.attackHitbox, player)) {
            player.takeDamage(this.damage);
            fireSound.currentTime = 0;
            fireSound.play();
            this.damageCooldown = this.damageCooldownMax;
        }
    }
}
export { Spikes, FirePit };