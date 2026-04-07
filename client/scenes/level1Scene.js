import { Player1 } from "../objects/Player1.js";
import { Player2 } from "../objects/Player2.js";
import { Player3 } from "../objects/Player3.js";
import { Vector } from "../libs/Vector.js";
import { EnemyLion } from "../objects/EnemyLion.js";
import { MessageBox } from "../objects/MessageBox.js";
import { hitboxOverlap } from "../libs/game_functions.js";

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

/* For HTML stats (User stats)
let levelTime = 0;
let lastTome = 0; */

let keysDown = {}; //To track keyboard input for player movement
let jumpPressed = false; //Prevents continuous jumping when holding the key

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
}

// Enemies, random entities
let enemies = [
    new EnemyLion (new Vector(900,370)),
    new EnemyLion (new Vector(800,370))
]
//Obstacles, also random entities
let platforms = [];
let platformImage = new Image();
platformImage.src = "./assets/Platform.png";
//HITBOX
platforms.push({
    x: 300,
    y: 300,
    width: 120,
    height: 70
});
function drawPlatforms(ctx){
    platforms.forEach(p=>{
        ctx.drawImage(platformImage, p.x, p.y, p.width + 20, p.height);
    });
}

// Background
let backgroundImage = new Image()
backgroundImage.src = "./assets/fondo2.png"; 

let spawnTimer = 0;
let spawnInterval = 2000; // 2000 ms = 2 seconds

function draw(ctx, canvas){  //TODO DRAW MUST CHANGE TO CAMERA VIEW
    //Clear → update → draw objects
    ctx.clearRect(0,0,canvas.width,canvas.height) //clear canvas
    for(let i = 0; i < worldWidth; i+= canvas.width){
    ctx.drawImage(backgroundImage,i-cameraX,0,canvas.width,canvas.height); //draw background
    }
    
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
    drawEnemies(ctx) //draw enemy sprites
    //OBSTACLES
    drawPlatforms(ctx);
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
}
//HEALTH BAR
function drawHealthBar(ctx, x, y, width, height, current, max) { //current from db and max is const
    // background (lost health)
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
}

function checkAttackHits() {
    if (!player.playeratack || !player.attackHitbox) //"player is attacking?"
        return;  
    enemies.forEach(enemy => {
        if (player.hitEnemies.has(enemy))  //single attack doesnt hit the same enemy more than once
            return;  
        if (hitboxOverlap(player.attackHitbox, enemy)) {
            player.hitEnemies.add(enemy);

            // TODO: enemy.takeDamage(player.damage)
        }
    });
}

function update(){
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
    if (jumpPressed && player.isOnGround){ //spacebar
        player.velocityY = player.jumpStrength;
        player.isOnGround = false;
        jumpPressed = false;
    }
    
    player.velocityY += player.gravity;
    player.position.y += player.velocityY; //vertical movement due to gravity

    //Ground limit
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

    //enemy movement: simple movement towards player
    enemies.forEach(enemy=>{
        enemy.position.x -= 1;
    });

    //camera follows player
    cameraX = player.position.x - canvas.width/2; //camera centers player horizontally
    if (cameraX < 0) { //prevent camera from going outside world
        cameraX = 0;
    }
    if (cameraX > worldWidth - canvas.width){
        cameraX = worldWidth - canvas.width;
    }
    //Jumping on platforms logic
    if(!player.isOnGround){
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
    }

    //check attack hitbox against all active enemies
    checkAttackHits();
}

function drawPlayer(ctx){
    player.update();
    player.draw(ctx); //depends on cameraX
}

function drawEnemies(ctx){
    enemies.forEach(enemy=>{
       enemy.update();
       enemy.draw(ctx); //depends on cameraX
    });
}
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
            new EnemyLion( new Vector(Math.random() * (worldWidth - player.halfSize.x - 200) + 200,377))
        );
        totalSpawned++;
    }
}

function handleMouseMove(event,canvas){ //Standard mouse tracking function
    const rect = canvas.getBoundingClientRect()
    mouseX = event.clientX - rect.left
    mouseY = event.clientY - rect.top
}

function handleClick(){
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
    player.health = 100;

    // reset enemies
    enemies = [
        new EnemyLion(new Vector(900,357)),
        new EnemyLion(new Vector(800,357))
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
}

function handleKeyUp(event){
    keysDown[event.key] = false;
    if(event.key === " "){ //spacebar for jump
        jumpPressed = false;
    }
}

export { draw, handleMouseMove, handleClick, reset, handleKeyDown, handleKeyUp, setSelectedCharacter, goToMenu }