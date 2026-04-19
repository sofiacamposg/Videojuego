class FirePit {
    constructor(x, y){
        this.x = x;
        this.y = y;
        this.width = 70;
        this.height = 50;
        this.damage = 25; 

        this.image = new Image();
        this.image.src = "./assets/Firepit.png";
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

export { FirePit };