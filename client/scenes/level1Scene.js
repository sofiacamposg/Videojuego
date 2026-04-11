import { Player1 } from "../objects/Player1.js";
import { Player2 } from "../objects/Player2.js";
import { Player3 } from "../objects/Player3.js";
import { Vector } from "../libs/Vector.js";
import { EnemyLion } from "../objects/EnemyLion.js";
import { MessageBox } from "../objects/MessageBox.js";
import { hitboxOverlap } from "../libs/game_functions.js"; 
import { cardsOnCanvas } from "../cards/cardsOnCanvas.js";
import { cards } from "../cards/Card.js";

"use strict"
//* GAME'S LOGIC

//world size
let worldWidth = 3000;
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

let keysDown = {}; //To track keyboard input for player movement
let jumpPressed = false; //Prevents continuous jumping when holding the key

//ENEMY VARIABLES
let killedEnemies = 0;
const conditionEnemies = 20;

//Pause
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

//This function selects the player sprite
function setSelectedCharacter(selectedCharacter){
    if (selectedCharacter === "Guerrero"){
        player = new Player1(new Vector(200,350));
    }
    else if (selectedCharacter === "Lancero"){
        player = new Player2(new Vector(200,350));
    }
    else if (selectedCharacter === "Pesado"){
        player = new Player3(new Vector(200,350));
    }
    initPlatforms();
}

// Enemies, random entities
let enemies = [
    new EnemyLion (new Vector(900,370)),
    new EnemyLion (new Vector(1100,370))
]
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

// Background
let backgroundImage = new Image()
backgroundImage.src = "./assets/fondo2.png"; 

let spawnTimer = 0;
let spawnInterval = 200; // 2000 ms = 2 seconds

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

    if(!isPaused){
    update() //call update defined below
    }

    ctx.save();  //keeps character within screen
    ctx.translate(-cameraX, 0);

    drawPlayer(ctx) //draw player sprite
    //OBSTACLES
    drawPlatforms(ctx);
    drawEnemies(ctx) //draw enemy sprites
    spawnTimer++;
    if (spawnTimer >= spawnInterval) {
        spawnEnemy();
        spawnTimer = 0;
    }
    ctx.restore();

    drawHealthBar(ctx, 20, 20, 100, 30, player.hp, player.maxHp);
    ctx.font = "50px Arial";
    drawHearts(ctx, 150, 50, player.hearts, player.maxHearts);
    pauseBox.draw(ctx);
    cardShown.draw(ctx, canvas);  //draw card screen
}
//HEALTH BAR
function drawHealthBar(ctx, x, y, width, height, current, max) { //current from db and max is const
    // background (lost health)
    ctx.fillStyle = "white";
    ctx.font = "20px Arial";
    ctx.fillText("HP: " + player.hp, 20, 70);


    ctx.fillStyle = "gray";
    ctx.fillRect(x, y, width, height);

    // current health
    const healthWidth = (current / max) * width;
    ctx.fillStyle = "green";
    ctx.fillRect(x, y, healthWidth, height);

    // border
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
//DECK BUTTON
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
};

function attackEnemy() {  //player attack and kill enemy 
    if (!player.playeratack || !player.attackHitbox) //"player is attacking?"
        return;  
    enemies.forEach(enemy => {
        if (player.hitEnemies.has(enemy))  //single attack doesnt hit the same enemy more than once
            return;  
        if (hitboxOverlap(player.attackHitbox, enemy)) {
            player.hitEnemies.add(enemy);
            enemy.takeDamage(player.damage);
        }
    });
};

function attackPlayer() {
    enemies.forEach(enemy => {
        if (!enemy.attackHitbox)  //enemy is attacking?
            return;
        if (enemy.hitPlayers.has(player))  //one hit per swing
            return;
        if (hitboxOverlap(enemy.attackHitbox, player)) {
            enemy.hitPlayers.add(player);
            player.takeDamage(enemy.damage);
        }
    });
}


function update(){
    cardShown.update();  //check if any timed card effects have expired

    //Handles movement logic, collisions, etc.
    //Player movement
    player.isMoving = false;
    //variables to know which keys are pressed
    const goLeft  = keysDown["ArrowLeft"] || keysDown['a'];
    const goRight = keysDown["ArrowRight"] || keysDown['d'];

    if (goLeft && !goRight) {  //case 1: only left keys are pressed
        player.position.x -= player.speed;
        player.isMoving = true;
        player.direction = "left";
    } else if (goRight && !goLeft) {  //case 2: only right keys are pressed
        player.position.x += player.speed;
        player.isMoving = true;
        player.direction = "right";
    }
        //Jump logic
    if (jumpPressed && player.isOnGround && player.canJump){ //spacebar
        player.velocityY = player.jumpStrength;
        player.isOnGround = false;
        jumpPressed = false;
    }
    
    player.velocityY += player.gravity;
    player.position.y += player.velocityY; //vertical movement due to gravity

    //Ground limit
    //Jumping on platforms logic, check it first
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
        if (isFalling && withinX && touchingTop) { //If the player is falling but is above the limits of the platform, let the player on top
            player.position.y = p.y - player.halfSize.y;
            player.velocityY = 0;
            player.isOnGround = true;
        }
    });
    //Now we apply ground limit
    let groundY = 370;
    if (player.position.y >= groundY){ //fixed ground level
        player.position.y = groundY;
        player.velocityY = 0;
        player.isOnGround = true;
    }

    //Limit player position inside the canvas
    if (player.position.x < player.halfSize.x) {
        player.position.x = player.halfSize.x;
    }

    if (player.position.x > worldWidth - player.halfSize.x) {
        player.position.x = worldWidth - player.halfSize.x;
    }


//-----ENEMY--------
    //enemy movement: simple movement towards player
    enemies.forEach(enemy=>{
        enemy.position.x -= 1;
    });

    //check attack hitbox against all active enemies
    attackEnemy();  //player attacks enemies first

    let totalLenEnemies = enemies.length;
    enemies = enemies.filter(alive => alive.hp > 0);  //remove enemies killed this frame immediately
    let aliveLenEnemies = enemies.length;
    killedEnemies += totalLenEnemies - aliveLenEnemies;

    attackPlayer();  //only surviving enemies can hit the player


    //camera follows player
    cameraX = player.position.x - canvas.width/2; //camera centers player horizontally
    if (cameraX < 0) { //prevent camera from going outside world
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

function drawPlayer(ctx){
    player.update();
    player.draw(ctx); //depends on cameraX
}

function drawEnemies(ctx){
    enemies.forEach(enemy=>{
       enemy.update(player);
       enemy.draw(ctx); //depends on cameraX
    });
}

function spawnEnemy(){
   let min = 1;
    let max = 25;
    let amount = Math.floor(Math.random() * (max - min + 1)) + min;

    if (killedEnemies != conditionEnemies) {  //"win" condition 
        for (let i = 0; i < amount; i++){
            enemies.push(  //spwan enemies
                new EnemyLion(new Vector((worldWidth - (player.position.x + 550))  //safe zone de 150px
                , 370)));
        };

    };
}

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
 //Handles attacks, cards, and powerups
}

function reset(){
    // reset player
    player.position.x = 200;
    player.position.y = 350;
    player.velocityY = 0;
    player.hp = 100;

    // reset enemies
    enemies = [
        new EnemyLion(new Vector(900,370)),
        new EnemyLion(new Vector(800,370))
    ];

    // reset camera
    cameraX = 0;

    // reset spawn
    spawnTimer = 0;
}

function handleKeyDown(event){
    if(event.repeat) return; //prevents looping when holding spacebar
    if(isPaused) return; 
        keysDown[event.key] = true;

        if(event.key === "Escape"){ //PauseMessage
        isPaused = !isPaused;

        if(isPaused){
            pauseBox.show();
        } else {
            pauseBox.hide();
        }
    }
    if(event.key === " "){ //spacebar for jump
        jumpPressed = true;
    }
    if(event.key === "j"){ //J for attack
        if(!player.playeratack){
            player.playeratack = true;
            player.attackFrames = 0;
        }
    }
    if (event.key === "c") {  //show cards
        cardShown.show(cards, player, enemies);
    }
}

function handleKeyUp(event){
    keysDown[event.key] = false;
    if(event.key === " "){ //spacebar for jump
        jumpPressed = false;
    }
}

export { draw, handleMouseMove, handleClick, reset, handleKeyDown, handleKeyUp, setSelectedCharacter, goToMenu }