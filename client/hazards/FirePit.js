class FirePit {
    constructor(x, y){
        this.x = x;
        this.y = y;
        this.width = 300;
        this.height = 80;
        this.damage = 3; 
        this.damageCooldown = 0;
        this.damageCooldownMax = 800;

        this.image = new Image();
        this.image.src = "./assets/Firepit.png";
    }

    update(player, deltaTime){
        if(this.damageCooldown > 0){
            this.damageCooldown -= deltaTime;
            return;
        }

        const hitboxY = this.y + 40;

        let hit =
            player.position.x + player.halfSize.x > this.x &&
            player.position.x - player.halfSize.x < this.x + this.width &&
            player.position.y + player.halfSize.y > hitboxY &&
            player.position.y - player.halfSize.y < hitboxY + this.height;

        if(hit){
            player.takeDamage(this.damage);
            this.damageCooldown = this.damageCooldownMax;
        }
    }

    draw(ctx){
        ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
    }
}

export { FirePit };