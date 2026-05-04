/* 
& Defines the logic for the game's card system, including:
& Card class, sprites, and functions to apply and remove effects

^ Note: We recommend installing the Colorful Comments extension to improve code readability 
^ https://marketplace.visualstudio.com/items?itemName=ParthR2031.colorful-comments
^ Color Legend:
    & pink: file description
    * green: section title
    ~ purple: general funtion description
*/

//* === class Card ===
//~ general info for all cards
class Card {
    constructor(id, name, type, duration, applyEffect, removeEffect = null, image) {
        this.id = id; //from API
        this.name = name;
        this.type = type; // "powerup" or "punishment"
        this.duration = duration; // ms o null si es permanente
        this.applyEffect = applyEffect;
        this.removeEffect = removeEffect;
        this.image = image;
    }
}

//* === sprite ===
//~ upload all the sprites
    //powerup
const blade_mars = new Image();
blade_mars.src = "../Videojuego/assets/cards/powerup/blade_mars.png";
const blessing_venus = new Image();
blessing_venus.src = "../Videojuego/assets/cards/powerup/blessing_venus.png";
const colosseums_fury = new Image();
colosseums_fury.src = "../Videojuego/assets/cards/powerup/colosseums_fury.png";
const divine_shield = new Image();
divine_shield.src = "../Videojuego/assets/cards/powerup/divine_shield.png";
const eye_emperor = new Image();
eye_emperor.src = "../Videojuego/assets/cards/powerup/eye_emperor.png";
const favor_people = new Image();
favor_people.src = "../Videojuego/assets/cards/powerup/favor_people.png";
const gladiators_blood = new Image();
gladiators_blood.src = "../Videojuego/assets/cards/powerup/gladiators_blood.png";
const lion_roar = new Image();
lion_roar.src = "../Videojuego/assets/cards/powerup/lions_roar.png";
    //punishments
const amphitheatre_fog = new Image();
amphitheatre_fog.src = "../Videojuego/assets/cards/punishment/amphitheatre_fog.png";
const chains_caesar = new Image();
chains_caesar.src = "../Videojuego/assets/cards/punishment/chains_caesar.png";
const hunger_plebs = new Image();
hunger_plebs.src = "../Videojuego/assets/cards/punishment/hunger_plebs.png";
const imperial_decree = new Image();
imperial_decree.src = "../Videojuego/assets/cards/punishment/imperial_decree.png";
const lanistas_betreyal = new Image();
lanistas_betreyal.src = "../Videojuego/assets/cards/punishment/lanistas_betrayal.png";
const senates_judgement = new Image();
senates_judgement.src = "../Videojuego/assets/cards/punishment/senates_judgment.png";
const wrath_jupiter = new Image();
wrath_jupiter.src = "../Videojuego/assets/cards/punishment/wrath_jupiter.png";

const cardImages = {  //~ images matched with their image. Our images were made by NanoBanana.
    "Favor of the People": favor_people,
    "Blade of Mars": blade_mars,
    "Blessing of Venus": blessing_venus,
    "Divine Shield": divine_shield,
    "Lions Roar": lion_roar,
    "Gladiators Blood": gladiators_blood,
    "Colloseums fury": colosseums_fury,
    "Eye of the Emperor": eye_emperor,
    "Imperial Decreee": imperial_decree,
    "Chains of Caesar": chains_caesar,
    "Hunger of the Plebs": hunger_plebs,
    "Wrath of Jupiter": wrath_jupiter,
    "Ampitheatre Fog": amphitheatre_fog,
    "Lanistas Betrayal": lanistas_betreyal,
    "Senates Judgment": senates_judgement,
};

//* === functions ===
function applyToTarget(target, operator, prop, value) {  //~ all logic about the operator to apply and remove effects (debugged w IA)
    switch(operator) {
        case "*": 
            target[prop] *= value;
            break;
        case "+": 
            target[prop] += value; 
            break;
        case "-": 
            target[prop] -= value; 
            break;
        case "/": 
            target[prop] /= value; 
            break;
        case "=": 
            target[prop] = value; 
            break;
    }
}

function applyEffect(card, player, enemies, game) {  //~ apply effect to the game/player/enemy
    //call applyToTarget to manage each operator logic
    if (card.effect_from === "enemy") {  //case1: effect applied to enemy
        enemies.forEach(e => applyToTarget(e, card.effect_operator, card.effect_modifies, card.value_effect));
    } else if (card.effect_from === "game") {  //case2: effect applied to the game
        applyToTarget(game, card.effect_operator, card.effect_modifies, card.value_effect);
    } else {  // case3: effect applied to player
        applyToTarget(player, card.effect_operator, card.effect_modifies, card.value_effect);
    }
}

function reverseEffect(card, player, enemies, game) {  //~ remove the effect when needed (end of level or timer)
    //call again applyeffect to manage the logic, but the info sent is to remove effects
    if (card.effect_from === "enemy") {
        enemies.forEach(e => applyToTarget(e, card.effect_reverse_operator, card.effect_modifies, card.reverse_value));
    } else if (card.effect_from === "game") {
        applyToTarget(game, card.effect_reverse_operator, card.effect_modifies, card.reverse_value);
    } else {
        applyToTarget(player, card.effect_reverse_operator, card.effect_modifies, card.reverse_value);
    }
}

//* === exports ===
export {
    Card,
    applyEffect,
    reverseEffect,
    cardImages,
};