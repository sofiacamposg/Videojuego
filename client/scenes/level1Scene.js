import { PlayerBase } from "../objects/PlayerBase.js";
import { Vector } from "../libs/Vector.js";
import { EnemyBase } from "../objects/EnemyBase.js";
import { MessageBox } from "../objects/MessageBox.js";
import { cards } from "../cards/Card.js";
import { mouseX, mouseY } from "../libs/game_functions.js";

"use strict"

//========================= GAME CORE VARIABLES =========================
//* GAME'S LOGIC

//world size
let worldWidth = 2000;
let worldHeight = 600;
let cameraX = 0; //canvas viewport

let player

//LEVEL TIMER
let levelTimer = 0;

// random trigger between 20s and 40s (considering 1 minute per level)
let randomEventTime = Math.random() * (40 - 20) + 20;


/* For HTML stats (User stats)
let levelTime = 0;
let lastTome = 0; */
//---player data---
const guerreroConfig = {
    hp: 120, maxHp: 120, speed: 0.5, damage: 20,
    walkRightSrc:   "./assets/player1/1.png",
    walkLeftSrc:    "./assets/player1/2.png",
    jumpRightSrc:   "./assets/player1/3.png",
    jumpLeftSrc:    "./assets/player1/4.png",
    attackRightSrc: "./assets/player1/attackright.png",
    attackLeftSrc:  "./assets/player1/attackleft.png",
};

const lanceroConfig = {
    hp: 100, maxHp: 100, speed: 0.6, damage: 25,
    walkRightSrc:   "./assets/player2/5.png",
    walkLeftSrc:    "./assets/player2/6.png",
    jumpRightSrc:   "./assets/player2/7.png",
    jumpLeftSrc:    "./assets/player2/8.png",
    attackRightSrc: "./assets/player2/attackright.png",
    attackLeftSrc:  "./assets/player2/attackleft.png",
};

const pesadoConfig = {
    hp: 150, maxHp: 150, speed: 0.3, damage: 20,
    walkRightSrc:   "./assets/player3/9.png",
    walkLeftSrc:    "./assets/player3/10.png",
    jumpRightSrc:   "./assets/player3/11.png",
    jumpLeftSrc:    "./assets/player3/12.png",
    attackRightSrc: "./assets/player3/attackright.png",
    attackLeftSrc:  "./assets/player3/attackleft.png",
};
let keysDown = {}; //To track keyboard input for player movement
let jumpPressed = false; //Prevents continuous jumping when holding the key

//---enemy data ----
//config for every enemy, all the data that is only for this enemy, should change between levels
const lionConfig = {
    hp: 100, 
    damage: 5,
    speed: 0.4,
    scale: 0.8,
    walkRightSrc:   "./assets/enemy1/walkRight.png",
    walkLeftSrc:    "./assets/enemy1/walkLeft.png",
    attackRightSrc: "./assets/enemy1/attackRight.png",
    attackLeftSrc:  "./assets/enemy1/attackLeft.png",
    deathSrc: "./assets/enemy1/death.png",
};
let killedEnemies = 0;
const conditionEnemies = 20;

//========================= CARD SYSTEM =========================
let playerDeck = []; 
let isDeckOpen = false;
let selectedDeckIndex = -1;

let kills = 10; //$$
let triggerPoint = 10; // when event triggers $$
let cardEventTriggered = false;

let cardOptions = []; // the 3 cards
let selectedCard = null;
let selectedIndex = -1;
let isCardActive = false;
let cardBackImage = new Image();
cardBackImage.src = "./assets/cards/BaseCard.png";

let activeEffects = [];

let cardBox = new MessageBox("Choose a Card", "", 80, 60, 840, 500);
let deckBox = new MessageBox("Your Deck", "", 80, 60, 840, 500);


//========================= PAUSE SYSTEM =========================
let isPaused = false;
let goToMenu = false;

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
    reset();
    isPaused = false;
    pauseBox.hide();
});

//DOESN´T WORK, MUST CONNECT WITH SWITCH SCENE
pauseBox.addButton("Home", 440, 390, 120, 35, () => {
    goToMenu = true;
});


//========================= PLAYER SELECTION =========================
//This function selects the player sprite
function setSelectedCharacter(selectedCharacter){
    if (selectedCharacter === "Guerrero"){
        player = new PlayerBase(new Vector(200, 450), guerreroConfig);
    }
    else if (selectedCharacter === "Lancero"){
        player = new PlayerBase(new Vector(200, 450), lanceroConfig);
    }
    else if (selectedCharacter === "Pesado"){
        player = new PlayerBase(new Vector(200, 450), pesadoConfig);
    }
    initPlatforms();
}


//========================= ENEMIES =========================
// Enemies, random entities
let enemies = [
    new EnemyBase(new Vector(900,450), lionConfig),
    new EnemyBase(new Vector(1100,450), lionConfig),
]

//========================= PLATFORMS =========================
//Obstacles, also random entities
let platforms = [];

let platformImage = new Image();
platformImage.src = "./assets/Platform.png";

/*platforms.push({
    x: 300,
    y: 320,
    width: 100,
    height: 70
}); */

//begining with 8 platforms
function initPlatforms(){
    platforms = [];
    for(let i = 0; i < 8; i++){
        generatePlatform();
    }
}

//el -37 alinea la imagen con su hitbox
function drawPlatforms(ctx){
    platforms.forEach(p=>{
        ctx.drawImage(platformImage, p.x, p.y - 37, p.width, p.height);
    });
}

function generatePlatform(){
    let x, y;

    //fixed position platform
    if(platforms.length === 0){
        x = 300;
        y = 350;
    } else {
        let last = platforms[platforms.length - 1];

        let minGap = 200;
        let maxGap = 300;

        //separación horizontal aleatoria entre min y max
        x = last.x + Math.random() * (maxGap - minGap) + minGap;
        //variación vertical aleatoria respecto a la anterior
        y = last.y + (Math.random() - 0.5) * 120;

        //clamp para que las plataformas no salgan del rango jugable
        if(y > 340) y = 340;
        if(y < 200) y = 200;
    }

    platforms.push({
        x: x,
        y: y,
        width: 100,
        height: 70
    });
}


//========================= BACKGROUND =========================
let backgroundImage = new Image()
backgroundImage.src = "./assets/fondo2.png"; 


//========================= SPAWN SYSTEM =========================
let spawnTimer = 0;
let spawnInterval = 2000; // 2000 ms = 2 seconds

function draw(ctx, canvas, deltaTime){  //TODO DRAW MUST CHANGE TO CAMERA VIEW
    //Clear → update → draw objects
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for(let i = 0; i < worldWidth; i += canvas.width){
        ctx.drawImage(backgroundImage, i - cameraX, 0, canvas.width, canvas.height); //draw background
    }

    //drawDeckButton(ctx);
    
    /*HTML stats (User Stats)
    let delta = time - lastTime;
    lastTime = time;
    levelTime += delta;
    document.getElementById("timer").textContent =
    (levelTime / 1000).toFixed(1) + "s"; */

    if(!isPaused && !isCardActive){
        update(canvas, deltaTime);
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
    pauseBox.draw(ctx);

    if(isCardActive){
        cardBox.draw(ctx);
        drawCardsInBox(ctx);
    }
    if(isDeckOpen){
        deckBox.draw(ctx);
        drawDeckCards(ctx);
    }
}

function update(canvas, deltaTime){
    levelTimer += deltaTime;
    //Time Based random card event
    if (!cardEventTriggered && levelTimer >= randomEventTime) {
        console.log("EVENT TRIGGERED");
        cardEventTriggered = true;
        triggerCardEvent();
    }

    //---player ----
    const goLeft  = keysDown["ArrowLeft"] || keysDown['a'];
    const goRight = keysDown["ArrowRight"] || keysDown['d'];
    const playerGroundY = 450;

    player.update(goLeft, goRight, jumpPressed, platforms, playerGroundY, deltaTime);
    jumpPressed = false;  //reset after player jumped

    //Limit player position inside the world
    if (player.position.x < player.halfSize.x)
        player.position.x = player.halfSize.x;
    if (player.position.x > worldWidth - player.halfSize.x)
        player.position.x = worldWidth - player.halfSize.x;

    //---enemy ---
    enemies.forEach(enemy => {
        enemy.update(player, deltaTime);
        //& solo bounce si está en el borde Y moviéndose hacia esa pared (evita el bounce infinito)
        if (enemy.position.x - enemy.halfSize.x <= 0 && enemy.speed > 0)
            enemy.bounce();
        else if (enemy.position.x + enemy.halfSize.x >= worldWidth && enemy.speed < 0)
            enemy.bounce();
    });

    player.attackEnemy(enemies);  //player attacks enemies

    let totalLenEnemies = enemies.length;
    enemies = enemies.filter(alive => alive.hp > 0);  //remove dead enemies
    killedEnemies += totalLenEnemies - enemies.length;  //update killed enemies

    //---camera ----
    cameraX = player.position.x - canvas.width / 2;
    if (cameraX < 0) cameraX = 0;
    if (cameraX > worldWidth - canvas.width) cameraX = worldWidth - canvas.width;

    //---platforms ---
    let last = platforms[platforms.length - 1];
    if (player.position.x > last.x - 500) generatePlatform();

    //---spawn ---
    spawnTimer += deltaTime;
    if (spawnTimer >= spawnInterval) {
        if (killedEnemies != conditionEnemies) {
            //& agrega un enemigo justo afuera del borde de la camara, asi parece que parecen fuera del mundo
            enemies.push(new EnemyBase(new Vector(cameraX + canvas.width + 100, 450), lionConfig));
        }
        spawnTimer = 0;
    }

    //Active card effects (timed removal)
    updateActiveEffects();
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
};
/*//DECK BUTTON
function drawDeckButton(ctx, button) {
    const left = button.x - button.w / 2;
    const top = button.y - button.h / 2;

    ctx.fillStyle = "black";
    ctx.fillRect(left, top, button.w, button.h);

    ctx.strokeStyle = "white";
    ctx.strokeRect(left, top, button.w, button.h);

    ctx.fillStyle = "white";
    ctx.textAlign = "center";
    ctx.fillText("DECK", button.x, button.y);
};*/


//========================= CARD FUNCTIONS =========================
function triggerCardEvent() {
    let shuffled = [...cards].sort(() => Math.random() - 0.5);
    cardOptions = shuffled.slice(0, 3);
    isCardActive = true;
    cardBox.show();
}

function applyCard(card) {
    card.applyEffect(player, enemies, null);
    if (card.duration && card.removeEffect) {
        activeEffects.push({
            card,
            endTime: Date.now() + card.duration
        });
    }
}

function updateActiveEffects() {
    const now = Date.now();
    activeEffects = activeEffects.filter(effect => {
        if (now >= effect.endTime) {
            effect.card.removeEffect(player, enemies);
            return false;
        }
        return true;
    });
}

function drawCardsInBox(ctx) {
    if (cardOptions.length === 0) return;
    let startX = cardBox.x + 60;
    let y = cardBox.y + 100;
    let width = 140;
    let height = 200;
    let spacing = 160;

    for (let i = 0; i < cardOptions.length; i++) {
        let card = cardOptions[i];
        let x = startX + i * spacing;

        if (card.image && card.image.complete && card.image.naturalWidth > 0) {
            ctx.drawImage(card.image, x, y, width, height);
        } else {
            ctx.drawImage(cardBackImage, x, y, width, height);
        }

        if (selectedIndex === i) {
            ctx.strokeStyle = card.type === "powerup" ? "#D4A537" : "#C0392B";
            ctx.lineWidth = 3;
            ctx.strokeRect(x, y, width, height);
        }

        ctx.fillStyle = "white";
        ctx.font = "14px Arial";
        ctx.textAlign = "center";
        ctx.fillText(card.name, x + width / 2, y + height + 16);
        ctx.textAlign = "left";
    }
}

function drawDeckCards(ctx) {
    if (playerDeck.length === 0) return;
    let startX = deckBox.x + 80;
    let startY = deckBox.y + 110;
    let cols = 3;
    let spacingX = 220;
    let spacingY = 160;

    for (let i = 0; i < playerDeck.length; i++) {
        let card = playerDeck[i];
        let col = i % cols;
        let row = Math.floor(i / cols);
        let x = startX + col * spacingX;
        let y = startY + row * spacingY;

        if (card.image && card.image.complete && card.image.naturalWidth > 0) {
            ctx.drawImage(card.image, x, y, 140, 200);
        } else {
            ctx.drawImage(cardBackImage, x, y, 140, 200);
        }

        if (selectedDeckIndex === i) {
            ctx.strokeStyle = "#D4A537";
            ctx.lineWidth = 3;
            ctx.strokeRect(x, y, 140, 200);
        }

        ctx.fillStyle = "white";
        ctx.font = "14px Arial";
        ctx.textAlign = "center";
        ctx.fillText(card.name, x + 70, y + 216);
        ctx.textAlign = "left";
    }
}


function handleClick(){
    if(isPaused){
        return pauseBox.handleClick(mouseX, mouseY);
    }
    //Player's Deck
    if(isDeckOpen){

        let startX = deckBox.x + 80;
        let startY = deckBox.y + 110;
        let cols = 3;
        let spacingX = 220;
        let spacingY = 160;
        for(let i = 0; i < playerDeck.length; i++){
            let col = i % cols;
            let row = Math.floor(i / cols);
            let x = startX + col * spacingX;
            let y = startY + row * spacingY;
            if(
                mouseX > x && mouseX < x + 140 &&
                mouseY > y && mouseY < y + 200
            ){
                selectedDeckIndex = i;
                return;
            }
        }
        // CONFIRM BUTTON
    let confirmX = 350;
    let confirmY = 450;
    let confirmW = 120;
    let confirmH = 50;

    if(
        mouseX > confirmX &&
        mouseX < confirmX + confirmW &&
        mouseY > confirmY &&
        mouseY < confirmY + confirmH
    ){
        if(selectedDeckIndex !== -1){
            let card = playerDeck[selectedDeckIndex];
            applyCard(card);
            playerDeck.splice(selectedDeckIndex, 1);
            deckBox.hide();
            isDeckOpen = false;
            selectedDeckIndex = -1;
        }
    }
        return;
    }
    //Random Deck
    if(isCardActive){
        if(selectedIndex !== -1) return;
        if(cardOptions.length === 0) return;
        let startX = cardBox.x + 60;
        let y = cardBox.y + 100;

        let width = 140;
        let height = 200;
        let spacing = 160;

        for(let i = 0; i < 3; i++){

            let cardX = startX + i * spacing;

            if(
                mouseX > cardX &&
                mouseX < cardX + width &&
                mouseY > y &&
                mouseY < y + height
            ){
                selectedIndex = i;
                selectedCard = cardOptions[i];

                if(!selectedCard) return;

                applyCard(selectedCard);

                setTimeout(() => {
                    isCardActive = false;
                    cardBox.hide();
                    selectedIndex = -1;
                    selectedCard = null;
                    cardOptions = [];
                }, 5000); //5 seconds to see the card you've chosen

                return;
            }
        }
    }

    //Handles attacks, cards, and powerups
}

function handleKeyDown(event){
    if(event.repeat) return;

    //PauseMessage — must be checked before the isPaused guard so Escape can unpause
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
    isDeckOpen = !isDeckOpen;
    selectedDeckIndex = -1;

    if(isDeckOpen){
        deckBox.show();
    } else {
        deckBox.hide();
    }
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

function handleKeyUp(event){
    keysDown[event.key] = false;

    if(event.key === " "){
        jumpPressed = false;
    }
}


//========================= RESET =========================
function reset(){
    // reset player
    player.position.x = 200;
    player.position.y = 350;
    player.velocityY = 0;
    player.hp = player.maxHp;
    player.hearts = player.maxHearts;

    // reset enemies
    enemies = [
        new EnemyBase(new Vector(900,450), lionConfig),
        new EnemyBase(new Vector(800,450), lionConfig),
    ];
    killedEnemies = 0;

    //reset platforms
    initPlatforms();

    // reset camera
    cameraX = 0;

    // reset spawn
    spawnTimer = 0;

    //reset 

    levelTimer = 0;
    randomEventTime = Math.random() * (40 - 20) + 20;
    cardEventTriggered = false;
    cardOptions = [];
    isCardActive = false;
    activeEffects = [];
    selectedIndex = -1;
    selectedCard = null;
    cardBox.hide();
    deckBox.hide();
}


//========================= EXPORTS =========================
export { 
    draw, 
    handleClick, 
    reset, 
    handleKeyDown, 
    handleKeyUp, 
    setSelectedCharacter, 
    goToMenu 
}