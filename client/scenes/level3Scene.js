import { PlayerBase } from "../objects/PlayerBase.js";
import { Vector } from "../libs/Vector.js";
import { MessageBox } from "../objects/MessageBox.js";
import { cardsOnCanvas } from "../cards/cardsOnCanvas.js";
import { cards } from "../cards/Card.js";
import { handleMouseMove } from "../libs/game_functions.js";
import { level3Config, playerConfigs } from "../libs/levelConfig.js";
import { spawnEnemy, generatePlatform, updateCamera } from "../libs/level_functions.js";
import { FirePit } from "../hazards/FirePit.js";
import { Spikes } from "../hazards/Spikes.js";
"use strict"

let currentLevelConfig = level3Config;
function setPlayerLevel3(existingPlayer){
    player = existingPlayer;
    initPlatforms();
}
//========================= GAME CORE VARIABLES =========================
//* GAME'S LOGIC
let currentLevel = 3;
//world size
let worldWidth = 2000;
let worldHeight = 600;
let cameraX = 0;
let canvasRef = { width: 1000 };

// Mouse
let mouseX = 0
let mouseY = 0

let player

//LEVEL TIMER
let levelTimer = 0;

let randomEventTime = Math.random() * (40000 - 20000) + 20000;

let keysDown = {};
let jumpPressed = false;

let killedEnemies = 0;
const conditionEnemies = 15;

//========================= CARD SYSTEM =========================
let cardEventTriggered = false;

let cardOptions = [];

const cardSystem = new cardsOnCanvas();

const game = {
    spawnEnemy: () => spawnEnemy(cameraX + canvasRef.width + 100, 450, currentLevelConfig.enemyConfig)
};

const effectNameToCard = {
    "People Favor":    cards.find(c => c.name === "Speed Boost"),
    "Mars Blade":      cards.find(c => c.name === "Damage Boost"),
    "Venus Blessing":  cards.find(c => c.name === "Heal 1 Heart"),
    "Imperial Decree": cards.find(c => c.name === "Spawn Enemies"),
    "Caesar Chains":   cards.find(c => c.name === "No Jump"),
    "Jupiter Wrath":   cards.find(c => c.name === "Lose Heart"),
};

//========================= PAUSE SYSTEM =========================
let isPaused = false;
let goToMenuLevel3 = false;

let pauseBox = new MessageBox(
    "PAUSED",
    "Game is paused",
    250, 150, 500, 300
);

pauseBox.addButton("Continue", 440, 290, 120, 35, () => {
    isPaused = false;
    pauseBox.hide();
});

pauseBox.addButton("Restart", 440, 340, 120, 35, () => {
    resetLevel3();
    isPaused = false;
    pauseBox.hide();
});

pauseBox.addButton("Home", 440, 390, 120, 35, () => {
    goToMenuLevel3 = true;
});


//========================= PLAYER SELECTION =========================
function setSelectedCharacter(selectedCharacter){
    player = new PlayerBase(
        new Vector(200,450),
        playerConfigs[selectedCharacter]
    );
    initPlatforms();
}

let enemies = currentLevelConfig.spawnPositions.map(pos =>
    spawnEnemy(
        pos.x,
        pos.y,
        currentLevelConfig.enemyConfig
    )
);

//========================= HAZARDS =========================
let hazards = [];

function initHazards(){
    hazards = [];

    // Spikes fijos
    hazards.push(new Spikes(400,  420));
    hazards.push(new Spikes(650,  420));
    hazards.push(new Spikes(900,  420));
    hazards.push(new Spikes(1200, 420));
    hazards.push(new Spikes(1500, 420));
    hazards.push(new Spikes(1750, 420));

    // Firepits: 3 o 4 por ronda, una por zona, MAS daño que level2
const zonas = [
    { min: 350,  max: 600  },
    { min: 700,  max: 950  },
    { min: 1050, max: 1300 },
    { min: 1400, max: 1750 },
];
const cantidad = Math.random() < 0.5 ? 3 : 4;
zonas.sort(() => Math.random() - 0.5).slice(0, cantidad).forEach(z => {
    const fp = new FirePit(Math.random() * (z.max - z.min) + z.min, 410);
    fp.damage = 5;
    hazards.push(fp);
});
}

initHazards();

//========================= PLATFORMS =========================
let platforms = [];

let platformImage = new Image();
platformImage.src = "./assets/Platform.png";

function initPlatforms(){
    platforms = [];

    for(let i = 0; i < 8; i++){
        if(platforms.length === 0){
            platforms.push({ x:300, y:300, width:100, height:70 });
        } else {
            let last = platforms[platforms.length - 1];
            platforms.push(generatePlatform(last));
        }
    }
}

function drawPlatforms(ctx){
    platforms.forEach(p=>{
        ctx.drawImage(platformImage, p.x, p.y - 70, p.width, p.height);
    });
}

//========================= BACKGROUND =========================
let backgroundImage = new Image();
backgroundImage.src = currentLevelConfig.background;


//========================= SPAWN SYSTEM =========================
let spawnTimer = 0;
let spawnInterval = 4000;

//========================= API CONNECTION — CARD FETCH =========================
async function generateCardOptions(){

    try{
        const response = await fetch("http://localhost:3000/cards/random");

        if(!response.ok){
            throw new Error("API failed");
        }

        const data = await response.json();

        let powerUps = data.filter(c => c.effect_type === "POWER_UP");
        let punishments = data.filter(c => c.effect_type === "PUNISHMENT");

        const shuffle = arr => arr.sort(() => Math.random() - 0.5);

        powerUps = shuffle(powerUps);
        punishments = shuffle(punishments);

        if(powerUps.length < 2 || punishments.length < 1){
            throw new Error("Not enough cards");
        }

        let selected = [
            powerUps[0],
            powerUps[1],
            punishments[0]
        ];

        cardOptions = shuffle(selected);

    }catch(err){
        console.log("Card API error, using fallback:", err);

        cardOptions = [
            { card_name: "People Favor", effect_name: "People Favor", effect_type: "POWER_UP" },
            { card_name: "Mars Blade", effect_name: "Mars Blade", effect_type: "POWER_UP" },
            { card_name: "Jupiter Wrath", effect_name: "Jupiter Wrath", effect_type: "PUNISHMENT" }
        ];
    }
}

async function triggerCardEvent(){

    console.log("EVENT TRIGGERED");

    await generateCardOptions();

    const convertedCards = cardOptions.map(apiCard =>
        effectNameToCard[apiCard.effect_name] || cards[Math.floor(Math.random() * cards.length)]
    );

    cardSystem.show(convertedCards, player, enemies, game);
}

//========================= DRAW LOOP =========================
function drawLevel3(ctx, canvas, deltaTime){
    if (!player) return;
    canvasRef = canvas;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for(let i = 0; i < worldWidth; i += canvas.width){
        ctx.drawImage(backgroundImage, i - cameraX, 0, canvas.width, canvas.height);
    }

    if(!isPaused && !cardSystem.isActive){
        update(deltaTime);
    }

    ctx.save();
    ctx.translate(-cameraX, 0);

    player.draw(ctx);
    drawPlatforms(ctx);
    enemies.forEach(enemy => enemy.draw(ctx));
    hazards.forEach(h => h.draw(ctx)); // draw spikes & firepits

    ctx.restore();

    drawHealthBar(ctx, 20, 20, 100, 30, player.hp, player.maxHp);
    ctx.font = "50px Arial";
    drawHearts(ctx, 150, 50, player.hearts, player.maxHearts);
    pauseBox.draw(ctx);

    cardSystem.draw(ctx, canvas);
    cardSystem.drawDeck(ctx, canvas);
}

//HEALTH BAR
function drawHealthBar(ctx, x, y, width, height, current, max) {
    ctx.fillStyle = "white";
    ctx.font = "20px Arial";
    ctx.fillText("HP: " + player.hp, 20, 70);

    ctx.fillStyle = "gray";
    ctx.fillRect(x, y, width, height);

    const healthWidth = (current / max) * width;
    ctx.fillStyle = "green";
    ctx.fillRect(x, y, healthWidth, height);

    ctx.strokeStyle = "white";
    ctx.lineWidth = 2;
    ctx.strokeRect(x, y, width, height);
};

//HEARTS
function drawHearts(ctx, x, y, current, max) {
    for (let i = 0; i < max; i++) {
        ctx.fillStyle = i < current ? "red" : "gray";
        ctx.fillText("♥", x + i * 50, y);
    }
}

//========================= UPDATE LOGIC =========================
function update(deltaTime){
    if (!player) return;
    levelTimer += deltaTime;

    if (!cardEventTriggered && levelTimer >= randomEventTime) {
        console.log("EVENT TRIGGERED");
        cardEventTriggered = true;
        triggerCardEvent();
    }

    player.isMoving = false;

    const goLeft  = keysDown["ArrowLeft"];
    const goRight = keysDown["ArrowRight"];
    const groundY = 450;

    player.update(goLeft, goRight, jumpPressed, platforms, groundY, deltaTime);
    jumpPressed = false;

    if (player.position.x < player.halfSize.x)
        player.position.x = player.halfSize.x;
    if (player.position.x > worldWidth - player.halfSize.x)
        player.position.x = worldWidth - player.halfSize.x;

    enemies.forEach(enemy => {
        enemy.update(player, deltaTime);
        if (enemy.position.x - enemy.halfSize.x <= 0 && enemy.speed > 0)
            enemy.bounce();
        else if (enemy.position.x + enemy.halfSize.x >= worldWidth && enemy.speed < 0)
            enemy.bounce();
    });

    player.attackEnemy(enemies);

    let totalLenEnemies = enemies.length;
    enemies = enemies.filter(alive => alive.hp > 0);
    killedEnemies += totalLenEnemies - enemies.length;

    // update hazards (collision + damage cooldown)
    hazards.forEach(h => h.update(player, deltaTime));

    spawnTimer += deltaTime;
    if (spawnTimer >= spawnInterval) {
        if (killedEnemies < conditionEnemies) {
            enemies.push(spawnEnemy(cameraX + canvasRef.width + 100, 450, currentLevelConfig.enemyConfig));
        }
        console.log(`enemies: ${enemies.length}`);
        spawnTimer = 0;
    }

    cameraX = updateCamera(
        player.position.x,
        canvasRef.width,
        worldWidth
    );

    let last = platforms[platforms.length - 1];
    if(player.position.x > last.x - 500){
        platforms.push(generatePlatform(last));
    }

    cardSystem.update(deltaTime);
}

//========================= INPUT HANDLERS =========================
function handleMouseMoveLevel3(event, canvas){
    const pos = handleMouseMove(event, canvas);
    mouseX = pos.x;
    mouseY = pos.y;
}

function handleClickLevel3(){

    if(isPaused){
        return pauseBox.handleClick(mouseX, mouseY);
    }
    if(cardSystem.isDeckOpen){
        cardSystem.handleDeckClick(mouseX, mouseY, canvasRef);
        return;
    }
    if(cardSystem.isActive){
        cardSystem.handleClick(mouseX, mouseY, canvasRef);
        return;
    }
}

function handleKeyDownLevel3(event){
    if(event.repeat) return;

    if(event.key === "Escape"){
        isPaused = !isPaused;

        if(isPaused){
            pauseBox.show();
        } else {
            pauseBox.hide();
        }
        return;
    }

    if(isPaused) return;

    keysDown[event.key] = true;

    if(event.key === "c" || event.key === "C"){
        cardSystem.toggleDeck();
    }
    if(event.key === " "){
        jumpPressed = true;
    }
    if(event.key === "j"){
        if(!player.playeratack){
            player.playeratack = true;
            player.attackFrames = 0;
        }
    }
}

function handleKeyUpLevel3(event){
    keysDown[event.key] = false;

    if(event.key === " "){
        jumpPressed = false;
    }
}

//========================= RESET =========================
function resetLevel3(){
    player.position.x = 200;
    player.position.y = 350;
    player.velocityY = 0;
    player.hp = player.maxHp;

    enemies = currentLevelConfig.spawnPositions.map(pos =>
        spawnEnemy(pos.x, pos.y, currentLevelConfig.enemyConfig)
    );
    killedEnemies = 0;

    initPlatforms();
    initHazards(); // reset spikes & firepits

    cameraX = 0;
    spawnTimer = 0;

    levelTimer = 0;
    randomEventTime = Math.random() * (40 - 20) + 20;
    cardEventTriggered = false;
    cardSystem.close();
    cardSystem.isDeckOpen = false;
}

//========================= EXPORTS =========================
export {
    setPlayerLevel3,
    drawLevel3,
    handleMouseMoveLevel3,
    handleClickLevel3,
    resetLevel3,
    handleKeyDownLevel3,
    handleKeyUpLevel3,
    setSelectedCharacter,
    goToMenuLevel3
}