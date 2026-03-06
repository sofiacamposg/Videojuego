"use strict"
//Lógica del juego

// Mouse
let mouseX = 0
let mouseY = 0

// Player, haorita lo puse como cuadrado porque aún no spe cómo meter un sprite
let player = {
    x: 450,
    y: 300,
    width: 60,
    height: 60,
    speed: 4,
    health: 100
}

// Enemies, igual figuras random
let enemies = [
    {x:800,y:200,width:50,height:50},
     {x:900,y:150,width:50,height:50}
]

// Fondo
let backgroundImage = new Image()
backgroundImage.src = "./assets/Fondo2.png"

function draw(ctx, canvas){
    //La idea es que hacemos, clear, después update y ya desués draw objects
    ctx.clearRect(0,0,canvas.width,canvas.height) //aquí limpiamos
    ctx.drawImage(backgroundImage,0,0,canvas.width,canvas.height) //dibujamos el fondo

    update() //llamamos a update que definimos abajo

    drawPlayer(ctx) //dibujamos al sprite del jugador
    drawEnemies(ctx) //dibujamos al spprite del enemigo

}

function update(){
    enemies.forEach(enemy=>{
        enemy.x -= 1 //nos movemos hacia la izquierda con el enemigo, para que avance hacia el jugador
    })
    //aquí realmente debe ir toda la lógica de movimiento, colisiones, etc
}

function drawPlayer(ctx){
    ctx.fillStyle = "white"
    ctx.fillRect(player.x,player.y,player.width,player.height)
}

function drawEnemies(ctx){
    ctx.fillStyle = "red"
    enemies.forEach(enemy=>{ //Para cada enemigo en emenies, depués cambiarlo
        ctx.fillRect(enemy.x,enemy.y,enemy.width,enemy.height)
    })
}

function spawnEnemy(){ //Crea un enemigo nuevo y push lo agrega al array de arriba
    enemies.push({ 
        x: Math.random()*500, //aparece a una altura aleatoria en x
        y: 575, //según yo ahí es nivel de piso porque de height mide 50 y nuestro canvas 600
        width: 50,
        height: 50
    })
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

export { draw, handleMouseMove, handleClick, reset }