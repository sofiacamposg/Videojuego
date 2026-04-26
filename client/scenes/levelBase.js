import { PlayerBase } from "../objects/PlayerBase.js";
import { Vector } from "../libs/Vector.js";
import { MessageBox } from "../objects/MessageBox.js";
import { cardsOnCanvas } from "../cards/cardsOnCanvas.js";
import { applyEffect, reverseEffect, cardImages } from "../cards/Card.js";
import { handleMouseMove } from "../libs/game_functions.js";
import { level1Config, level2Config, level3Config, playerConfigs } from "../libs/levelConfig.js";
import { spawnEnemy, generatePlatform, updateCamera, updateFame, drawFame, saveMatch, drawFog, imperialDecree,
        pauseScreen, loadPlayerStats } from "../libs/level_functions.js";
"use strict"
//* game core variables
//? level transition 
let levelCompleted = false;  
let showDeckPreview = false;
let deckPreviewTimer = 0;
let levelTimer = 0;  //how much does the player take in one level? (fame, cards gained)
let randomEventTime = Math.random() * (40000 - 20000) + 20000;  //when will the event trigger?
//? world config
let worldWidth = 2000;
let worldHeight = 600;
let cameraX = 0;
let canvasRef = { width: 1000 }; 
let mouseX = 0
let mouseY = 0
let backgroundImage = new Image();
backgroundImage.src = currentLevelConfig.background;
//? player/enemy variables
let player
let keysDown = {};
let jumpPressed = false;
let killedEnemies = 0;
let spawnTimer = 0;  //we check spawntimer and interval to know when to spawn a new enemy
let spawnInterval = 4000;  
//? music
const swordSound = new Audio("./assets/music/ataque_espada.mp3");  //attack
swordSound.volume = 0.5;
//? card system
let cardEventTriggered = false;  //mid game event
let cardOptions = [];  //3 cards shown in screen
const cardSystem = new cardsOnCanvas();     
const game = {  //imperial decree effect
    spawnEnemy: () => spawnEnemy(cameraX + canvasRef.width + 100, 450, currentLevelConfig.enemyConfig),
};
//? pause
let isPaused = false;
let goToMenuLevel1 = false;
//? platforms
let platforms = [];  //array to store platforms displayed
let platformImage = new Image();
platformImage.src = "./assets/Platform.png";
function initPlatforms(){
    platforms = [];  //clean the array before starting
    for(let i = 0; i < 8; i++){
        if(platforms.length === 0){  
            platforms.push({ x:300, y:300, width:100, height:70 });
        } else {
            let last = platforms[platforms.length - 1];
            platforms.push(generatePlatform(last));
        }
    }
}
function drawPlatforms(ctx){  //draw all the platforms in the array
    platforms.forEach(p=>{
        ctx.drawImage(platformImage, p.x, p.y - 70, p.width, p.height);
    });
}
//? initial config for all the game
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
//* API - Cards logic
async function generateCardOptions(){  //? take 3 cards from db and put it into an array
    try{
        const response = await fetch("http://localhost:3000/cards/random"); //ask the server for 15 random cards from the db

        if(!response.ok) throw new Error("API failed");  //edge case

        const data = await response.json();  //convert the server response into a js array we can work with
        //split the 15 cards into two groups
        let powerUps = data.filter(c => c.effect_type === "POWER_UP");
        let punishments = data.filter(c => c.effect_type === "PUNISHMENT");

        if(powerUps.length < 2 || punishments.length < 1) throw new Error("Not enough cards");  //endge case

        const shuffle = arr => arr.sort(() => Math.random() - 0.5);  //shuffle just the 3 picked cards so their position on screen is random
        cardOptions = shuffle([powerUps[0], powerUps[1], punishments[0]]);

    }catch(err){
        console.log("Card API error, using fallback:", err);
        //server is down or something broke — use hardcoded cards so the game doesn't stop
        cardOptions = [
            { card_id: null, card_name: "Favor of the People", effect_type: "POWER_UP",  effect_from: "player", effect_modifies: "speed",  effect_operator: "*", effect_reverse_operator: "/", value_effect: 1.2, reverse_value: 1.2, duration: 0 },
            { card_id: null, card_name: "Blade of Mars", effect_type: "POWER_UP",  effect_from: "player", effect_modifies: "damage", effect_operator: "*", effect_reverse_operator: "/", value_effect: 1.3, reverse_value: 1.3, duration: 0 },
            { card_id: null, card_name: "Wrath of Jupiter", effect_type: "PUNISHMENT",effect_from: "player", effect_modifies: "hearts", effect_operator: "-", effect_reverse_operator: "+", value_effect: 1, reverse_value: 1, duration: 0 },
        ];
    }
}
async function triggerCardEvent(){  //? uses array from generateCardOptions when the event is triggered
    console.log("EVENT TRIGGERED");
    await generateCardOptions();  //waits for cardOption array

    // build card objects from the DB data for the js to use
    const convertedCards = cardOptions.map(apiCard => ({
        id: apiCard.card_id,
        name: apiCard.card_name,
        type: apiCard.effect_type,  //POWER_UP or PUNISHMENT
        duration: apiCard.duration,
        image: cardImages[apiCard.card_name] || null,  //grab the sprite that matches the card name

        //instead of calling applyEffect right now, we store it as a recipe to run later
        //apicard stays inside (closure) so it remembers which card's data to use
        // it only actually runs when the player confirms their pick
        applyEffect: (player, enemies, game) => applyEffect(apiCard, player, enemies, game),
        removeEffect: apiCard.duration > 0 ? (player, enemies, game) => reverseEffect(apiCard, player, enemies, game) : null,
    }));
    cardSystem.show(convertedCards, player, enemies, game);  //show cards for the player to select
}
async function giveLevelRewards(){  //? reward cards, depending on fame, after level completition
    //targetTime lives in levelConfig so it can also be used for fame calculations
    //if levelTimer is lower than targetTime, the user gets 2 power ups 
    const rewardCount = levelTimer < currentLevelConfig.targetTime ? 2 : 1;
    try {
        const response = await fetch("http://localhost:3000/cards/random");  //ask the server for random cards
        if(!response.ok) throw new Error("API failed");  //edge case
        const data = await response.json();
       
        const powerUps = data.filter(c => c.effect_type === "POWER_UP"); //rewards are only power ups
        const shuffled = powerUps.sort(() => Math.random() - 0.5);  //mix the powerups to obtain different options everytime

        //take only the first rewardCount cards and add each one to the player's deck
        shuffled.slice(0, rewardCount).forEach(apiCard => {  
            cardSystem.playerDeck.push({
                id: apiCard.card_id,
                name: apiCard.card_name,
                type: apiCard.effect_type,
                duration: apiCard.duration,                
                image: cardImages[apiCard.card_name] || null,
                //stores the function for later
                applyEffect: (player, enemies, game) => applyEffect(apiCard, player, enemies, game),
                removeEffect: apiCard.duration > 0 ? (player, enemies, game) => reverseEffect(apiCard, player, enemies, game) : null,
            });
        });
    } catch(err) {
        console.log("Could not fetch reward cards:", err);
    }
}
//* draw everything :)
function drawLevel(ctx, canvas, deltaTime){
    if (!player) return;  //skip if no player is loaded yet
    canvasRef = canvas;  //save canvas so other functions know the screen size

    ctx.clearRect(0, 0, canvas.width, canvas.height);  //clean the screen before drawing the new frame
    for(let i = 0; i < worldWidth; i += canvas.width){  //duplicate the background image to fill the whole world
        ctx.drawImage(backgroundImage, i - cameraX, 0, canvas.width, canvas.height); }
    //TODO
    if(!isPaused && (!cardSystem.isActive || showDeckPreview)){  //only run game logic when not paused and no card menu is open
        update(deltaTime);
    }

    ctx.save();
    ctx.translate(-cameraX, 0);  //shift drawing so the camera follows the player

    player.draw(ctx);
    drawPlatforms(ctx);
    enemies.forEach(enemy => enemy.draw(ctx));

    ctx.restore();  //undo the camera shift so next things draw at their normal position

    drawFog(ctx, canvas, game);  //amphitheatre fog effect

    drawHealthBar(ctx, 30, 20, 100, 30, player.hp, player.maxHp);
    ctx.font = "50px VT323";
    drawHearts(ctx, 150, 50, player.hearts, player.maxHearts);
    drawCoins(ctx, 30, 100, player.coins);
    pauseBox.draw(ctx);
    confirmBox.draw(ctx);

    if(gameOver){
        gameOverBox.draw(ctx);
        return;
    }
    
    // cardsOnCanvas dibuja la selección de cartas y el deck del jugador
    if(levelCompleted){
        levelCompletedBox.draw(ctx);
    }

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

