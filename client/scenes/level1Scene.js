import { PlayerBase } from "../objects/PlayerBase.js";
import { Vector } from "../libs/Vector.js";
import { MessageBox } from "../objects/MessageBox.js";
import { cardsOnCanvas } from "../cards/cardsOnCanvas.js";
import { cards } from "../cards/Card.js";
import { handleMouseMove } from "../libs/game_functions.js";
import { level1Config, playerConfigs } from "../libs/levelConfig.js";
import { spawnEnemy, generatePlatform, updateCamera, updateCoins, drawCoins } from "../libs/level_functions.js";
"use strict"

let currentLevelConfig = level1Config;
//========================= GAME CORE VARIABLES =========================
//* GAME'S LOGIC
let currentLevel = 1;
//======= LEVEL TRANSITION =======
let levelCompleted = false;
let showDeckPreview = false;
let deckPreviewTimer = 0;
//world size
let worldWidth = 2000;
let worldHeight = 600;
let cameraX = 0; //canvas viewport
let canvasRef = { width: 1000 }; // se actualiza en drawLevel1, necesario para spawn y cartas

// Mouse
let mouseX = 0
let mouseY = 0

let player
let nextLevelLevel1 = false; //Change of scene

//LEVEL TIMER
let levelTimer = 0;

// random trigger between 20s and 40s (considering 1 minute per level)
let randomEventTime = Math.random() * (40- 20) + 20;

let keysDown = {}; //To track keyboard input for player movement
let jumpPressed = false; //Prevents continuous jumping when holding the key

let killedEnemies = 0;
const conditionEnemies = 1;

//========================= CARD SYSTEM =========================
let cardEventTriggered = false;

let cardOptions = []; // cards fetched from API

// cardsOnCanvas maneja toda la UI y lógica de cartas
const cardSystem = new cardsOnCanvas();

// game object que cardsOnCanvas usa para efectos como "Spawn Enemies"
const game = {
    spawnEnemy: () => spawnEnemy(cameraX + canvasRef.width + 100, 450, currentLevelConfig.enemyConfig)
};

// Mapeo de effect_name de la API → Card de Card.js (que tiene applyEffect/removeEffect completos)
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
let goToMenuLevel1 = false;

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
    resetLevel1();
    isPaused = false;
    pauseBox.hide();
});

pauseBox.addButton("Home", 440, 390, 120, 35, () => {
    goToMenuLevel1 = true;
});
//====LEVEL TRANSITION MESSAGE BOX AND BUTTON NEXT LEVEL======
let levelCompletedBox = new MessageBox(
    "LEVEL COMPLETED",
    "You survived the arena.",
    250, 150, 500, 300
);

levelCompletedBox.addButton("Next Level", 420, 350, 150, 40, () => {
    levelCompletedBox.hide();
    showDeckPreview = true;
    deckPreviewTimer = 0;
    cardSystem.isDeckOpen = true;
});

//========================= PLAYER SELECTION =========================
//This function selects the player sprite
function setSelectedCharacter(selectedCharacter){
    player = new PlayerBase(
        new Vector(200,450),
        playerConfigs[selectedCharacter]
    );
    initPlatforms();
}

//enemies, random entities, position, config
let enemies = currentLevelConfig.spawnPositions.map(pos =>
    spawnEnemy(
        pos.x,
        pos.y,
        currentLevelConfig.enemyConfig
    )
);

//========================= GAME OVER =========================
let gameOver = false;
let gameOverBox = new MessageBox(
    "Game Over",
    "You died!\n The emperor is dissapointed in you",
    250, 150, 500, 300
);
gameOverBox.addButton("Restart", 440, 340, 120, 35, () => {
    resetLevel1();
    gameOver = false;
    gameOverBox.hide();
});


//========================= PLATFORMS =========================
//Obstacles, also random entities
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
let spawnInterval = 4000; // 4000 ms = 4 seconds

//========================= API CONNECTION — CARD FETCH =========================
async function generateCardOptions(){

    try{
        const response = await fetch("http://localhost:3000/cards/random");

        if(!response.ok){
            throw new Error("API failed");
        }

        const data = await response.json();

        // separate types
        let powerUps = data.filter(c => c.effect_type === "POWER_UP");
        let punishments = data.filter(c => c.effect_type === "PUNISHMENT");

        // shuffle
        const shuffle = arr => arr.sort(() => Math.random() - 0.5);

        powerUps = shuffle(powerUps);
        punishments = shuffle(punishments);

        // validation
        if(powerUps.length < 2 || punishments.length < 1){
            throw new Error("Not enough cards");
        }

        // LEVEL 1 LOGIC
        let selected = [
            powerUps[0],
            powerUps[1],
            punishments[0]
        ];

        cardOptions = shuffle(selected);

    }catch(err){
        console.log("Card API error, using fallback:", err);

//FALLBACK, if anything fails these are safe options
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

    // Convertir los objetos de la API a Cards reales de Card.js (que tienen applyEffect completo)
    const convertedCards = cardOptions.map(apiCard =>
        effectNameToCard[apiCard.effect_name] || cards[Math.floor(Math.random() * cards.length)]
    );

    cardSystem.show(convertedCards, player, enemies, game);
}
//================REWARD CARDS FOR LEVEL TRANSITION=====================
function giveLevelRewards(){

    const rewardCount = levelTimer < 60000 ? 2 : 1;
    const powerUps = cards.filter(c => c.type === "POWER_UP");
    const shuffled = [...powerUps].sort(() => Math.random() - 0.5);
    for(let i = 0; i < rewardCount && i < shuffled.length; i++){
        cardSystem.playerDeck.push(shuffled[i]);
    }
}

//========================= DRAW LOOP =========================
function drawLevel1(ctx, canvas, deltaTime){
    if (!player) return; //avoids crash
    canvasRef = canvas; // actualizar referencia para spawn y cardSystem

    //Clear → update → draw objects
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for(let i = 0; i < worldWidth; i += canvas.width){
        ctx.drawImage(backgroundImage, i - cameraX, 0, canvas.width, canvas.height); //draw background
    }

    if(!isPaused && (!cardSystem.isActive || showDeckPreview)){
        update(deltaTime);
    }

    ctx.save();  //keeps character within screen
    ctx.translate(-cameraX, 0);

    player.draw(ctx);  //draw player sprite
    drawPlatforms(ctx);  //obstacles
    enemies.forEach(enemy => enemy.draw(ctx));  //draw enemy sprites

    ctx.restore();

    drawHealthBar(ctx, 20, 20, 100, 30, player.hp, player.maxHp);
    ctx.font = "50px Arial";
    drawHearts(ctx, 150, 50, player.hearts, player.maxHearts);
    drawCoins(ctx, 20, 100, player.coins);
    pauseBox.draw(ctx);

    if (gameOver) {
        gameOverBox.draw(ctx);
        return;
    }

    if(levelCompleted){
        levelCompletedBox.draw(ctx);
    }

    // cardsOnCanvas dibuja la selección de cartas y el deck del jugador
    cardSystem.draw(ctx, canvas);
    cardSystem.drawDeck(ctx, canvas);

    //Shows player's deck after each level completed to show reward cards
    if(showDeckPreview){
        cardSystem.drawDeck(ctx, canvas);
        deckPreviewTimer += deltaTime;
        if(deckPreviewTimer >= 5000){ //Only during 5 seconds
            showDeckPreview = false;
            cardSystem.isDeckOpen = false;
            nextLevelLevel1 = true; //Then switch scenes
        }
    }
}

//HEALTH BAR
function drawHealthBar(ctx, x, y, width, height, current, max) { //current from db and max is const
    // background (lost health)
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
        ctx.fillStyle = i < current ? "red" : "gray";  //gray if heart is lost
        ctx.fillText("♥", x + i * 50, y);
    }
}

//========================= UPDATE LOGIC =========================
function update(deltaTime){
    if (!player) return; //avoids crash
     levelTimer += deltaTime;

    if (player.hearts <= 0) {
        gameOver = true;
        gameOverBox.show();
        return;
    }

    //Time Based random card event
    if (!cardEventTriggered && levelTimer >= randomEventTime) {
        console.log("EVENT TRIGGERED");
        cardEventTriggered = true;
        triggerCardEvent();
    }
    //Player movement
    player.isMoving = false;

    const goLeft  = keysDown["ArrowLeft"];
    const goRight = keysDown["ArrowRight"];
    const groundY = 450;

    player.update(goLeft, goRight, jumpPressed, platforms, groundY, deltaTime);
    jumpPressed = false;  //reset after player jumped

    //Limit player position inside the world
    if (player.position.x < player.halfSize.x)
        player.position.x = player.halfSize.x;
    if (player.position.x > worldWidth - player.halfSize.x)
        player.position.x = worldWidth - player.halfSize.x;

    //enemy movement
    enemies.forEach(enemy => {
        enemy.update(player, deltaTime);
        //& avoid infinite loop, bounce only if it´s on the border
        if (enemy.position.x - enemy.halfSize.x <= 0 && enemy.speed > 0)
            enemy.bounce();
        else if (enemy.position.x + enemy.halfSize.x >= worldWidth && enemy.speed < 0)
            enemy.bounce();
    });

    player.attackEnemy(enemies);  //player attacks enemies

    let totalLenEnemies = enemies.length;
    enemies = enemies.filter(alive => alive.hp > 0);  //remove dead enemies
    let prevKilled = killedEnemies;
    killedEnemies += totalLenEnemies - enemies.length;
    updateCoins(player, prevKilled, killedEnemies);
    


    //---spawn ---
    spawnTimer += deltaTime;
    if (spawnTimer >= spawnInterval) {
        if (killedEnemies < conditionEnemies) {
            //& agrega un enemigo justo afuera del borde de la camara, asi parece que parecen fuera del mundo
            enemies.push(spawnEnemy(cameraX + canvasRef.width + 100, 450, currentLevelConfig.enemyConfig));
        }
        console.log(`enemies: ${enemies.length}`);
        spawnTimer = 0;
    }
    //Condition for next level, first message box for reward
    if(killedEnemies >= conditionEnemies && !levelCompleted){
        levelCompleted = true;
        giveLevelRewards();
        levelCompletedBox.show();
    }

    cameraX = updateCamera(
        player.position.x,
        canvasRef.width,
        worldWidth
    );
    //Random Platforms
    let last = platforms[platforms.length - 1];

    if(player.position.x > last.x - 500){
        platforms.push(generatePlatform(last));
    }

    cardSystem.update(deltaTime); // actualiza efectos temporales (duración de cartas)
}

//========================= INPUT HANDLERS =========================
function handleMouseMoveLevel1(event, canvas){
    const pos = handleMouseMove(event, canvas);
    mouseX = pos.x;
    mouseY = pos.y;
}

function handleClickLevel1(){

    if(levelCompleted){
        return levelCompletedBox.handleClick(mouseX, mouseY);
    }
    if(gameOver){
        return gameOverBox.handleClick(mouseX, mouseY);
    }
    if(isPaused){
        return pauseBox.handleClick(mouseX, mouseY);
    }
    //Player's Deck
    if(cardSystem.isDeckOpen){
        cardSystem.handleDeckClick(mouseX, mouseY, canvasRef);
        return;
    }
    //Random Deck (card selection overlay)
    if(cardSystem.isActive){
        cardSystem.handleClick(mouseX, mouseY, canvasRef);
        return;
    }

    //Handles attacks, cards, and powerups
}

function handleKeyDownLevel1(event){
    if(event.repeat) return;

    //PauseMessage
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

    //Open Player's Deck
    if(event.key === "c" || event.key === "C"){
        cardSystem.toggleDeck();
    }
    //Jump
    if(event.key === " "){
        jumpPressed = true;
    }
    //Attack
    if(event.key === "j"){
        if(!player.playeratack){
            player.playeratack = true;
            player.attackFrames = 0;
        }
    }
}

function handleKeyUpLevel1(event){
    keysDown[event.key] = false;

    if(event.key === " "){
        jumpPressed = false;
    }
}


//========================= RESET =========================
function resetLevel1(){
     // reset player
     // nextLevelLevel1 = false;
    player.position.x = 200;
    player.position.y = 350;
    player.velocityY = 0;
    player.hp = player.maxHp;
    player.hearts = player.maxHearts;

    //levelCompleted variables
    levelCompleted = false;
    showDeckPreview = false;
    deckPreviewTimer = 0;
    levelCompletedBox.hide();
    // reset enemies
    enemies = currentLevelConfig.spawnPositions.map(pos =>
        spawnEnemy(pos.x, pos.y, currentLevelConfig.enemyConfig)
    );
    killedEnemies = 0;

    gameOver = false;

    //reset platforms
    initPlatforms();

    // reset camera
    cameraX = 0;

    // reset spawn
    spawnTimer = 0;

    levelTimer = 0;
    randomEventTime = Math.random() * (40 - 20) + 20;
    cardEventTriggered = false;
    cardSystem.close();
    cardSystem.isDeckOpen = false;
}
function getPlayerLevel1(){
    return player;
}

//========================= EXPORTS =========================
export {
    getPlayerLevel1,
    drawLevel1,
    handleMouseMoveLevel1,
    handleClickLevel1,
    resetLevel1,
    handleKeyDownLevel1,
    handleKeyUpLevel1,
    setSelectedCharacter,
    goToMenuLevel1,
    nextLevelLevel1
}
