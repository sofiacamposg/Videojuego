//Class Card
class Card {
    constructor(id, name, type, duration, applyEffect, removeEffect = null, image) {
        this.id = id; //from API
        this.name = name;
        this.type = type; // "powerup" o "punishment"
        this.duration = duration; // ms o null si es permanente
        this.applyEffect = applyEffect;
        this.removeEffect = removeEffect;
        this.image = image;
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

function applyToTarget(target, operator, prop, value) {  //all logic about the operator to aply and remove
    switch(operator) {
        case "*": target[prop] *= value; break;
        case "+": target[prop] += value; break;
        case "-": target[prop] -= value; break;
        case "/": target[prop] /= value; break;
        case "=": target[prop] = value;  break;
    }
}

function applyEffect(card, player, enemies, game) {  //apply effect to the game/player/enemy
    if (card.effect_from === "enemy") {
        enemies.forEach(e => applyToTarget(e, card.effect_operator, card.effect_modifies, card.value_effect));
    } else if (card.effect_from === "game") {
        applyToTarget(game, card.effect_operator, card.effect_modifies, card.value_effect);
    } else {
        applyToTarget(player, card.effect_operator, card.effect_modifies, card.value_effect);
    }
}

function reverseEffect(card, player, enemies, game) {  //when needed, will take off the effect
    if (card.effect_from === "enemy") {
        enemies.forEach(e => applyToTarget(e, card.effect_reverse_operator, card.effect_modifies, card.reverse_value));
    } else if (card.effect_from === "game") {
        applyToTarget(game, card.effect_reverse_operator, card.effect_modifies, card.reverse_value);
    } else {
        applyToTarget(player, card.effect_reverse_operator, card.effect_modifies, card.reverse_value);
    }
}

const cardImages = {  //images matched with their image
    "Favor of the People": favor_people,
    "Blade of Mars":        blade_mars,
    "Blessing of Venus":    blessing_venus,
    "Divine Shield":        divine_shield,
    "Lions Roar":           lion_roar,
    "Gladiators Blood":     gladiators_blood,
    "Colloseums fury":      colosseums_fury,
    "Eye of the Emperor":   eye_emperor,
    "Imperial Decreee":     imperial_decree,
    "Chains of Caesar":     chains_caesar,
    "Hunger of the Plebs":  hunger_plebs,
    "Wrath of Jupiter":     wrath_jupiter,
    "Ampitheatre Fog":      amphitheatre_fog,
    "Lanistas Betrayal":    lanistas_betreyal,
    "Senates Judgment":     senates_judgement,
};

export {
    Card,
    applyEffect,
    reverseEffect,
    cardImages,
};