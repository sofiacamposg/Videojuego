import { EnemyBase } from "../objects/EnemyBase.js";
import { Vector } from "../libs/Vector.js";
import { playerConfigs } from "./levelConfig.js";
import { MessageBox } from "../objects/MessageBox.js";

//===== CARDS =======
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

export function drawFog(ctx, canvas, game) {
    if (!game.fogActive) return;
    ctx.save();
    ctx.fillStyle = "rgba(0, 0, 0, 0.75)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.restore();
}

export function imperialDecree(game, enemies){
    if (game.spawnExtra > 0){
        for (let i = 0; i < game.spawnExtra; i++){
            enemies.push(game.spawnEnemy());
        }
        game.spawnExtra = 0;
    }
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

export function updateFame(player, prevKilled, newKilled) {
    player.coins += Math.floor(newKilled / 3) - Math.floor(prevKilled / 3);
}

export function drawFame(ctx, x, y, coins) {
    ctx.fillStyle = "gold";
    ctx.font = "20px VT323";
    ctx.fillText("🌟 " + coins, x, y);
}

export async function loadPlayerStats(playerId, currentScene) {
    try {
        const res = await fetch(`http://localhost:3000/player/live/${playerId}`);
        const data = await res.json();

        document.getElementById("username").textContent = data.username;
        let levelText = "-";
        if (currentScene === "level1") levelText = 1;
        else if (currentScene === "level2") levelText = 2;
        else if (currentScene === "level3") levelText = 3;
        document.getElementById("level").textContent = levelText;
        document.getElementById("fame").textContent = data.current_fame || 0;
        document.getElementById("kills").textContent = data.enemy_kills || 0;
        document.getElementById("cards").textContent = data.cards_in_deck || 0;
        document.getElementById("runs").textContent = data.total_runs;
        document.getElementById("wins").textContent = data.total_wins;
        document.getElementById("losses").textContent = data.total_losses;
    } catch (err) {
        console.error("Error loading player stats:", err);
    }
}

export function pauseScreen (){  //pause screen config
    let pauseBox = new MessageBox(
        "PAUSED",
        "Game is paused",
        250, 150, 500, 300
    );
}

export function confirmScreen (){  //screen appears when user click on restart or home
    let confirmBox = new MessageBox(
        "ARE YOU SURE?",
        "",
        300, 200, 400, 200
    );
    let confirmAction = null;
    
    confirmBox.addButton("Yes", 340, 320, 100, 35, () => {
        confirmBox.hide();
        pauseBox.hide();
        isPaused = false;
        if(confirmAction) confirmAction();
        confirmAction = null;
    });
    
    confirmBox.addButton("No", 460, 320, 100, 35, () => {
        confirmBox.hide();
    });
    
    pauseBox.addButton("Continue", 440, 290, 120, 35, () => {
        isPaused = false;
        pauseBox.hide();
    });
    
    pauseBox.addButton("Restart", 440, 340, 120, 35, () => {
        confirmAction = () => {
            resetLevel1();
        };
        confirmBox.show();
    });
    
    pauseBox.addButton("Home", 440, 390, 120, 35, () => {
        confirmAction = () => {
            goToMenuLevel1 = true;
        };
        confirmBox.show();
    });
}

export function levelTransitionSCreen (){  //message shown between levels
    let levelCompletedBox = new MessageBox(
        "LEVEL COMPLETED",
        "You survived the arena.\n The emperor is watching, do your best!",
        250, 150, 500, 300
    );
    
    levelCompletedBox.addButton("Next Level", 420, 350, 150, 40, () => {
        levelCompletedBox.hide();
        showDeckPreview = true;  //TODO
        deckPreviewTimer = 0;
        cardSystem.isDeckOpen = true;
    });
}

export function gameOverScreen() {  //screen and config when hearts = 0
    let gameOver = false;
    let gameOverBox = new MessageBox(
        "Game Over",
        "You died!\n The emperor is dissapointed in you",
        250, 150, 500, 300
    );
    gameOverBox.addButton("Restart", 440, 340, 120, 35, async () => {
        console.log("RESTART GAME OVER CLICKED");
        //Updates live stats, runs and defeats
        await saveMatch({  //TODO
            player_id: window.loggedPlayer.player_id,
            archetype_id: 1, //NO SIRVE, CAMBIARLO, ES HARDCORE
            duration_seconds: Math.floor(levelTimer / 1000),
            level_reached: currentLevel,
            final_fame: killedEnemies,
            life: Math.max(0, player.hearts),
            result: "LOSE"
        });
        console.log("Lose saved");
        resetLevel1();
        gameOver = false;
        gameOverBox.hide();
    });
    
}