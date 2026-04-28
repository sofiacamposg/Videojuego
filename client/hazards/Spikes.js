import { hitboxOverlap } from "../libs/game_functions.js";

class Spikes {
    constructor(x, y){
        this.x = x;
        this.y = y;
        this.width = 150;
        this.height = 80;
        this.damage = 10;
        this.damageCooldown = 0;
        this.damageCooldownMax = 800;

        this.image = new Image();
        this.image.src = "./assets/Spikes.png";
    }

    update(player, deltaTime){
        if(this.damageCooldown > 0){
            this.damageCooldown -= deltaTime;
            return;
        }

        let hit =
            player.position.x + player.halfSize.x > this.x &&
            player.position.x - player.halfSize.x < this.x + this.width &&
            player.position.y + player.halfSize.y > this.y;

        if(hit){
            player.takeDamage(this.damage);
            this.damageCooldown = this.damageCooldownMax;
        }
    }

    draw(ctx){
        ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
    }
}

export { Spikes };