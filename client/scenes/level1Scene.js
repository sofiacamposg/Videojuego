import { PlayerBase } from "../objects/PlayerBase.js";
import { Vector } from "../libs/Vector.js";
import { MessageBox } from "../objects/MessageBox.js";
import { cardsOnCanvas } from "../cards/cardsOnCanvas.js";
import { cards, applyEffect, reverseEffect, cardImages } from "../cards/Card.js";
import { handleMouseMove } from "../libs/game_functions.js";
import { level1Config, playerConfigs } from "../libs/levelConfig.js";
import { spawnEnemy, generatePlatform, updateCamera, updateCoins, drawCoins, saveMatch } from "../libs/level_functions.js";
"use strict"

let currentLevelConfig = level1Config;
//========================= GAME CORE VARIABLES =========================
let currentLevel = 1;
//======= LEVEL TRANSITION =======
let levelCompleted = false;
let matchSaved = false;
let showDeckPreview = false;
let deckPreviewTimer = 0;
//world size
let worldWidth = 2000;
let worldHeight = 600;
let cameraX = 0;
let canvasRef = { width: 1000 };

let mouseX = 0
let mouseY = 0

let player
let nextLevelLevel1 = false;

let levelTimer = 0;

// random trigger between 20s and 40s (considering 1 minute per level)
let randomEventTime = Math.random() * (40- 20) + 20;

let keysDown = {};
let jumpPressed = false;

let killedEnemies = 0;
const conditionEnemies = 10;

//========================= CARD SYSTEM =========================
let cardEventTriggered = false;
let cardOptions = [];

const cardSystem = new cardsOnCanvas();

const game = {
    spawnEnemy: () => spawnEnemy(cameraX + canvasRef.width + 100, 450, currentLevelConfig.enemyConfig)
};


//========================= PAUSE SYSTEM =========================
let isPaused = false;
let goToMenuLevel1 = false;

let pauseBox = new MessageBox(
    "PAUSED",
    "Game is paused",
    250, 150, 500, 300
);

//========================= CONFIRM BOX =========================
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
//====LEVEL TRANSITION MESSAGE BOX AND BUTTON NEXT LEVEL======
let levelCompletedBox = new MessageBox(
    "LEVEL COMPLETED",
    "You survived the arena.\n The emperor is watching, do your best!",
    250, 150, 500, 300
);

levelCompletedBox.addButton("Next Level", 420, 350, 150, 40, () => {
    levelCompletedBox.hide();
    showDeckPreview = true;
    deckPreviewTimer = 0;
    cardSystem.isDeckOpen = true;
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
    spawnEnemy(pos.x, pos.y, currentLevelConfig.enemyConfig)
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

        if(!response.ok) throw new Error("API failed");

        const data = await response.json();

        let powerUps = data.filter(c => c.effect_type === "POWER_UP");
        let punishments = data.filter(c => c.effect_type === "PUNISHMENT");

        const shuffle = arr => arr.sort(() => Math.random() - 0.5);

        powerUps = shuffle(powerUps);
        punishments = shuffle(punishments);

        if(powerUps.length < 2 || punishments.length < 1) throw new Error("Not enough cards");

        cardOptions = shuffle([powerUps[0], powerUps[1], punishments[0]]);

    }catch(err){
        console.log("Card API error, using fallback:", err);
        //fallback uses same shape as DB so triggerCardEvent can build the card objects correctly
        cardOptions = [
            { card_id: null, card_name: "Favor of the People", effect_type: "POWER_UP",  effect_from: "player", effect_modifies: "speed",  effect_operator: "*", effect_reverse_operator: "/", value_effect: 1.2, reverse_value: 1.2, duration: 0 },
            { card_id: null, card_name: "Blade of Mars",        effect_type: "POWER_UP",  effect_from: "player", effect_modifies: "damage", effect_operator: "*", effect_reverse_operator: "/", value_effect: 1.3, reverse_value: 1.3, duration: 0 },
            { card_id: null, card_name: "Wrath of Jupiter",     effect_type: "PUNISHMENT",effect_from: "player", effect_modifies: "hearts", effect_operator: "-", effect_reverse_operator: "+", value_effect: 1,   reverse_value: 1,   duration: 0 },
        ];
    }
}

async function triggerCardEvent(){
    console.log("EVENT TRIGGERED");
    await generateCardOptions();

    // build card objects from the DB data — the DB already has all the effect info
    // so we don't need the old effectNameToCard lookup anymore
    const convertedCards = cardOptions.map(apiCard => ({
        id:    apiCard.card_id,
        name:  apiCard.card_name,
        type:  apiCard.effect_type,        //POWER_UP or PUNISHMENT
        duration: apiCard.duration,
        image: cardImages[apiCard.card_name] || null,  //grab the sprite that matches this card name

        //bind applyEffect/reverseEffect from Card.js, passing the apiCard data so it knows what to modify
        applyEffect:  (player, enemies, game) => applyEffect(apiCard, player, enemies, game),
        removeEffect: apiCard.duration > 0
            ? (player, enemies, game) => reverseEffect(apiCard, player, enemies, game)
            : null,  //permanent cards don't need a reversal
    }));

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
    if (!player) return;
    canvasRef = canvas;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for(let i = 0; i < worldWidth; i += canvas.width){
        ctx.drawImage(backgroundImage, i - cameraX, 0, canvas.width, canvas.height);
    }

    if(!isPaused && (!cardSystem.isActive || showDeckPreview)){
        update(deltaTime);
    }

    ctx.save();
    ctx.translate(-cameraX, 0);

    player.draw(ctx);
    drawPlatforms(ctx);
    enemies.forEach(enemy => enemy.draw(ctx));

    ctx.restore();

    drawHealthBar(ctx, 30, 20, 100, 30, player.hp, player.maxHp);
    ctx.font = "50px Arial";
    drawHearts(ctx, 150, 50, player.hearts, player.maxHearts);
    drawCoins(ctx, 30, 100, player.coins);
    pauseBox.draw(ctx);
    confirmBox.draw(ctx);

    if(gameOver){
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
    ctx.fillStyle = "green";
    ctx.fillText("HP: " + player.hp, 30, 70);


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

    if(player.hearts <= 0){
        gameOver = true;
        gameOverBox.show();
        if (!matchSaved) {
            matchSaved = true;
        //API COnnection, async function from level_funtions
        saveMatch({
            player_id: 1,
            archetype_id: 1,
            duration_seconds: levelTimer,
            level_reached: currentLevel,
            final_fame: killedEnemies,
            life: player.hearts,
            result: "LOSE"
        });
        }
        return;
    }

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
    enemies = enemies.filter(alive => alive.hp > 0);  //remove dead enemies
    let prevKilled = killedEnemies;
    killedEnemies += totalLenEnemies - enemies.length;
    updateCoins(player, prevKilled, killedEnemies);
    


    spawnTimer += deltaTime;
    if (spawnTimer >= spawnInterval) {
        if (killedEnemies < conditionEnemies) {
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
        //API connection, async function from level_functions
        if (!matchSaved) {
            matchSaved = true;
        saveMatch({
            player_id: 1,
            archetype_id: 1,
            duration_seconds: levelTimer,
            level_reached: currentLevel,
            final_fame: killedEnemies,
            life: player.hearts,
            result: "WIN"
        });
        }
    }

    cameraX = updateCamera(player.position.x, canvasRef.width, worldWidth);

    let last = platforms[platforms.length - 1];
    if(player.position.x > last.x - 500){
        platforms.push(generatePlatform(last));
    }

    cardSystem.update(deltaTime);
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
    if(confirmBox.visible){
        return confirmBox.handleClick(mouseX, mouseY);
    }
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

function handleKeyDownLevel1(event){
    if(event.repeat) return;

    if(event.key === "Escape"){
        if(confirmBox.visible){
            confirmBox.hide();
            return;
        }
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

function handleKeyUpLevel1(event){
    keysDown[event.key] = false;
    if(event.key === " "){
        jumpPressed = false;
    }
}

//========================= RESET =========================
function resetLevel1(){
    player.position.x = 200;
    player.position.y = 350;
    player.velocityY = 0;
    player.hp = player.maxHp;
    player.hearts = player.maxHearts;

    //levelCompleted variables
    levelCompleted = false;
    matchSaved = false;
    showDeckPreview = false;
    deckPreviewTimer = 0;
    levelCompletedBox.hide();
    // reset enemies
    enemies = currentLevelConfig.spawnPositions.map(pos =>
        spawnEnemy(pos.x, pos.y, currentLevelConfig.enemyConfig)
    );
    killedEnemies = 0;

    gameOver = false;
    isPaused = false;
    pauseBox.hide();
    confirmBox.hide();
    initPlatforms();

    cameraX = 0;
    spawnTimer = 0;

    levelTimer = 0;
    randomEventTime = Math.random() * (40 - 20) + 20;
    cardEventTriggered = false;
    cardSystem.close();
    cardSystem.isDeckOpen = false;
}

function resetGoToMenu(){
    goToMenuLevel1 = false;
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
    nextLevelLevel1,
    resetGoToMenu
}