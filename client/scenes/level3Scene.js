import { PlayerBase } from "../objects/PlayerBase.js";
import { Vector } from "../libs/Vector.js";
import { MessageBox } from "../objects/MessageBox.js";
//import { cardsOnCanvas } from "../cards/cardsOnCanvas.js";
//import { cards } from "../cards/Card.js";
import { handleMouseMove } from "../libs/game_functions.js";
import { level3Config, playerConfigs } from "../libs/levelConfig.js";
import { spawnEnemy, generatePlatform, updateCamera } from "../libs/level_functions.js";
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
let cameraX = 0; //canvas viewport

// Mouse
let mouseX = 0
let mouseY = 0

let player

//LEVEL TIMER
let levelTimer = 0;

// random trigger between 20s and 40s (considering 1 minute per level)
let randomEventTime = Math.random() * (40 - 20) + 20;

let keysDown = {}; //To track keyboard input for player movement
let jumpPressed = false; //Prevents continuous jumping when holding the key

let killedEnemies = 0;
const conditionEnemies = 15;

//========================= CARD SYSTEM =========================
let playerDeck = []; 
let isDeckOpen = false;
let selectedDeckIndex = -1;

let cardEventTriggered = false;

let cardOptions = []; // the 3 cards
let selectedCard = null;
let selectedIndex = -1;
let isCardActive = false;
let cardBackImage = new Image();
cardBackImage.src = "./assets/cards/powerup/BaseCard.png";

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

//DOESN´T WORK, MUST CONNECT WITH SWITCH SCENE
pauseBox.addButton("Home", 440, 390, 120, 35, () => {
    goToMenuLevel2 = true;
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
let spawnInterval = 4000; // 2000 ms = 2 seconds

//========================= CARD SYSTEM =======================
let cardBox = new MessageBox(
    "CHOOSE YOUR FATE",
    "Select one card",
    200, 100, 600, 350
);
let deckBox = new MessageBox(
    "CHOOSE A CARD",
    "",
    150, 50,   // posición
    700, 500   // tamaño
);

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

        let cardWidth = 100;
        let cardHeight = 150;
        // shadow
        ctx.fillStyle = "rgba(0,0,0,0.4)";
        ctx.fillRect(x + 5, y + 5, cardWidth, cardHeight);

    
        ctx.strokeStyle = "rgba(255,255,255,0.3)";
        ctx.strokeRect(x, y, cardWidth, cardHeight);

        // =========================
        // If there is card
        // =========================
        if(i < playerDeck.length){

            let card = playerDeck[i];

            // card background
            ctx.fillStyle = "#2c2c2c";
            ctx.fillRect(x, y, 100, 150);

            ctx.strokeStyle = "white";
            ctx.strokeRect(x, y, 100, 150);

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

        selectedIndex = -1;
        selectedCard = null;

    }catch(err){
        console.log("ERROR:", err);

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

    isCardActive = true;

    await generateCardOptions();

    assignCardImages();

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
            if(card.image){
                ctx.drawImage(
                    card.image,
                    0, 0, card.image.width, card.image.height,
                    x, y, width, height
                );
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
            player.hp += 20;
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
function drawLevel3(ctx, canvas, deltaTime){  //TODO DRAW MUST CHANGE TO CAMERA VIEW
    if (!player) return; //avoids crash
    //Clear → update → draw objects
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for(let i = 0; i < worldWidth; i += canvas.width){
        ctx.drawImage(backgroundImage, i - cameraX, 0, canvas.width, canvas.height); //draw background
    }   

    if(!isPaused && !isCardActive){
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
    killedEnemies += totalLenEnemies - enemies.length;  //update killed enemies

    //---spawn ---
    spawnTimer += deltaTime;
    //console.log(`spawntimer: ${spawnTimer}`)
    if (spawnTimer >= spawnInterval) {
        if (killedEnemies != conditionEnemies) {
            //& agrega un enemigo justo afuera del borde de la camara, asi parece que parecen fuera del mundo
            enemies.push(spawnEnemy(cameraX + canvas.width + 100, 450, currentLevelConfig.enemyConfig));
        }
        console.log(`enemies: ${enemies.length}`);
        spawnTimer = 0;
    }

    cameraX = updateCamera(
        player.position.x,
        canvas.width,
        worldWidth
    );
    //Random Platforms
    let last = platforms[platforms.length - 1];

    if(player.position.x > last.x - 500){
        platforms.push(generatePlatform(last)); 
    }
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

function handleKeyDownLevel3(event){
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

function handleKeyUpLevel3(event){
    keysDown[event.key] = false;

    if(event.key === " "){
        jumpPressed = false;
    }
}


//========================= RESET =========================
function resetLevel3(){
     // reset player
    player.position.x = 200;
    player.position.y = 350;
    player.velocityY = 0;
    player.hp = player.maxHp;

    // reset enemies
    enemies = currentLevelConfig.spawnPositions.map(pos =>
        spawnEnemy(pos.x, pos.y, currentLevelConfig.enemyConfig)
    );

    //reset platforms
    initPlatforms();

    // reset camera
    cameraX = 0;

    // reset spawn
    spawnTimer = 0;

    levelTimer = 0;
    randomEventTime = Math.random() * (40 - 20) + 20;
    cardEventTriggered = false;
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