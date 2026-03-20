import { Player1 } from "../objects/Player1.js";
import { Vector } from "../libs/Vector.js";
import { EnemyLion } from "../objects/EnemyLion.js";

"use strict"
//Lógica del juego

//tamaño del mundo
let worldWidth = 3000;
let worldHeight = 600;
let cameraX = 0; //ventana del canvas

// Mouse
let mouseX = 0
let mouseY = 0

let keysDown = {}; //Para poder usar teclado para mover a los jugadores

// Player
let player = new Player1 (new Vector(200,350));

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
}

function update(){
    //aquí realmente debe ir toda la lógica de movimiento, colisiones, etc
    //Movimiento del jugador
    if (keysDown["ArrowLeft"]) {
        player.position.x -= player.speed;
    }
    if (keysDown["ArrowRight"]) {
        player.position.x  += player.speed;
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
    keysDown[event.key] = true;
}

function handleKeyUp(event){
    keysDown[event.key] = false;
}
export { draw, handleMouseMove, handleClick, reset, handleKeyDown, handleKeyUp }