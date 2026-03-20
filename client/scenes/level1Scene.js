import { Player1 } from "../objects/Player1.js";
import { Player2 } from "../objects/Player2.js";
import { Player3 } from "../objects/Player3.js";
import { Vector } from "../libs/Vector.js";
import { EnemyLion } from "../objects/EnemyLion.js";
import { MessageBox } from "../objects/MessageBox.js";

"use strict"
//Lógica del juego

//tamaño del mundo
let worldWidth = 3000;
let worldHeight = 600;
let cameraX = 0; //ventana del canvas

// Mouse
let mouseX = 0
let mouseY = 0

let player

let keysDown = {}; //Para poder usar teclado para mover a los jugadores
let jumpPressed = false; //Para que no salga disparado hasta los cielos cuando salta

//Esta función es para escoger el sprite de player
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

// Enemies, igual figuras random
let enemies = [
    new EnemyLion (new Vector(900,377)),
    new EnemyLion (new Vector(800,377))
]

// Fondo
let backgroundImage = new Image()
backgroundImage.src = "./assets/Fondo2.png"

let spawnTimer = 0;
let spawnInterval = 2000; // 2000 ms = 2 segundos

function draw(ctx){  //TODO DRAW DEBE CAMBIAR POR LA VENTANA DE LA CÁMARA
    //La idea es que hacemos, clear, después update y ya desués draw objects
    ctx.clearRect(0,0,canvas.width,canvas.height) //aquí limpiamos
    for(let i = 0; i < worldWidth; i+= canvas.width){
    ctx.drawImage(backgroundImage,i-cameraX,0,canvas.width,canvas.height); //dibujamos el fondo
    }
    
    update() //llamamos a update que definimos abajo

    ctx.save();  //monito no se sale del screen
    ctx.translate(-cameraX, 0);

    drawPlayer(ctx) //dibujamos al sprite del jugador
    drawEnemies(ctx) //dibujamos al sprite del enemigo
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
//HEATH BAR
function drawHealthBar(ctx, x, y, width, height, current, max) { //current from db and max is const
    // fondo (vida perdida)
    ctx.fillStyle = "gray";
    ctx.fillRect(x, y, width, height);

    // vida actual
    const healthWidth = (current / max) * width;
    ctx.fillStyle = "green";
    ctx.fillRect(x, y, healthWidth, height);

    // borde
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
    //aquí realmente debe ir toda la lógica de movimiento, colisiones, etc
    //Movimiento del jugador
    player.isMoving = false;
    if (keysDown["ArrowLeft"]) {
        player.position.x -= player.speed;
        player.isMoving = true;
    }
    if (keysDown["ArrowRight"]) {
        player.position.x  += player.speed;
         player.isMoving = true; //Originalmente en false en el objeto
    }
    //Lógica de salto
    if (jumpPressed && player.isOnGround){ //barra espaciadora
        player.velocityY = player.jumpStrength;
        player.isOngGround = false;
        jumpPressed = false;
    }
    player.velocityY += player.gravity;
    player.position.y += player.velocityY; //cuando salta sube y baja por gravedad

    //Ponemos limitante del piso
    let groundY = 350;
    if (player.position.y >= groundY){ //es para tener un sueño fijo
        player.position.y = groundY;
        player.velocityY = 0;
        player.isOnGround = true;
    }

    // Esto es para limitar la posición dle jugador dentro del canvas
    if (player.position.x < player.halfSize.x) {
        player.position.x = player.halfSize.x;
    }

    if (player.position.x > worldWidth - player.halfSize.x) {
        player.position.x = worldWidth - player.halfSize.x;
    }

    // movimiento enemigos, aquí no hay tanta ciencia porque solo tenenmos que hacer que avance hacia el juagador
    enemies.forEach(enemy=>{
        enemy.position.x -= 1;
    });

    //movemos la cámara para que siga al player
    cameraX = player.position.x - canvas.width/2; //porque nuestro canvas mide 1000, cámmara empieza en 0, cuando jugador llega a 500 la cámara avanza
    if (cameraX < 0) { //límites para que la cámara no salga del mundo y no muestre espacios vacíos
        cameraX = 0;
    }
    if (cameraX > worldWidth - canvas.width){
        cameraX = worldWidth - canvas.width;
    }

}

function drawPlayer(ctx){
    player.update();
    player.draw(ctx); //depende de cameraX
}

function drawEnemies(ctx){
    enemies.forEach(enemy=>{
       enemy.update();
       enemy.draw(ctx); //depende de cameraX
    });
}
//ARREGLAR ESTA FUNCIÓN
let totalSpawned = 0;
let maxEnemies = 10;
function spawnEnemy(){
    let min = 1;
    let max = 5;
    let amount = Math.floor(Math.random() * (max - min + 1)) + min;

    for(let i = 0; i < amount; i++){
        if(totalSpawned >= maxEnemies) return;
        enemies.push(
            new EnemyLion( new Vector(Math.random() * (worldWidth - player.halfSize.x - 200) + 200,377))
        );
        totalSpawned++;
    }
}

function handleMouseMove(event,canvas){ //Ya conocemos esta función
    const rect = canvas.getBoundingClientRect()
    mouseX = event.clientX - rect.left
    mouseY = event.clientY - rect.top
}

function handleClick(){
 //Aquí podemos ahora meter las funciones de ataque, de usar cartas y powerups
}

function reset(){
    enemies = [] //Limpia todo, solo se usa cuando el run se reinicia, sobre todo por health
    player.health = 100
}
function handleKeyDown(event){
    if(event.repeat) return; //si no loopea si dejas apretado el spacebar

    keysDown[event.key] = true;
    if(event.key === " "){ //spacebar for jump
        jumpPressed = true;
    }
}

function handleKeyUp(event){
    keysDown[event.key] = false;
    if(event.key === " "){ //spacebar for jump
        jumpPressed = false;
    }
}

export { draw, handleMouseMove, handleClick, reset, handleKeyDown, handleKeyUp, setSelectedCharacter }