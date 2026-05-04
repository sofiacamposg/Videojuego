/* 
& Global functions shared among all levels, divided into 4 categories:
& cards, match, enemies and platforms, canvas

^ Note: We recommend installing the Colorful Comments extension to improve code readability 
^ https://marketplace.visualstudio.com/items?itemName=ParthR2031.colorful-comments
^ Color Legend:
    & pink: file description
    * green: section title
    ~ purple: general funtion description
*/

//* === imports ===
import { EnemyBase } from "../objects/EnemyBase.js";
import { Vector } from "./Vector.js";
import { playerConfigs } from "./levelConfig.js";
import { MessageBox } from "../objects/MessageBox.js";

//* === CARDS ===
export async function saveCardUse(levelId, cardId, duration) {  //~ save cards usage into deck
    await fetch("http://localhost:3000/deck", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({  //info that goes to db
            specific_level_id: levelId,
            card_id: cardId,
            effect_duration: duration || 0
        })
    });
}

export function cardBanner(ctx, canvas, activeEffects, permanentEffects) {  //~ draws the info of all active cards
    if (activeEffects.length === 0 && permanentEffects.length === 0) return;  //no cards active
    ctx.save();
    //style
    ctx.fillStyle = "white";
    ctx.font = "18px VT323";
    ctx.textAlign = "right";

    activeEffects.forEach((effect, i) => {  //how info will be display
        const secs = Math.ceil(effect.endTime / 1000);  //from ms to sec
        ctx.fillText(`${effect.card.name} - ${effect.card.description || ""} (${secs}s)`, canvas.width - 10, 26 + i * 22);
    });
    permanentEffects.forEach((effect, i) => {
        ctx.fillText(`${effect.card.name} - ${effect.card.description || ""}`, canvas.width - 10, 42 + i * 32);
    });

    ctx.restore();  
}

export function drawFog(ctx, canvas, game) {  //~ amphitheatre effect: adds a "fog" in tha canvas 
    if (!game.fogActive) return;  //effect is not active
    ctx.save();
    ctx.fillStyle = "rgba(0, 0, 0, 0.95)";  //fog
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.restore();
}

export function imperialDecree(game, enemies){  //~ imperial decree effect: add 2 more enemies, debugged with 
    if (game.spawnExtra > 0){
        for (let i = 0; i < game.spawnExtra; i++){
            enemies.push(game.spawnEnemy());
        }
        game.spawnExtra = 0;
    }
}

//* === MATCH ===
export async function saveMatch(data) {  //~ for scoreScene, full summary of the match
    const res = await fetch("http://localhost:3000/match", {  
        method: "POST",  //save the current info
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(data)
    });

    if (!res.ok) {
        const text = await res.text();
        console.error("MATCH ERROR:", text);
        return;
    }

    const result = await res.json();
    window.lastMatchId = result.match_id;

    if (data.galenUsed) {
        await fetch("http://localhost:3000/player/use-galen", {
            method: "POST",  //save the current number of shields, maybe a shield was used in the level and need to update
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({ player_id: data.player_id })
        });
    }

    setTimeout(() => {  //wait and update players stats
        loadPlayerStats(window.loggedPlayer.player_id);
    }, 200);
    return result;
}

export async function loadPlayerStats(playerId, currentScene) {  //~ right-side stats, updated in real time
    try {
        const res = await fetch(`http://localhost:3000/player/live/${playerId}`);  //bring the indo
        const data = await res.json();
        //divide all info in their field to show it on html
        document.getElementById("username").textContent = data.username;
        let levelText = "-";
        if (currentScene === "level1")
            levelText = 1;
        else if (currentScene === "level2") 
            levelText = 2;
        else if (currentScene === "level3")
            levelText = 3;
        document.getElementById("level").textContent = levelText;
        document.getElementById("fame").textContent = data.current_fame || 0;  //hardcoded info for edge cases
        window.loggedPlayer.fame = data.current_fame; 
        document.getElementById("kills").textContent = data.enemy_kills || 0;  //hardcoded info for edge cases
        document.getElementById("cards").textContent = data.cards_in_deck || 0;  //hardcoded info for edge cases
        document.getElementById("runs").textContent = data.total_runs;
        document.getElementById("wins").textContent = data.total_wins;
        document.getElementById("losses").textContent = data.total_losses;
        document.getElementById("galen").textContent = data.galen;
    } catch (err) {
        console.error("Error loading player stats:", err);  //server error
    }
}

//* === ENEMIES ===
export function spawnEnemy(x, y, config){  //~ spawn enemies logic, easier to add config 
    return new EnemyBase(new Vector(x,y), config);
}

export function generatePlatform(lastPlatform){  //~ spawn platforms logic
    //gap range
    let minGap = 300;
    let maxGap = 400;
    //next platform depend on tha last platform dimentions
    let x = lastPlatform.x + Math.random() * (maxGap - minGap) + minGap;
    let y = lastPlatform.y + (Math.random() - 0.5) * 120;

    //delimit range of platforms
    if(y > 400) y = 400;  
    if(y < 380) y = 380;

    return {  //dimentions where the platform will spawn
        x, y,
        width: 100,
        height: 70
    };
}

//* === canvas ===
export function updateCamera(playerX, canvasWidth, worldWidth){  //~ move camera with players movement
    let cameraX = playerX - canvasWidth / 2;

    if(cameraX < 0) return 0;
    if(cameraX > worldWidth - canvasWidth)
        return worldWidth - canvasWidth;

    return cameraX;
}

export function updateFame(player, currentLevelConfig, levelTimer) {  //~ fame logic
    if (levelTimer <= currentLevelConfig.targetTime)
        player.fame += 10;
    else
        player.fame += 5;
}

export function drawFame(ctx, x, y, fame) {  //~ draw fame number
    ctx.fillStyle = "gold";
    ctx.font = "20px VT323";
    ctx.fillText("🌟 " + fame, x, y);
}

export function drawHealthBar(ctx, x, y, width, height, current, max) {   //~ draw health bar and the  color changes
    ctx.fillStyle = "gray";
    ctx.fillRect(x, y, width, height);

    const healthWidth = (current / max) * width;
    ctx.fillStyle = "green";
    ctx.fillRect(x, y, healthWidth, height);

    ctx.strokeStyle = "white";
    ctx.lineWidth = 2;
    ctx.strokeRect(x, y, width, height);

    ctx.fillStyle = "white";
    ctx.fillText("HP: " + current, x + 50, y + 20);
};

export function drawHearts(ctx, x, y, current, max) {  //~ draw hearts and their color changes
    for (let i = 0; i < max; i++) {
        ctx.fillStyle = i < current ? "red" : "gray";
        ctx.fillText("♥", x + i * 50, y);
    }
}