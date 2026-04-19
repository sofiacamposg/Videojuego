import { hitboxOverlap } from "../libs/game_functions.js";

class Spikes {
    constructor(x, y){
        this.x = x;
        this.y = y;
        this.width = 60;
        this.height = 40;
        this.damage = 10;

        this.image = new Image();
        this.image.src = "./assets/Spikes.png";
    }

    update(player){
        let hit =
            player.position.x + player.halfSize.x > this.x &&
            player.position.x - player.halfSize.x < this.x + this.width &&
            player.position.y + player.halfSize.y > this.y;

        if(hit){
            player.takeDamage(this.damage);
        }
    }

    draw(ctx){
        ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
    }
}

export { Spikes };