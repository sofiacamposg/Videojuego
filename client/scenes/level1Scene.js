import { PlayerBase } from "../objects/PlayerBase.js";
import { Vector } from "../libs/Vector.js";
import { EnemyBase } from "../objects/EnemyBase.js";
import { MessageBox } from "../objects/MessageBox.js";
import { cardsOnCanvas } from "../cards/cardsOnCanvas.js";
import { cards } from "../cards/Card.js";

"use strict"

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

//---enemy data ----
//config for every enemy, all the data that is only for this enemy, should change between levels
const lionConfig = {
    hp: 100, 
    damage: 5,
    speed: 4,
    scale: 0.8,
    walkSrc: "./assets/enemy1/walk.png",
    attackSrc: "./assets/enemy1/attack.png",
    deathSrc: "./assets/enemy1/death.png",
};
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

//enemies, random entities, position, config 
let enemies = [
    new EnemyBase(new Vector(900,450), lionConfig),
    new EnemyBase(new Vector(1100,450), lionConfig),
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
let spawnInterval = 4000; // 2000 ms = 2 seconds

function draw(ctx, canvas, deltaTime){  //TODO DRAW MUST CHANGE TO CAMERA VIEW
    //Clear → update → draw objects
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for(let i = 0; i < worldWidth; i += canvas.width){
        ctx.drawImage(backgroundImage, i - cameraX, 0, canvas.width, canvas.height); //draw background
    }

    if(!isPaused){  //if it is not paused update the game
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
    cardShown.draw(ctx, canvas);
}

function update(canvas, deltaTime){
    cardShown.update();  //check if any timed card effects have expired

    //---player ----
    const goLeft  = keysDown["ArrowLeft"] || keysDown['a'];
    const goRight = keysDown["ArrowRight"] || keysDown['d'];
    const groundY = 450;

    player.update(goLeft, goRight, jumpPressed, platforms, groundY);  
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

    //---camara ----
    cameraX = player.position.x - canvas.width / 2;
    if (cameraX < 0) cameraX = 0;
    if (cameraX > worldWidth - canvas.width) cameraX = worldWidth - canvas.width;

    //---platforms ---
    let last = platforms[platforms.length - 1];
    if (player.position.x > last.x - 500) generatePlatform();

    //---spawn ---
    spawnTimer += deltaTime;
    //console.log(`spawntimer: ${spawnTimer}`)
    if (spawnTimer >= spawnInterval) {
        if (killedEnemies != conditionEnemies) {
            //& agrega un enemigo justo afuera del borde de la camara, asi parece que parecen fuera del mundo
            enemies.push(new EnemyBase(new Vector(cameraX + canvas.width + 100, 450), lionConfig));
        }
        console.log(`enemies: ${enemies.length}`);
        spawnTimer = 0;
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