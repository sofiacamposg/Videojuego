//========================= IMPORTS =========================
import { Player1 } from "../objects/Player1.js";
import { Player2 } from "../objects/Player2.js";
import { Player3 } from "../objects/Player3.js";
import { Vector } from "../libs/Vector.js";
import { EnemyBase } from "../objects/EnemyBase.js";
import { MessageBox } from "../objects/MessageBox.js";
import { cardsOnCanvas } from "../cards/cardsOnCanvas.js";
import { cards } from "../cards/Card.js";

"use strict"

//========================= GAME CORE VARIABLES =========================
//* GAME'S LOGIC

//world size
let worldWidth = 2000;
let worldHeight = 600;
let cameraX = 0; //canvas viewport

// Mouse
let mouseX = 0
let mouseY = 0

let player

//Cards
const cardShown = new cardsOnCanvas();

/* For HTML stats (User stats)
let levelTime = 0;
let lastTome = 0; */
//---player data---
const guerreroConfig = {
    hp: 120, maxHp: 120, speed: 5, damage: 20,
    walkRightSrc:   "./assets/player1/1.png",
    walkLeftSrc:    "./assets/player1/2.png",
    jumpRightSrc:   "./assets/player1/3.png",
    jumpLeftSrc:    "./assets/player1/4.png",
    attackRightSrc: "./assets/player1/attackright.png",
    attackLeftSrc:  "./assets/player1/attackleft.png",
};

const lanceroConfig = {
    hp: 100, maxHp: 100, speed: 6, damage: 25,
    walkRightSrc:   "./assets/player2/5.png",
    walkLeftSrc:    "./assets/player2/6.png",
    jumpRightSrc:   "./assets/player2/7.png",
    jumpLeftSrc:    "./assets/player2/8.png",
    attackRightSrc: "./assets/player2/attackright.png",
    attackLeftSrc:  "./assets/player2/attackleft.png",
};

const pesadoConfig = {
    hp: 150, maxHp: 150, speed: 3, damage: 20,
    walkRightSrc:   "./assets/player3/9.png",
    walkLeftSrc:    "./assets/player3/10.png",
    jumpRightSrc:   "./assets/player3/11.png",
    jumpLeftSrc:    "./assets/player3/12.png",
    attackRightSrc: "./assets/player3/attackright.png",
    attackLeftSrc:  "./assets/player3/attackleft.png",
};
let keysDown = {}; //To track keyboard input for player movement
let jumpPressed = false; //Prevents continuous jumping when holding the key

//========================= CARD SYSTEM =========================
let playerDeck = []; 
let isDeckOpen = false;
let selectedDeckIndex = -1;

let kills = 10;
let triggerPoint = 10; // when event triggers
let cardEventTriggered = false;

let cardOptions = []; // the 3 cards
let selectedCard = null;
let selectedIndex = -1;
let isCardActive = false;
let cardBackImage = new Image();
cardBackImage.src = "./assets/cards/powerup/BaseCard.png";


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
    console.log('continue');
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

//HITBOX
/*platforms.push({
    x: 300,
    y: 320,
    width: 100,
    height: 70
}); */

function initPlatforms(){
    platforms = [];
    for(let i = 0; i < 8; i++){
        generatePlatform();
    }
}

function drawPlatforms(ctx){
    platforms.forEach(p=>{
        ctx.drawImage(platformImage, p.x, p.y - 37, p.width, p.height);
    });
}

//This functions avoids running out of platforms
function generatePlatform(){
    let x, y;

    if(platforms.length === 0){
        x = 300;
        y = 300;
    } else {
        let last = platforms[platforms.length - 1];

        x = last.x + Math.random() * 150 + 150;
        y = last.y + (Math.random() - 0.5) * 120;

        if(y > 350) y = 350;
        if(y < 180) y = 180;
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

//FIX THIS FUNCTION
let totalSpawned = 0;
let maxEnemies = 10;

function spawnEnemy(){
    let min = 1;
    let max = 15;
    let amount = Math.floor(Math.random() * (max - min + 1)) + min;

    for(let i = 0; i < amount; i++){
        if(totalSpawned >= maxEnemies) return;

        enemies.push(
            new EnemyLion(
                new Vector(
                    Math.random() * (worldWidth - player.halfSize.x - 200) + 200,
                    377
                )
            )
        );

        totalSpawned++;
    }
}
//========================= CARD SYSTEM =======================
let cardBox = new MessageBox(
    "CHOOSE YOUR FATE",
    "Select one card",
    200, 100, 600, 350
);
let deckBox = new MessageBox(
    "DECK",
    "Choose a card",
    150, 50,   // posición
    700, 500   // tamaño
);
deckBox.addButton("CONFIRM", 440, 480, 120, 50, () => {});

//API CONNECTION
//====PLAYER'S DECK====
function addCardToDeck(card){
    playerDeck.push(card);
}
function onLevelComplete(){

    // example, 2 cards reward
    let rewards = getRandomCards(2);

    rewards.forEach(card => {
        addCardToDeck(card);
    });
}
function drawDeckCards(ctx){

    let startX = deckBox.x + 80;
    let startY = deckBox.y + 110;

    let cols = 3;
    let spacingX = 220;
    let spacingY = 160;

    let maxSlots = 6; //CHANGE FOR MAX CARDS LIMIT

    for(let i = 0; i < maxSlots; i++){

        let col = i % cols;
        let row = Math.floor(i / cols);

        let x = startX + col * spacingX;
        let y = startY + row * spacingY;

        // shadow
        ctx.fillStyle = "rgba(0,0,0,0.4)";
        ctx.fillRect(x + 5, y + 5, 140, 200);

    
        ctx.strokeStyle = "rgba(255,255,255,0.3)";
        ctx.strokeRect(x, y, 100, 150);

        // =========================
        // If there is card
        // =========================
        if(i < playerDeck.length){

            let card = playerDeck[i];

            // card background
            ctx.fillStyle = "#2c2c2c";
            ctx.fillRect(x, y, 100, 150);

            ctx.strokeStyle = "white";
            ctx.strokeRect(x, y, 140, 200);

            // image
            if(card.image){
                ctx.drawImage(card.image, x + 10, y + 10, 120, 80);
            }

            // name
            ctx.fillStyle = "white";
            ctx.font = "12px Arial";
            ctx.textAlign = "center";
            ctx.fillText(card.card_name, x + 70, y + 110);

            // selection
            if(selectedDeckIndex === i){
                ctx.strokeStyle = "gold";
                ctx.lineWidth = 4;
                ctx.strokeRect(x - 2, y - 2, 144, 204);
            }
        }
    }
}
async function triggerCardEvent(){

    isCardActive = true;

    await generateCardOptions();
    assignCardImages();
    console.log("CARD OPTIONS:", cardOptions);
    cardBox.show();
}
//MISSING in the database, thats why i didnt put them here
function assignCardImages(){

    cardOptions.forEach(card => {

        let img = new Image();

        if(card.effect_name === "People Favor"){
            img.src = "./assets/cards/powerup/favor_people.png";
        }
        else if(card.effect_name === "Mars Blade"){
            img.src = "./assets/cards/powerup/blade_mars.png";
        }
        else if(card.effect_name === "Venus Blessing"){
            img.src = "./assets/cards/powerup/blessing_venus.png";
        }
        else if(card.effect_name === "Imperial Decree"){
            img.src = "./assets/cards/punishment/imperial_decree.png";
        }
        else if(card.effect_name === "Caesar Chains"){
            img.src = "./assets/cards/punishment/chains_caesar.png";
        }
        else if(card.effect_name === "Jupiter Wrath"){
            img.src = "./assets/cards/punishment/wrath_jupiter.png";
        }

        card.image = img;
    });
}
function drawCardsInBox(ctx){

    let startX = cardBox.x + 60;
    let y = cardBox.y + 100;

    let width = 140;
    let height = 200;
    let spacing = 160;

    for(let i = 0; i < cardOptions.length; i++){

        let card = cardOptions[i];
        if(!card) continue;

        let x = startX + i * spacing;

        // background
        ctx.fillStyle = "#2c2c2c";
        ctx.fillRect(x, y, width, height);

        ctx.strokeStyle = "white";
        ctx.strokeRect(x, y, width, height);

        // =========================
        // If not selected = BaseCard
        // =========================
        if(selectedIndex !== i){

            ctx.drawImage(
                cardBackImage,
                x,
                y,
                width,
                height
            );

        } 
        // =========================
        // if selected = show
        // =========================
        else{
            ctx.textAlign = "center";
            ctx.textBaseline = "top";
            if(card.image){
                ctx.drawImage(card.image, x + 10, y + 10, 120, 80);
            }

            ctx.fillStyle = "white";
            ctx.font = "12px Arial";
            ctx.fillText(card.card_name || "Unknown", x + width/2, y + 100);

            if(card.card_description){
                wrapText(ctx, card.card_description, x + width/2, y + 125, 120, 14);
            }
        }
    }
}
function wrapText(ctx, text, x, y, maxWidth, lineHeight){

    let words = text.split(" ");
    let line = "";
    let lines = [];

    for(let i = 0; i < words.length; i++){

        let testLine = line + words[i] + " ";
        let metrics = ctx.measureText(testLine);

        if(metrics.width > maxWidth && i > 0){
            lines.push(line);
            line = words[i] + " ";
        } else {
            line = testLine;
        }
    }

    lines.push(line);

    for(let i = 0; i < lines.length; i++){
        ctx.fillText(
            lines[i],
            x,
            y + i * lineHeight
        );
    }
}
function applyCard(card){ //random deck effect

    if(card.effect_type === "POWER_UP"){

        if(card.effect_name === "People Favor"){
            player.speed *= 1.2;
        }

        if(card.effect_name === "Mars Blade"){
            player.damage = (player.damage || 10) * 1.3;
        }

        if(card.effect_name === "Venus Blessing"){
            player.health += 20;
        }
    }

    if(card.effect_type === "PUNISHMENT"){

        if(card.effect_name === "Imperial Decree"){
            // spawn more enemies
        }

        if(card.effect_name === "Caesar Chains"){
            player.jumpStrength = 0;

            setTimeout(() => {
                player.jumpStrength = -15;
            }, 10000);
        }

        if(card.effect_name === "Jupiter Wrath"){
            player.health -= 20;
        }
    }
}
//========================= DRAW LOOP =========================
function draw(ctx, canvas){  //TODO DRAW MUST CHANGE TO CAMERA VIEW

    //Clear → update → draw objects
    ctx.clearRect(0,0,canvas.width,canvas.height) //clear canvas

    for(let i = 0; i < worldWidth; i+= canvas.width){
        ctx.drawImage(backgroundImage,i-cameraX,0,canvas.width,canvas.height); //draw background
    }

    //drawDeckButton(ctx);
    
    /*HTML stats (User Stats)
    let delta = time - lastTime;
    lastTime = time;
    levelTime += delta;
    document.getElementById("timer").textContent =
    (levelTime / 1000).toFixed(1) + "s"; */

    if(!isPaused && !isCardActive){
        update() //call update defined below
    }
    if(isDeckOpen){
        deckBox.draw(ctx);
        drawDeckCards(ctx);
        return;
    }

    ctx.save();  //keeps character within screen
    ctx.translate(-cameraX, 0);

    drawPlayer(ctx) //draw player sprite
    drawPlatforms(ctx);
    drawEnemies(ctx) //draw enemy sprites

    spawnTimer++;
    if (spawnTimer >= spawnInterval) {
        spawnEnemy();
        spawnTimer = 0;
    }

    ctx.restore();

    drawHealthBar(ctx, 20, 20, 100, 30, 50, 100);

    ctx.font = "50px Arial";
    drawHearts(ctx, 150, 50, 3, 5);

    pauseBox.draw(ctx);
    if(isCardActive){
        cardBox.draw(ctx);
        drawCardsInBox(ctx);
    }
    if(isDeckOpen){
        deckBox.draw(ctx);
        drawDeckCards(ctx);
        return;
    }
}


//========================= UI =========================
//HEALTH BAR
function drawHealthBar(ctx, x, y, width, height, current, max) { //current from db and max is const
    ctx.fillStyle = "gray";
    ctx.fillRect(x, y, width, height);

    const healthWidth = (current / max) * width;
    ctx.fillStyle = "green";
    ctx.fillRect(x, y, healthWidth, height);

    ctx.strokeStyle = "white";
    ctx.lineWidth = 2;
    ctx.strokeRect(x, y, width, height);
}

//HEARTS
function drawHearts(ctx, x, y, current, max) { //current from db and max is const
    const heartValue = 1;
    const totalHearts = max / heartValue;
    const filledHearts = Math.ceil(current / heartValue);

    for (let i = 0; i < totalHearts; i++) {
        ctx.fillStyle = i < filledHearts ? "red" : "gray";
        ctx.fillText("♥", x + i * 50, y);
    }
}

//========================= UPDATE LOGIC =========================
function update(){
    if(isDeckOpen) return;

    if (!cardEventTriggered && kills >= triggerPoint) {
        cardEventTriggered = true;
        triggerCardEvent();
    }
    //Player movement
    player.isMoving = false;

    const goLeft  = keysDown["ArrowLeft"] || keysDown['a'];
    const goRight = keysDown["ArrowRight"] || keysDown['d'];

    if (goLeft && !goRight) {
        player.position.x -= player.speed;
        player.isMoving = true;
        player.direction = "left";

    } else if (goRight && !goLeft) {
        player.position.x += player.speed;
        player.isMoving = true;
        player.direction = "right";
    }

    //Jump logic
    if (jumpPressed && player.isOnGround){
        player.velocityY = player.jumpStrength;
        player.isOnGround = false;
        jumpPressed = false;
    }
    
    player.velocityY += player.gravity;
    player.position.y += player.velocityY;

    //Platform collision
    player.isOnGround = false;

    platforms.forEach(p => {
        let playerBottom = player.position.y + player.halfSize.y;
        let isFalling = player.velocityY >= 0;

        let withinX =
            player.position.x + player.halfSize.x > p.x &&
            player.position.x - player.halfSize.x < p.x + p.width;

        let touchingTop =
            playerBottom >= p.y &&
            playerBottom <= p.y + p.height;

        if (isFalling && withinX && touchingTop) {
            player.position.y = p.y - player.halfSize.y;
            player.velocityY = 0;
            player.isOnGround = true;
        }
    });

    //Ground limit
    let groundY = 350;

    if (player.position.y >= groundY){
        player.position.y = groundY;
        player.velocityY = 0;
        player.isOnGround = true;
    }

    //World limits
    if (player.position.x < player.halfSize.x) {
        player.position.x = player.halfSize.x;
    }

    if (player.position.x > worldWidth - player.halfSize.x) {
        player.position.x = worldWidth - player.halfSize.x;
    }

    //enemy movement
    enemies.forEach(enemy=>{
        enemy.position.x -= 1;
    });

    //camera follows player
    cameraX = player.position.x - canvas.width/2;

    if (cameraX < 0) {
        cameraX = 0;
    }

    if (cameraX > worldWidth - canvas.width){
        cameraX = worldWidth - canvas.width;
    }

    //Random Platforms
    let last = platforms[platforms.length - 1];
    if(player.position.x > last.x - 500){
        generatePlatform();
    }
}


//========================= DRAW ENTITIES =========================
function drawPlayer(ctx){
    player.update();
    player.draw(ctx);
}

function drawEnemies(ctx){
    enemies.forEach(enemy=>{
        enemy.update();
        enemy.draw(ctx);
    });
}


//========================= INPUT HANDLERS =========================
function handleMouseMove(event,canvas){ //Standard mouse tracking function
    const rect = canvas.getBoundingClientRect()
    mouseX = event.clientX - rect.left
    mouseY = event.clientY - rect.top
}

function handleClick(){
    if (cardShown.isActive) {  //track mouse in card acreen 
        cardShown.handleClick(mouseX, mouseY, canvas);
        return;
    }

    if(isPaused){
        return pauseBox.handleClick(mouseX, mouseY);
    }
    //Player's Deck
    if(isDeckOpen){

        let startX = deckBox.x + 60;
        let startY = deckBox.y + 80;
        let cols = 4;
        let spacingX = 150;
        let spacingY = 220;
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

        let width = 120;
        let height = 180;
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
                }, 3000); // 3 seconds to see the chosen card

                return;
            }
        }
    }

    //Handles attacks, cards, and powerups
}

function handleKeyDown(event){
    if(event.repeat) return;
    if(isPaused) return; 

    keysDown[event.key] = true;

    //PauseMessage
    if(event.key === "Escape"){
        isPaused = !isPaused;

        if(isPaused){
            pauseBox.show();
        } else {
            pauseBox.hide();
        }
    }
    //Open Player's Deck
    if(event.key === "c" || event.key === "C"){
        isDeckOpen = !isDeckOpen;
        selectedDeckIndex = -1;
    }
    if(isDeckOpen){
        deckBox.show();
    }else{
        deckBox.hide();
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
}


//========================= EXPORTS =========================
export { 
    draw, 
    handleMouseMove, 
    handleClick, 
    reset, 
    handleKeyDown, 
    handleKeyUp, 
    setSelectedCharacter, 
    goToMenu 
}