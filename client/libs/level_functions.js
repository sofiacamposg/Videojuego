import { EnemyBase } from "../objects/EnemyBase.js";
import { Vector } from "../libs/Vector.js";
import { playerConfigs } from "./levelConfig.js";
import { Card } from "../cards/Card.js";
//This is a fallback import
import {
    //power ups
    colosseums_fury,
    divine_shield,
    eye_emperor,
    favor_people,
    blade_mars,
    blessing_venus,
    gladiators_blood,
    lion_roar,
    //punishments
    amphitheatre_fog,
    imperial_decree,
    chains_caesar,
    wrath_jupiter,
    hunger_plebs,
    lanistas_betreyal,
    senates_judgement,

} from "../cards/Card.js";
//=================== CARDS =========================
//fetch cards from API
export async function fetchCards() {
    const res = await fetch("http://localhost:3000/cards/random");
    return await res.json();
}

function mapEffect(effectName) {
    switch (effectName) {
        // POWER UPS
        case "People Favor": // Speed Boost
            return (player) => {
                player.speed *= 1.2;
            };
        case "Mars Blade": // Damage Boost
            return (player) => {
                player.damage *= 1.3;
            };
        case "Venus Blessing": // Heal
            return (player) => {
                player.hearts += 1;
            };
        case "Lion Roar": // Slow enemies
            return (player, enemies) => {
                enemies.forEach(e => {
                    e.isSlowed = true;
                    e.speed *= 0.2;
                });
            };
        case "Divine Shield": // Shield
            return (player) => {
                player.invincible = true;
            };
        case "Gladiator's Blood": // Life steal
            return (player) => {
                player.lifeSteal = true;
            };
        case "Colosseum's Fury": // Range boost
            return (player) => {
                player.range *= 1.3;
            };
        case "Eye of the Emperor": // Reveal next card
            return (player, enemies, game) => {
                game.revealNextCard = true;
            };
        // PUNISHMENTS
        case "Imperial Decree": // Spawn enemies
            return (player, enemies, game) => {
                enemies.push(game.spawnEnemy());
                enemies.push(game.spawnEnemy());
            };
        case "Caesar Chains": // No jump
            return (player) => {
                player.canJump = false;
            };
        case "Hunger of the Plebs": // Cards cost HP
            return (player) => {
                player.cardCostHP = true;
            };
        case "Jupiter Wrath": // Lose heart
            return (player) => {
                player.hearts -= 1;
            };
        case "Amphitheatre Fog": // Fog
            return (player) => {
                player.fogActive = true;
            };
        case "Lanista's Betrayal": // Weak damage
            return (player) => {
                player.damage *= 0.6;
            };
        case "Senate's Judgment": // Double death penalty
            return (player) => {
                player.doubleDeathPenalty = true;
            };
        default:
            return () => {};
    }
}

function getImage(name) {
    switch (name) {
        // POWER UPS
        case "People Favor Card": return favor_people;
        case "Mars Blade Card": return blade_mars;
        case "Venus Blessing Card": return blessing_venus;
        case "Lion Roar Card": return lion_roar;
        case "Divine Shield Card": return divine_shield;
        case "Gladiator's Blood Card": return gladiators_blood;
        case "Colosseum's Fury Card": return colosseums_fury;
        case "Eye of the Emperor Card": return eye_emperor;
        // PUNISHMENTS
        case "Imperial Decree Card": return imperial_decree;
        case "Caesar Chains Card": return chains_caesar;
        case "Hunger of the Plebs Card": return hunger_plebs;
        case "Jupiter Wrath Card": return wrath_jupiter;
        case "Amphitheatre Fog Card": return amphitheatre_fog;
        case "Lanista's Betrayal Card": return lanistas_betreyal;
        case "Senate's Judgment Card": return senates_judgement;
        default:
            return null;
    }
}

//Here new Card = data = fetchCards() = cards from API
export async function loadCards() {
    const data = await fetchCards();
    return data.map(c => new Card(
        c.card_id,             
        c.card_name,
        c.effect_type.toLowerCase(),
        null,
        mapEffect(c.effect_name),
        null,
        getImage(c.card_name)
    ));
}

//Save cards usage
export async function saveCardUse(levelId, cardId, duration) {
    await fetch("http://localhost:3000/deck", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            specific_level_id: levelId,
            card_id: cardId,
            effect_duration: duration || 0
        })
    });
}

//============== MATCH ====================
export async function saveMatch(data) {
    const res = await fetch("http://localhost:3000/match", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    });

    return await res.json();
}

//============== ENEMIES =====================
export function spawnEnemy(x, y, config){
    return new EnemyBase(new Vector(x,y), config);
}
export function generatePlatform(lastPlatform){
    let minGap = 200;
    let maxGap = 300;

    let x = lastPlatform.x + Math.random() * (maxGap - minGap) + minGap;
    let y = lastPlatform.y + (Math.random() - 0.5) * 120;

    if(y > 420) y = 420;
    if(y < 380) y = 380;

    return {
        x, y,
        width: 100,
        height: 70
    };
}
export function updateCamera(playerX, canvasWidth, worldWidth){
    let cameraX = playerX - canvasWidth / 2;

    if(cameraX < 0) return 0;
    if(cameraX > worldWidth - canvasWidth)
        return worldWidth - canvasWidth;

    return cameraX;
}

export function updateCoins(player, prevKilled, newKilled) {
    player.coins += Math.floor(newKilled / 3) - Math.floor(prevKilled / 3);
}

export function drawCoins(ctx, x, y, coins) {
    ctx.fillStyle = "gold";
    ctx.font = "20px Arial";
    ctx.fillText("🌟 " + coins, x, y);
}