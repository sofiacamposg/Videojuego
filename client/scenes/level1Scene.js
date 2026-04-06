import { Player1 } from "../objects/Player1.js";
import { Player2 } from "../objects/Player2.js";
import { Player3 } from "../objects/Player3.js";
import { Vector } from "../libs/Vector.js";
import { EnemyLion } from "../objects/EnemyLion.js";
import { MessageBox } from "../objects/MessageBox.js";

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

let keysDown = {}; //To track keyboard input for player movement
let jumpPressed = false; //Prevents continuous jumping when holding the key

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

// Enemies, also random entities
let enemies = [
    new EnemyLion (new Vector(900,357)),
    new EnemyLion (new Vector(800,357))
]

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
    
    update() //call update defined below

    ctx.save();  //keeps character within screen
    ctx.translate(-cameraX, 0);

    drawPlayer(ctx) //draw player sprite
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
    let groundY = 350;
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
 //Handles attacks, cards, and powerups
}

function reset(){
    enemies = [] //Resets enemies, used when restarting the run
    player.health = 100
}
function handleKeyDown(event){
    if(event.repeat) return; //prevents looping when holding spacebar

    keysDown[event.key] = true;
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

export { draw, handleMouseMove, handleClick, reset, handleKeyDown, handleKeyUp, setSelectedCharacter }