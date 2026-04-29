import { PlayerBase } from "../objects/PlayerBase.js";
import { Vector } from "../libs/Vector.js";
import { MessageBox } from "../objects/MessageBox.js";
import { cardsOnCanvas } from "../cards/cardsOnCanvas.js";
import { applyEffect, reverseEffect, cardImages } from "../cards/Card.js";
import { handleMouseMove, randomRange } from "../libs/game_functions.js";
import { /*currentLevelConfig, level2Config, level3Config, */ getLevelConfig, playerConfigs } from "../libs/levelConfig.js";
import { spawnEnemy, generatePlatform, updateCamera, updateFame, drawFame, saveMatch, drawFog, imperialDecree,
        loadPlayerStats, drawHealthBar, drawHearts } from "../libs/level_functions.js";
import { FirePit, Spikes } from "../objects/hazardsBase.js";
"use strict"
//* game core variables
//? level transition 
let levelCompleted = false;  
let showDeckPreview = false;
let currentLevel = 1;
let currentLevelConfig = getLevelConfig(1);  //always starts at level 1, transitionToNextLevel() updates this
let deckPreviewTimer = 0;
let levelTimer = 0;  //how much does the player take in one level? (fame, cards gained)
let randomEventTime = randomRange(currentLevelConfig.targetTime / 2, currentLevelConfig.targetTime / 3);  //when will the event trigger?
//? world config
let worldWidth = 2000;
let worldHeight = 600;  //esto no lo usamos
let cameraX = 0;
let canvasRef = { width: 1000 }; 
let mouseX = 0
let mouseY = 0
let spikesWarningPulse = 0;
let backgroundImage = new Image();
backgroundImage.src = currentLevelConfig.background;
//? player/enemy variables
let player
let keysDown = {};
let jumpPressed = false;
let killedEnemies = 0;
let spawnTimer = 0;  //we check spawntimer and interval to know when to spawn a new enemy
let spawnInterval = 2800;  
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
let goToMenu = false;
let goToScore = false;  //signals main.js to switch to score scene after level 3
//? platforms
let platforms = [];  //array to store platforms displayed
let platformImage = new Image();
platformImage.src = "./assets/Platform.png";
function initPlatforms(){
    platforms = [];  //clean the array before starting
    for(let i = 0; i < 7; i++){
        if(platforms.length === 0){  
            platforms.push({ x:200, y:300, width:100, height:70 });
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
//? hazards, spikes on level 2, firepits on level 3
let hazards = [];  //array to store platforms displayed
function initHazards(){
    hazards = [];
    const safeZone = 40;  //no hazards near spawn
    const count = Math.random() < 0.5 ? 3 : 4;  //3 or 4 hazards per level

    for(let i = 0; i < count; i++){  //for spikes
        hazards.push(new Spikes(randomRange(worldWidth), 115));
    }
    if(currentLevel === 3){  
        for(let i = 0; i < count; i++){
            hazards.push(new FirePit(randomRange(worldWidth), 115));
        }
    }
}
//? scenes
let pauseBox = new MessageBox(  //paused scene
        "PAUSED",
        "Game is paused",
        250, 150, 500, 300
    );
let spikesWarningBox = new MessageBox(  // spikes warning
        "ATTENTION GLADIATOR!!!",
        "THERE ARE SPIKES IN THE SAND NOW!\n TRY NOT TO STEP ON THEM OR YOU'LL LOSE LIFE!",
        250, 150, 500, 300
    );
    spikesWarningBox.addButton("I'm ready", 420, 350, 160, 40, () => {
        spikesWarningBox.hide();
    });
let confirmBox = new MessageBox(  //screen appears when user click on restart or home
        "ARE YOU SURE?",
        "",
        300, 200, 400, 150
    );
    let confirmAction = null;
    confirmBox.addButton("Yes", 390, 280, 100, 35, () => {
        confirmBox.hide();
        pauseBox.hide();
        isPaused = false;
        if(confirmAction) confirmAction();
        confirmAction = null;
    });  
    confirmBox.addButton("No", 510, 280, 100, 35, () => {
        confirmBox.hide();
    });
    pauseBox.addButton("Continue", 440, 290, 120, 35, () => {
        isPaused = false;
        pauseBox.hide();
    });
    pauseBox.addButton("Restart", 440, 340, 120, 35, () => {
        confirmAction = () => {
            resetLevel();
        };
        confirmBox.show();
    });
    pauseBox.addButton("Home", 440, 390, 120, 35, () => {
        confirmAction = () => {
            goToMenu = true;
        };
        confirmBox.show();
    });
let levelCompletedBox = new MessageBox(  //message shown between levels
        "You survived the arena.",
        "Good luck, the emperor is watching!",  
        250, 150, 500, 300
    );
    levelCompletedBox.addButton("Ready for more?", 420, 350, 160, 40, () => {
    levelCompletedBox.hide();
    showDeckPreview = true;
    deckPreviewTimer = 0;
    cardSystem.rewardBox.show();
    });
let gameOver = false;  //screen and config when hearts = 0
    let gameOverBox = new MessageBox(
        "Game Over",
        "You died!\n The emperor is dissapointed in you",
        250, 150, 500, 300
    );
    gameOverBox.addButton("Go to Score", 440, 340, 120, 35, async () => {
        console.log("RESTART GAME OVER CLICKED");
        //Updates live stats, runs and defeats
        await saveMatch({
            player_id: window.loggedPlayer.player_id,
            archetype_id: selectedArchetypeId,
            duration_seconds: Math.floor(levelTimer / 1000),
            level_reached: currentLevel,
            final_fame: player.fame,
            life: Math.max(0, player.hearts),
            result: "LOSE",
            kills: killedEnemies,
            cards_in_deck: cardSystem.playerDeck.length

        });
        await fetch("http://localhost:3000/players", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ player_id: window.loggedPlayer.player_id, fame_gained: player.fame })
        });
        //DELETE DECK
        await fetch(`http://localhost:3000/player/deck/${window.loggedPlayer.player_id}`, {
            method: "DELETE"
        });
        console.log("Lose saved, match saved, going to score");
        goToScore = true;
        resetLevel();
        gameOver = false;
        gameOverBox.hide();
    }); 
    gameOverBox.addButton("Home", 440, 400, 120, 35, () => {
        goToMenu = true;
    });
//? initial config for all the game
const archetypeIds = { Warrior: 1, Lancer: 2, Heavy: 3 };  //match DB archetype IDs
let selectedArchetypeId = 1;
function setSelectedCharacter(selectedCharacter){  
    selectedArchetypeId = archetypeIds[selectedCharacter] ?? 1;
    currentLevelConfig = getLevelConfig(1);  //solve bug of db not uploading on time
    randomEventTime = randomRange(currentLevelConfig.targetTime / 2, currentLevelConfig.targetTime / 3);
    player = new PlayerBase(
        new Vector(200,450),
        playerConfigs[selectedCharacter]
    );
    player.hearts = window.loggedPlayer.hearts;
    player.maxHearts = window.loggedPlayer.hearts;
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
        //all cards have reverse effect, to the specific time when temporal, or reset when level ends
        removeEffect: (player, enemies, game) => reverseEffect(apiCard, player, enemies, game),  
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
       
        //cards offered in this levels mid-game event, excludes them from rewards so the same card can't appear twice in the same level
        const eventIds = new Set(cardOptions.map(c => c.card_id));
        const powerUps = data.filter(c => c.effect_type === "POWER_UP" && !eventIds.has(c.card_id)); //rewards are only power ups not shown in this level's event
        const shuffled = powerUps.sort(() => Math.random() - 0.5);  //mix the powerups to obtain different options everytime

        //take only the first rewardCount cards and add each one to the player's deck
        cardSystem.rewardCards = [];
        shuffled.slice(0, rewardCount).forEach(apiCard => {
            const card = {
                id: apiCard.card_id,
                name: apiCard.card_name,
                type: apiCard.effect_type,
                duration: apiCard.duration,
                image: cardImages[apiCard.card_name] || null,
                //instead of calling applyEffect right now, we store it as a recipe to run later
                //apicard stays inside (closure) so it remembers which card's data to use
                // it only actually runs when the player confirms their pick
                applyEffect: (player, enemies, game) => applyEffect(apiCard, player, enemies, game),
                //all cards have reverse effect, to the specific time when temporal, or reset when level ends
                removeEffect: (player, enemies, game) => reverseEffect(apiCard, player, enemies, game),
            };
            cardSystem.playerDeck.push(card);
            cardSystem.rewardCards.push(card);
        });
    } catch(err) {
        console.log("Could not fetch reward cards:", err);
    }
}
//* draw everything and update:)
function drawLevel(ctx, canvas, deltaTime){
    if (!player) return;  //skip if no player is loaded yet
    canvasRef = canvas;  //save canvas so other functions know the screen size

    ctx.clearRect(0, 0, canvas.width, canvas.height);  //clean the screen before drawing the new frame
    for(let i = 0; i < worldWidth; i += canvas.width){  //duplicate the background image to fill the whole world
        ctx.drawImage(backgroundImage, i - cameraX, 0, canvas.width, canvas.height); }

    if(!isPaused && !levelCompleted && (!cardSystem.isActive || showDeckPreview) 
        && !spikesWarningBox.visible && !gameOver){  //only run game logic when not paused, not between levels, and no card menu is open
        updateLevel(deltaTime);
    }
    ctx.save();
    ctx.translate(-cameraX, 0);  //shift drawing so the camera follows the player

    player.draw(ctx);
    drawPlatforms(ctx);
    enemies.forEach(enemy => enemy.draw(ctx));
    if (currentLevel >= 2) 
        hazards.forEach(h => h.draw(ctx));  //firepits active from level 2

    ctx.restore();  //undo the camera shift so next things draw at their normal position

    drawFog(ctx, canvas, game);  //amphitheatre fog effect
    
    drawHealthBar(ctx, 30, 20, 100, 30, player.hp, player.maxHp);
    ctx.font = "50px VT323";
    drawHearts(ctx, 150, 50, player.hearts, player.maxHearts);
    drawFame(ctx, 430, 40, player.fame);
    //Timer
    let timePassed = levelTimer / 1000;
    /*let timeLeft = Math.max(0, timeTarget - timePassed);*/
    let timeTarget = currentLevelConfig.targetTime / 1000;
    const timerDiv = document.getElementById("level-timer");
    if (timerDiv) {
        timerDiv.textContent =
            `${timePassed.toFixed(1)}s / ${timeTarget.toFixed(1)}s`;
        if (timeTarget - timePassed < 3) {
            timerDiv.style.color = "red";
        } else {
            timerDiv.style.color = "white";
        }
    }

    pauseBox.draw(ctx);
    confirmBox.draw(ctx);

    if(spikesWarningBox.visible){
        spikesWarningPulse += deltaTime * 0.005;
        let scale = 1 + Math.sin(spikesWarningPulse) * 0.05;
        ctx.save();
        // overlay red transparent
        ctx.fillStyle = "rgba(255, 0, 0, 0.15)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        // efecto de pulso (zoom leve)
        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.scale(scale, scale);
        ctx.translate(-canvas.width / 2, -canvas.height / 2);
        spikesWarningBox.draw(ctx);
        ctx.restore();
    } else {
        spikesWarningBox.draw(ctx);
    }

    spikesWarningBox.draw(ctx);

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

    //Shows reward cards after each level completed
    if(showDeckPreview){
        cardSystem.drawReward(ctx, canvas);
        deckPreviewTimer += deltaTime;
        if(deckPreviewTimer >= 3000){  //after 3 seconds, move to the next level
            showDeckPreview = false;
            cardSystem.rewardBox.hide();
            cardSystem.rewardCards = [];
            if (currentLevel <= 3)
                transitionToNextLevel();
            else
                goToScore = true;  //all 3 levels done, tell main.js to go to score scene
        }
    }
}
function updateLevel(deltaTime){
    if (!player) return;  //skip if no player is loaded yet
    levelTimer += deltaTime;  //keep track of how long the player has been in this level

    if(player.hearts <= 0){  //player ran out of hearts, game over
        gameOver = true;
        gameOverBox.show();
        return;
    }

    player.isMoving = false;  //reset movement flag before checking keys

    const goLeft  = keysDown["ArrowLeft"] || keysDown["a"] || keysDown["A"];
    const goRight = keysDown["ArrowRight"] || keysDown["d"] || keysDown["D"];
    const groundY = 450;  //floor height, everything below this is out of bounds

    player.update(goLeft, goRight, jumpPressed, platforms, groundY, deltaTime);
    jumpPressed = false;  //consume the jump so it only fires once per press

    //keep player inside the world, can't walk off the edges
    if (player.position.x < player.halfSize.x)
        player.position.x = player.halfSize.x;
    if (player.position.x > worldWidth - player.halfSize.x)
        player.position.x = worldWidth - player.halfSize.x;
    
    enemies.forEach(enemy => {
        enemy.update(player, deltaTime);
        if (enemy.position.x - enemy.halfSize.x <= 0 && enemy.speed > 0)
            enemy.bounce();  //bounce enemies
        else if (enemy.position.x + enemy.halfSize.x >= worldWidth && enemy.speed < 0)
            enemy.bounce();
    });

    player.attackEnemy(enemies);  //check if player hit any enemy this frame

    let totalLenEnemies = enemies.length;  //enemies now
    enemies = enemies.filter(alive => !alive.isDying);  //remove dead enemies
    let killsThisFrame = totalLenEnemies - enemies.length;  //enemies killed
    killedEnemies += killsThisFrame;  //update counter 
    if (!cardEventTriggered && !cardSystem.cardBox.visible && levelTimer >= randomEventTime) {
        cardEventTriggered = true;
        triggerCardEvent();
    }

    spawnTimer += deltaTime;
    if (spawnTimer >= spawnInterval) {  //time to spawn a new enemy
        if (killedEnemies + enemies.length < currentLevelConfig.conditionEnemies) {  //only spawn if total enemies haven't reached the kill goal yet
            enemies.push(spawnEnemy(cameraX + canvasRef.width + 100, 450, currentLevelConfig.enemyConfig));
        }
        console.log(`enemies: ${enemies.length}`);
        spawnTimer = 0;
    }

    if(killedEnemies >= currentLevelConfig.conditionEnemies && !levelCompleted){  //level done
        levelCompleted = true;
        currentLevel ++;
        updateFame(player, currentLevelConfig, levelTimer);  //give "coins" (fame) for the time spent in the level
        giveLevelRewards();  //give the player their reward cards
        levelCompletedBox.show();
        saveMatch({  //save the match result to the db
            player_id: window.loggedPlayer.player_id,
            archetype_id: selectedArchetypeId,
            duration_seconds: Math.floor(levelTimer / 1000),
            level_reached: currentLevel,
            final_fame: player.fame,
            life: player.hearts,
            result: "WIN",
            kills: killedEnemies,
            cards_in_deck: cardSystem.playerDeck.length
        });
        (async () => {
            await fetch("http://localhost:3000/players", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ player_id: window.loggedPlayer.player_id, fame_gained: player.fame })
            });
            loadPlayerStats(window.loggedPlayer.player_id, `level${currentLevel - 1}`);
        })();
    }

    cameraX = updateCamera(player.position.x, canvasRef.width, worldWidth);  //move camera to follow player

    let last = platforms[platforms.length - 1];
    if(player.position.x > last.x - 500){  //player is getting close to the end, add more platforms
        platforms.push(generatePlatform(last));
    }

    if (currentLevel >= 2) 
        hazards.forEach(h => h.update(player, deltaTime));  //firepits active from level 2

    cardSystem.update(deltaTime);  //tick card timers and effects
    imperialDecree(game, enemies);  //check if the imperial decree card effect needs to fire
}
//* handlers
function handleMouseMoveLevel(event, canvas){
    const pos = handleMouseMove(event, canvas);
    mouseX = pos.x;
    mouseY = pos.y;
}
function handleClickLevel(){
    if(levelCompleted){
        return levelCompletedBox.handleClick(mouseX, mouseY);
    }
    if(gameOver){
        return gameOverBox.handleClick(mouseX, mouseY);
    }
    if(confirmBox.visible){
        return confirmBox.handleClick(mouseX, mouseY);
    }
    if(spikesWarningBox.visible){
        return spikesWarningBox.handleClick(mouseX, mouseY);
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
function handleKeyDownLevel(event){
    if(event.repeat) return;

    if(event.key === "Escape"){
        event.preventDefault()
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
        event.preventDefault()
        cardSystem.toggleDeck();
    }
    if(event.key === " "){
        event.preventDefault()
        jumpPressed = true;
    }
    if(event.key === "j" || event.key === "J"){
        if(!player.playeratack){
            player.playeratack = true;
            player.attackFrames = 0;
            swordSound.currentTime = 0;
            swordSound.play();
        }
    }
}
function handleKeyUpLevel(event){
    keysDown[event.key] = false;
}
function resetGoToMenu(){
    goToMenu = false;
}
function resetGoToScore(){
    goToScore = false;
}
function transitionToNextLevel(){  //? called after deck preview ends, sets up the next level
    currentLevelConfig = getLevelConfig(currentLevel)  //pick config based on new level
    backgroundImage.src = currentLevelConfig.background;  //swap background

    levelCompleted = false;
    showDeckPreview = false;
    deckPreviewTimer = 0;
    levelCompletedBox.hide();
    //show spikes warning on level 2
    if(currentLevel === 2){
    spikesWarningPulse = 0;
    spikesWarningBox.title = "ATTENTION GLADIATOR!!!";
    spikesWarningBox.message = "THERE ARE SPIKES IN THE SAND NOW!\n TRY NOT TO STEP ON THEM OR YOU'LL LOSE LIFE!.";
    spikesWarningBox.show();
}
    //show spikes warning on level 2 and firepits on level 3
    if(currentLevel === 3){
    spikesWarningPulse = 0;
    spikesWarningBox.title = "ATTENTION GLADIATOR!!!";
    spikesWarningBox.message = "THERE ARE NOW SPIKES AND FIRE PITS IN THE ARENA!\n AVOID BOTH OR YOU'LL LOSE LIFE QUICKLY!.";
    spikesWarningBox.show();
}

    enemies = currentLevelConfig.spawnPositions.map(pos =>
        spawnEnemy(pos.x, pos.y, currentLevelConfig.enemyConfig)
    );
    killedEnemies = 0;

    initPlatforms();
    if (currentLevel >= 2) initHazards();  //firepits start from level 2

    cameraX = 0;
    spawnTimer = 0;
    levelTimer = 0;
    randomEventTime = randomRange(currentLevelConfig.targetTime / 2, currentLevelConfig.targetTime / 3);  //when will the event trigger
    cardEventTriggered = false;
    cardOptions = [];  //next levels rewards don't include this level's event cards
    cardSystem.clearPermanentEffects();  //undo any permanent card effect from last level
    cardSystem.close();
    cardSystem.isDeckOpen = false;
}
//* goes back to level 1, resets everything
function resetLevel(){
    currentLevel = 1; 
    currentLevelConfig = getLevelConfig(1);
    backgroundImage.src = currentLevelConfig.background;  //swap back to level 1 background

    player.position.x = 200;
    player.position.y = 350;
    player.velocityY = 0;
    player.hp = player.maxHp;
    player.hearts = player.maxHearts;

    levelCompleted = false;
    showDeckPreview = false;
    deckPreviewTimer = 0;
    levelCompletedBox.hide();

    enemies = currentLevelConfig.spawnPositions.map(pos =>
        spawnEnemy(pos.x, pos.y, currentLevelConfig.enemyConfig)
    );
    killedEnemies = 0;
    hazards = [];  //no firepits in level 1

    gameOver = false;
    isPaused = false;
    pauseBox.hide();
    confirmBox.hide();
    initPlatforms();

    cameraX = 0;
    spawnTimer = 0;
    levelTimer = 0;
    randomEventTime = randomRange(currentLevelConfig.targetTime / 2, currentLevelConfig.targetTime / 3);  //when will the event trigger
    cardEventTriggered = false;
    cardSystem.clearPermanentEffects();  //undo any permanent card effect before restarting
    cardSystem.close();
    cardSystem.isDeckOpen = false;
}
function getPlayer() { return player; }  //lets main grab the player object when needed

//* exports to main
export {
    getPlayer,
    drawLevel,
    handleMouseMoveLevel,
    handleClickLevel,
    resetLevel,
    handleKeyDownLevel,
    handleKeyUpLevel,
    setSelectedCharacter,
    goToMenu,
    resetGoToMenu,
    goToScore,
    resetGoToScore,
    killedEnemies,
    currentLevel,
    levelTimer,
    cardSystem
};
