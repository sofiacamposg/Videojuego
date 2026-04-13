import { Player1 } from "../objects/Player1.js";
import { Player2 } from "../objects/Player2.js";
import { Player3 } from "../objects/Player3.js";
import { Vector } from "../libs/Vector.js";
import { EnemyLion } from "../objects/EnemyLion.js";
import { MessageBox } from "../objects/MessageBox.js";

"use strict"


let worldWidth = 3000;
let worldHeight = 600;
let cameraX = 0;

// 🖱 mouse
let mouseX = 0
let mouseY = 0

let player

let keysDown = {};
let jumpPressed = false;


let killCount = 0;


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


let enemies = [
    new EnemyLion (new Vector(900,377)),
    new EnemyLion (new Vector(800,377))
]

let backgroundImage = new Image()
backgroundImage.src = "./assets/Fondo2.png"

let spawnTimer = 0;
let spawnInterval = 2000; 

function draw(ctx){  
    ctx.clearRect(0,0,canvas.width,canvas.height)

    for(let i = 0; i < worldWidth; i+= canvas.width){
        ctx.drawImage(backgroundImage,i-cameraX,0,canvas.width,canvas.height);
    }
    
    update()

    ctx.save();
    ctx.translate(-cameraX, 0);

    drawPlayer(ctx)
    drawEnemies(ctx)

    spawnTimer++;
    if (spawnTimer >= spawnInterval) {
        spawnEnemy();
        spawnTimer = 0;
    }

    ctx.restore();

    drawHealthBar(ctx, 20, 20, 100, 30, 50, 100);
    ctx.font = "50px Arial";
    drawHearts(ctx, 150, 50, 3, 5);

    // show kills
    ctx.fillStyle = "white";
    ctx.font = "30px Arial";
    ctx.fillText("Kills: " + killCount, 100, 100);
}

// health bar
function drawHealthBar(ctx, x, y, width, height, current, max) {
    ctx.fillStyle = "gray";
    ctx.fillRect(x, y, width, height);

    const healthWidth = (current / max) * width;
    ctx.fillStyle = "green";
    ctx.fillRect(x, y, healthWidth, height);

    ctx.strokeStyle = "white";
    ctx.lineWidth = 2;
    ctx.strokeRect(x, y, width, height);
}

// hearts
function drawHearts(ctx, x, y, current, max) {
    const heartValue = 1;
    const totalHearts = max / heartValue;
    const filledHearts = Math.ceil(current / heartValue);

    for (let i = 0; i < totalHearts; i++) {
        ctx.fillStyle = i < filledHearts ? "red" : "gray";
        ctx.fillText("♥", x + i * 50, y);
    }
}

// update
function update(){
    player.isMoving = false;

    if (keysDown["ArrowLeft"]) {
        player.position.x -= player.speed;
        player.isMoving = true;
        player.direction = "left";
    }

    if (keysDown["ArrowRight"]) {
        player.position.x  += player.speed;
        player.isMoving = true;
        player.direction = "right";
    }


    if (jumpPressed && player.isOnGround){
        player.velocityY = player.jumpStrength;
        player.isOnGround = false; 
        jumpPressed = false;
    }

    player.velocityY += player.gravity;
    player.position.y += player.velocityY;

    let groundY = 350;
    if (player.position.y >= groundY){
        player.position.y = groundY;
        player.velocityY = 0;
        player.isOnGround = true;
    }


    if (player.position.x < player.halfSize.x) {
        player.position.x = player.halfSize.x;
    }

    if (player.position.x > worldWidth - player.halfSize.x) {
        player.position.x = worldWidth - player.halfSize.x;
    }

 
    let remainingEnemies = [];

    enemies.forEach(enemy => {
        enemy.position.x -= 1;

        // if the enemy comes out of the screen, the kill doesnt count
        if (enemy.position.x < -50) {
            return;
        }

        // kill + 1
        if (enemy.isDead) {
            killCount++;
            return;
        }

        remainingEnemies.push(enemy);
    });

    enemies = remainingEnemies;

    // ESTO ES SOLO PARA PROBAR EL ATAQUE, DEBERÍA IR EN EL UPDATE DEL PLAYER
    if(player.playeratack){
        enemies.forEach(enemy => {
            enemy.isDead = true;
        });
    }


    cameraX = player.position.x - canvas.width/2;

    if (cameraX < 0) cameraX = 0;
    if (cameraX > worldWidth - canvas.width){
        cameraX = worldWidth - canvas.width;
    }
}

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


let totalSpawned = 0;
let maxEnemies = 10;

function spawnEnemy(){
    let min = 1;
    let max = 5;
    let amount = Math.floor(Math.random() * (max - min + 1)) + min;

    for(let i = 0; i < amount; i++){
        if(totalSpawned >= maxEnemies) return;

        enemies.push(
            new EnemyLion(
                new Vector(Math.random() * (worldWidth - player.halfSize.x - 200) + 200,377)
            )
        );

        totalSpawned++;
    }
}

function handleMouseMove(event,canvas){
    const rect = canvas.getBoundingClientRect()
    mouseX = event.clientX - rect.left
    mouseY = event.clientY - rect.top
}

function handleClick(){}


function reset(){
    enemies = [];
    player.health = 100;
    killCount = 0; 
}


function handleKeyDown(event){
    if(event.repeat) return;

    keysDown[event.key] = true;

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

function handleKeyUp(event){
    keysDown[event.key] = false;

    if(event.key === " "){
        jumpPressed = false;
    }
}


function getKillCount(){
    return killCount;
}

export { 
    draw, 
    handleMouseMove, 
    handleClick, 
    reset, 
    handleKeyDown, 
    handleKeyUp, 
    setSelectedCharacter,
    getKillCount 
};