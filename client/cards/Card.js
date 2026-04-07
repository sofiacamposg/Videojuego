//Class Card
class Card {
    constructor(name, type, duration, applyEffect, removeEffect = null) {
        this.name = name;
        this.type = type; // "powerup" o "punishment"
        this.duration = duration; // ms o null si es permanente
        this.applyEffect = applyEffect;
        this.removeEffect = removeEffect;
    }
}

//Power-ups
const cards = [

new Card("Speed Boost", "powerup", null, (player) => {
    player.speed *= 1.2;
}),

new Card("Damage Boost", "powerup", null, (player) => {
    player.damage *= 1.3;
}),

new Card("Heal 1 Heart", "powerup", null, (player) => {
    player.health += 20;
}),

new Card("Slow Enemies", "powerup", 5000, (player, enemies) => {
    enemies.forEach(e => e.speed *= 0.5);
}, (player, enemies) => {
    enemies.forEach(e => e.speed *= 2);
}),

new Card("Shield", "powerup", 10000, (player) => {
    player.invincible = true;
}, (player) => {
    player.invincible = false;
}),

new Card("Life Steal", "powerup", null, (player) => {
    player.lifeSteal = true;
}),

new Card("Range Boost", "powerup", null, (player) => {
    player.range *= 1.3;
}),

new Card("Reveal Card", "powerup", null, (player, game) => {
    game.revealNextCard = true;
}),

//Punishment
new Card("Spawn Enemies", "punishment", null, (player, enemies) => {
    enemies.push(/* spawn extra */);
    enemies.push(/* spawn extra */);
}),

new Card("No Jump", "punishment", 10000, (player) => {
    player.canJump = false;
}, (player) => {
    player.canJump = true;
}),

new Card("Cards Cost HP", "punishment", null, (player) => {
    player.cardCostHP = true;
}),

new Card("Lose Heart", "punishment", null, (player) => {
    player.health -= 20;
}),

new Card("Lose Fame", "punishment", null, (player) => {
    player.fame *= 0.95;
}),

new Card("Weak Damage", "punishment", 15000, (player) => {
    player.damage *= 0.6;
}, (player) => {
    player.damage /= 0.6;
}),

new Card("Double Death Penalty", "punishment", null, (player) => {
    player.doubleDeathPenalty = true;
})

];