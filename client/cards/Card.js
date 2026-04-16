//Class Card
class Card {
    constructor(name, type, duration, applyEffect, removeEffect = null, image) {
        this.name = name;
        this.type = type; // "powerup" o "punishment"
        this.duration = duration; // ms o null si es permanente
        this.applyEffect = applyEffect;
        this.removeEffect = removeEffect;
        this.image = image;
/*
        const cardBackImage = new Image();
        cardBackImage.src = "./assets/cards/powerup/BaseCard.png";  
        this.spriteImage = this.cardBackImage;*/
    }
}

//upload all the sprites
    //powerup
    const blade_mars = new Image();
    blade_mars.src = "./assets/cards/powerup/blade_mars.png";
    const blessing_venus = new Image();
    blessing_venus.src = "./assets/cards/powerup/blessing_venus.png";
    const colosseums_fury = new Image();
    colosseums_fury.src = "./assets/cards/powerup/colosseums_fury.png";
    const divine_shield = new Image();
    divine_shield.src = "./assets/cards/powerup/divine_shield.png";
    const eye_emperor = new Image();
    eye_emperor.src = "./assets/cards/powerup/eye_emperor.png";
    const favor_people = new Image();
    favor_people.src = "./assets/cards/powerup/favor_people.png";
    const gladiators_blood = new Image();
    gladiators_blood.src = "./assets/cards/powerup/gladiators_blood.png";
    const lion_roar = new Image();
    lion_roar.src = "./assets/cards/powerup/lions_roar.png";
    //punishments
    const amphitheatre_fog = new Image();
    amphitheatre_fog.src = "./assets/cards/punishment/amphitheatre_fog.png";
    const chains_caesar = new Image();
    chains_caesar.src = "./assets/cards/punishment/chains_caesar.png";
    const hunger_plebs = new Image();
    hunger_plebs.src = "./assets/cards/punishment/hunger_plebs.png";
    const imperial_decree = new Image();
    imperial_decree.src = "./assets/cards/punishment/imperial_decree.png";
    const lanistas_betreyal = new Image();
    lanistas_betreyal.src = "./assets/cards/punishment/lanistas_betrayal.png";
    const senates_judgement = new Image();
    senates_judgement.src = "./assets/cards/punishment/senates_judgment.png";
    const wrath_jupiter = new Image();
    wrath_jupiter.src = "./assets/cards/punishment/wrath_jupiter.png";

//Power-ups
const cards = [

new Card("Speed Boost", "powerup", null, (player) => {  //favor_people.png
    player.speed *= 1.2;
}, null, favor_people),

new Card("Damage Boost", "powerup", null, (player) => {  //blade_mars.png
    player.damage *= 1.3;
}, null, blade_mars),

new Card("Heal 1 Heart", "powerup", null, (player) => {  //blessing_venus.png
    player.hp += 20;
}, null, blessing_venus),

new Card("Slow Enemies", "powerup", 5000,  //lions_roar.png
    (player, enemies) => {  
    enemies.forEach(e => e.speed *= 0.5);
}, (player, enemies) => {
    enemies.forEach(e => e.speed *= 2);
}, lion_roar),

new Card("Shield", "powerup", 10000, (player) => {  //divine shield
    player.invincible = true;
}, (player) => {
    player.invincible = false;
}, divine_shield),

new Card("Life Steal", "powerup", null, (player) => {  //gladiators_blood.png
    player.lifeSteal = true;
}, null, gladiators_blood),

new Card("Range Boost", "powerup", null, (player) => {  //colosseums_fury.png
    player.range *= 1.3;
}, null, colosseums_fury),

new Card("Reveal Card", "powerup", null, (player, game) => {  //eye_emperor.png
    game.revealNextCard = true;  //TODO arreglar propiedad
}, null, eye_emperor),

//Punishment
new Card("Spawn Enemies", "punishment", null, (player, enemies) => {  //imperial_decreee.png
    enemies.push(new EnemyBase(new Vector(900,450), lionConfig));  //TODO hacer una funcion para llamar dependiendo del enemigo del nivel
    enemies.push(new EnemyBase(new Vector(900,450), lionConfig));
}, imperial_decree),

new Card("No Jump", "punishment", 10000, (player) => {  //chains_caesar.png
    player.canJump = false;
}, (player) => {
    player.canJump = true;
}, chains_caesar),

new Card("Cards Cost HP", "punishment", null, (player) => {  //hunger_plebs.pnga
    player.cardCostHP = true;
}, null, hunger_plebs),

new Card("Lose Heart", "punishment", null, (player) => {  //wrath_jupiter.png
    player.hp -= 20;
}, null, wrath_jupiter),

// CORRECTO
new Card("Fog", "punishment", 12000,  //ampitheatre_fog.png
    (player) => { player.fogActive = true; },
    (player) => { player.fogActive = false; }, amphitheatre_fog
),  

new Card("Weak Damage", "punishment", 15000, (player) => {  //lanistas_betrayal.png
    player.damage *= 0.6;
}, (player) => {
    player.damage /= 0.6;
}, lanistas_betreyal),

new Card("Double Death Penalty", "punishment", null, (player) => {  //senates_judgment.png
    player.doubleDeathPenalty = true;
}, null, senates_judgement)

];

export { Card, cards };