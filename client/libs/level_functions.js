//& level_functions.js
//& Utility functions used across the game levels — handles saving matches, spawning enemies,
//& drawing HUD elements, managing card effects, and syncing player stats with the API

import { EnemyBase } from "../objects/EnemyBase.js";
import { Vector } from "../libs/Vector.js";
import { playerConfigs } from "./levelConfig.js";
import { MessageBox } from "../objects/MessageBox.js";

//===== CARDS =======

//* saves a card usage to the database when the player picks or uses a card
export async function saveCardUse(levelId, cardId, duration) {
    await fetch("http://localhost:3000/deck", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            specific_level_id: levelId,
            card_id: cardId,
            effect_duration: duration || 0  // default to 0 if no duration provided
        })
    });
}

//* draws a near-black overlay when the Amphitheatre Fog card effect is active
export function drawFog(ctx, canvas, game) {
    if (!game.fogActive) return;  // only draw if the fog effect is active
    ctx.save();
    ctx.fillStyle = "rgba(0, 0, 0, 0.95)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.restore();
}

//* handles the Imperial Decree card effect — spawns extra enemies immediately
export function imperialDecree(game, enemies){
    if (game.spawnExtra > 0){
        for (let i = 0; i < game.spawnExtra; i++){
            enemies.push(game.spawnEnemy());  // spawn each extra enemy
        }
        game.spawnExtra = 0;  // reset counter after spawning
    }
}

//============== MATCH ====================

//* saves the match result to the database and stores the match ID globally
//* used by both WIN and LOSE flows to record the run
export async function saveMatch(data) {
    const res = await fetch("http://localhost:3000/match", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(data)
    });

    //? if the server returns an error, log it and stop — avoids crashing the game
    if (!res.ok) {
        const text = await res.text();
        console.error("MATCH ERROR:", text);
        return;
    }

    const result = await res.json();
    window.lastMatchId = result.match_id;

    if (data.galenUsed) {
        await fetch("http://localhost:3000/player/use-galen", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({ player_id: data.player_id })
        });
    }

    setTimeout(() => {
        loadPlayerStats(window.loggedPlayer.player_id);
    }, 200);

    return result;
}

//============== ENEMIES =====================

//* creates and returns a new EnemyBase instance at the given position with the given config
export function spawnEnemy(x, y, config){
    return new EnemyBase(new Vector(x,y), config);
}

//* generates the next platform position based on the last platform
//* keeps platforms within a vertical range so they stay reachable
export function generatePlatform(lastPlatform){
    let minGap = 300;
    let maxGap = 400;

    let x = lastPlatform.x + Math.random() * (maxGap - minGap) + minGap;  // random horizontal gap
    let y = lastPlatform.y + (Math.random() - 0.5) * 120;  // random vertical offset

    //? clamp Y so platforms don't go off screen
    if(y > 400) y = 400;
    if(y < 380) y = 380;

    return {
        x, y,
        width: 100,
        height: 70
    };
}

//* updates the camera X offset to keep the player centered on screen
//* clamps to world boundaries so the camera never goes out of bounds
export function updateCamera(playerX, canvasWidth, worldWidth){
    let cameraX = playerX - canvasWidth / 2;

    //? don't scroll before the world starts or past the world end
    if(cameraX < 0) return 0;
    if(cameraX > worldWidth - canvasWidth)
        return worldWidth - canvasWidth;

    return cameraX;
}

//* awards fame to the player based on how fast they completed the level
//* 10 fame if completed within target time, 5 fame if they went over
export function updateFame(player, currentLevelConfig, levelTimer) {
    if (levelTimer <= currentLevelConfig.targetTime)
        player.fame += 10;
    else
        player.fame += 5;
}

//* draws the fame counter on the canvas with a star emoji
export function drawFame(ctx, x, y, fame) {
    ctx.fillStyle = "gold";
    ctx.font = "20px VT323";
    ctx.fillText("🌟 " + fame, x, y);
}

//* fetches the player's live stats from the API and updates the HUD panel on the right
//* also syncs window.loggedPlayer.fame with the latest DB value
export async function loadPlayerStats(playerId, currentScene) {
    try {
        const res = await fetch(`http://localhost:3000/player/live/${playerId}`);
        const data = await res.json();

        document.getElementById("username").textContent = data.username;

        //? show current level number or dash if not in a level
        let levelText = "-";
        if (currentScene === "level1") levelText = 1;
        else if (currentScene === "level2") levelText = 2;
        else if (currentScene === "level3") levelText = 3;
        document.getElementById("level").textContent = levelText;

        //? update fame and sync frontend state with DB
        document.getElementById("fame").textContent = data.current_fame || 0;
        window.loggedPlayer.fame = data.current_fame;  // keep frontend in sync with backend

        //? update kill, card and general stat counters
        document.getElementById("kills").textContent = data.enemy_kills || 0;
        document.getElementById("cards").textContent = data.cards_in_deck || 0;
        document.getElementById("runs").textContent = data.total_runs;
        document.getElementById("wins").textContent = data.total_wins;
        document.getElementById("losses").textContent = data.total_losses;
        document.getElementById("galen").textContent = data.galen;
    } catch (err) {
        console.error("Error loading player stats:", err);
    }
}

//* draws the player's HP bar on the canvas
//* shows current HP as a green filled bar over a gray background
export function drawHealthBar(ctx, x, y, width, height, current, max) {
    //? HP label
    ctx.fillStyle = "green";
    ctx.fillText("HP: " + current, 40, 70);

    //? gray background represents lost HP
    ctx.fillStyle = "gray";
    ctx.fillRect(x, y, width, height);

    //? green fill proportional to current HP
    const healthWidth = (current / max) * width;
    ctx.fillStyle = "green";
    ctx.fillRect(x, y, healthWidth, height);

    //? white border around the bar
    ctx.strokeStyle = "white";
    ctx.lineWidth = 2;
    ctx.strokeRect(x, y, width, height);
};

//* draws the player's heart icons on the canvas
//* red hearts = current lives, gray hearts = lost lives
export function drawHearts(ctx, x, y, current, max) {
    for (let i = 0; i < max; i++) {
        ctx.fillStyle = i < current ? "red" : "gray";  // red if alive, gray if lost
        ctx.fillText("♥", x + i * 50, y);
    }
}

//* draws a banner at the top of the screen showing currently active card effects
//* temporary effects show a countdown timer, permanent effects show just the name
export function cardBanner(ctx, canvas, activeEffects, permanentEffects) {
    if (activeEffects.length === 0 && permanentEffects.length === 0) return;  // nothing to show
    ctx.save();

    //? dark banner background at the top of the canvas
    ctx.fillStyle = "rgba(48, 27, 0, 0.83)";
    ctx.fillRect(0, 0, canvas.width, 70);

    ctx.fillStyle = "white";
    ctx.font = "18px VT323";
    ctx.textAlign = "right";

    //? draw temporary effects with remaining seconds
    activeEffects.forEach((effect, i) => {
        const secs = Math.ceil(effect.endTime / 1000);  // convert ms to seconds
        ctx.fillText(`${effect.card.name} ${effect.card.des} (${secs}s)`, canvas.width - 10, 26 + i * 22);
    });

    //? draw permanent effects without a timer
    permanentEffects.forEach((effect, i) => {
        ctx.fillText(`${effect.card.name}`, canvas.width - 10, 42 + i * 32);
    });

    ctx.restore();
}