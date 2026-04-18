import { PlayerBase } from "../objects/PlayerBase.js";
import { Vector } from "../libs/Vector.js";
import { EnemyBase } from "../objects/EnemyBase.js";
import { MessageBox } from "../objects/MessageBox.js";
import { cards } from "../cards/Card.js";
import { mouseX, mouseY } from "../libs/game_functions.js";
import { cardsOnCanvas } from "../cards/cardsOnCanvas.js";
//& pulled player/enemy configs and platform/camera helpers out of this file
import { playerConfigs, level1Config } from "../libs/levelConfig.js";
import { spawnEnemy, generatePlatform, updateCamera } from "../libs/level_functions.js";

"use strict"

//========================= WORLD =========================
let worldWidth = 2000;
let worldHeight = 600;
let cameraX = 0;

let player;
let canvasRef; //& stored so helpers that need canvas.width work without it being passed everywhere

//========================= TIMERS =========================
let levelTimer = 0;
let randomEventTime = Math.random() * (40 - 20) + 20;

let keysDown = {};
let jumpPressed = false;

//========================= CARD SYSTEM =========================
let cardEventTriggered = false;
const cardSystem = new cardsOnCanvas();

//========================= PAUSE SYSTEM =========================
let isPaused = false;
let goToMenu = false;

let pauseBox = new MessageBox("PAUSED", "Game is paused", 250, 150, 500, 300);

pauseBox.addButton("Continue", 440, 290, 120, 35, () => {
    isPaused = false;
    pauseBox.hide();
});
pauseBox.addButton("Restart", 440, 340, 120, 35, () => {
    reset();
    isPaused = false;
    pauseBox.hide();
});
pauseBox.addButton("Home", 440, 390, 120, 35, () => {
    goToMenu = true;
});

//========================= LIVE SYSTEM =========================
function drawHealthBar(ctx, x, y, width, height, current, max) {
    ctx.fillStyle = "white";
    ctx.font = "20px Arial";
    ctx.fillText("HP: " + player.hp, 20, 70);

    ctx.fillStyle = "gray";
    ctx.fillRect(x, y, width, height);

    const healthWidth = (current / max) * width;
    ctx.fillStyle = "green";
    ctx.fillRect(x, y, healthWidth, height);

    ctx.strokeStyle = "white";
    ctx.lineWidth = 2;
    ctx.strokeRect(x, y, width, height);
}

function drawHearts(ctx, x, y, current, max) {
    for (let i = 0; i < max; i++) {
        ctx.fillStyle = i < current ? "red" : "gray";
        ctx.fillText("♥", x + i * 50, y);
    }
}

//========================= GAME OVER =========================
let gameOver = false;
let gameOverBox = new MessageBox(
    "Game Over",
    "You died!\n The emperor is dissapointed in you",
    250, 150, 500, 300
);
gameOverBox.addButton("Restart", 440, 340, 120, 35, () => {
    reset();
    gameOver = false;
    gameOverBox.hide();
});

//========================= PLAYER =========================
function setSelectedCharacter(selectedCharacter) {
    player = new PlayerBase(new Vector(200, 450), playerConfigs[selectedCharacter]);
    initPlatforms();
}

//========================= ENEMIES =========================
//& game object used by card system to trigger extra spawns mid-level
const game = {
    spawnEnemy: () => spawnEnemy(cameraX + 1100, 450, level1Config.enemyConfig)
};

let killedEnemies = 0;
const conditionEnemies = 20;
let enemies = level1Config.spawnPositions.map(p => spawnEnemy(p.x, p.y, level1Config.enemyConfig));

//========================= PLATFORMS =========================
let platforms = [];

let platformImage = new Image();
platformImage.src = "./assets/Platform.png";

function initPlatforms() {
    //& seed first platform manually since generatePlatform always needs a previous one
    platforms = [{ x: 300, y: 350, width: 100, height: 70 }];
    for (let i = 1; i < 8; i++) {
        platforms.push(generatePlatform(platforms[platforms.length - 1]));
    }
}

//========================= BACKGROUND =========================
let backgroundImage = new Image();
backgroundImage.src = level1Config.background;

//========================= SPAWN SYSTEM =========================
let spawnTimer = 0;
let spawnInterval = 2000;

//========================= DRAW =========================
function draw(ctx, canvas, deltaTime) {
    canvasRef = canvas;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < worldWidth; i += canvas.width) {
        ctx.drawImage(backgroundImage, i - cameraX, 0, canvas.width, canvas.height);
    }

    if (!isPaused && !cardSystem.isActive) {
        update(canvas, deltaTime);
    }

    ctx.save();
    ctx.translate(-cameraX, 0);

    platforms.forEach(p => {
        ctx.drawImage(platformImage, p.x, p.y - 37, p.width, p.height);
    });

    player.draw(ctx);
    enemies.forEach(enemy => enemy.draw(ctx));

    ctx.restore();

    if (player.fogActive) {
        ctx.fillStyle = "rgba(0, 0, 0, 0.85)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    drawHealthBar(ctx, 20, 20, 100, 30, player.hp, player.maxHp);
    ctx.font = "50px Arial";
    drawHearts(ctx, 150, 50, player.hearts, player.maxHearts);
    pauseBox.draw(ctx);

    if (gameOver) {
        gameOverBox.draw(ctx);
        return;
    }

    cardSystem.draw(ctx, canvas);
    cardSystem.drawDeck(ctx, canvas);
}

//========================= UPDATE =========================
function update(canvas, deltaTime) {
    levelTimer += deltaTime;
    if (!cardEventTriggered && levelTimer >= randomEventTime) {
        cardEventTriggered = true;
        cardSystem.show(cards, player, enemies, game);
    }

    if (player.hearts <= 0) {
        gameOver = true;
        gameOverBox.show();
        return;
    }

    const goLeft  = keysDown["ArrowLeft"] || keysDown['a'];
    const goRight = keysDown["ArrowRight"] || keysDown['d'];
    const playerGroundY = 450;

    player.update(goLeft, goRight, jumpPressed, platforms, playerGroundY, deltaTime);
    jumpPressed = false;

    if (player.position.x < player.halfSize.x)
        player.position.x = player.halfSize.x;
    if (player.position.x > worldWidth - player.halfSize.x)
        player.position.x = worldWidth - player.halfSize.x;

    enemies.forEach(enemy => {
        enemy.update(player, deltaTime);
        //& solo bounce si está en el borde Y moviéndose hacia esa pared (evita el bounce infinito)
        if (enemy.position.x - enemy.halfSize.x <= 0 && enemy.speed > 0)
            enemy.bounce();
        else if (enemy.position.x + enemy.halfSize.x >= worldWidth && enemy.speed < 0)
            enemy.bounce();
    });

    player.attackEnemy(enemies);

    let totalLenEnemies = enemies.length;
    enemies = enemies.filter(alive => alive.hp > 0);
    killedEnemies += totalLenEnemies - enemies.length;

    cameraX = updateCamera(player.position.x, canvas.width, worldWidth);

    let last = platforms[platforms.length - 1];
    if (player.position.x > last.x - 500)
        platforms.push(generatePlatform(last));

    spawnTimer += deltaTime;
    if (spawnTimer >= spawnInterval) {
        if (killedEnemies !== conditionEnemies) {
            //& agrega un enemigo justo afuera del borde de la camara, asi parece que aparecen fuera del mundo
            enemies.push(spawnEnemy(cameraX + canvas.width + 100, 450, level1Config.enemyConfig));
        }
        spawnTimer = 0;
    }

    cardSystem.update(deltaTime);
}

//========================= INPUT =========================
function handleClick() {
    if (isPaused) return pauseBox.handleClick(mouseX, mouseY);
    if (cardSystem.isDeckOpen) {
        cardSystem.handleDeckClick(mouseX, mouseY, canvasRef);
        return;
    }
    if (cardSystem.isActive) {
        cardSystem.handleClick(mouseX, mouseY, canvasRef);
        return;
    }
}

function handleKeyDown(event) {
    if (event.repeat) return;

    if (event.key === "Escape") {
        isPaused = !isPaused;
        isPaused ? pauseBox.show() : pauseBox.hide();
        return;
    }

    if (isPaused) return;

    keysDown[event.key] = true;
    if (event.key === "c" || event.key === "C") cardSystem.toggleDeck();
    if (event.key === " ") jumpPressed = true;
    if (event.key === "j") {
        if (!player.playeratack) {
            player.playeratack = true;
            player.attackFrames = 0;
        }
    }
}

function handleKeyUp(event) {
    keysDown[event.key] = false;
    if (event.key === " ") jumpPressed = false;
}

//========================= RESET =========================
function reset() {
    player.position.x = 200;
    player.position.y = 350;
    player.velocityY = 0;
    player.hp = player.maxHp;
    player.hearts = player.maxHearts;

    enemies = level1Config.spawnPositions.map(p => spawnEnemy(p.x, p.y, level1Config.enemyConfig));
    killedEnemies = 0;

    initPlatforms();
    cameraX = 0;
    spawnTimer = 0;

    levelTimer = 0;
    randomEventTime = Math.random() * (40 - 20) + 20;
    cardEventTriggered = false;
    cardSystem.close();
    cardSystem.isDeckOpen = false;
    gameOver = false;
}

//========================= EXPORTS =========================
export {
    draw,
    handleClick,
    reset,
    handleKeyDown,
    handleKeyUp,
    setSelectedCharacter,
    goToMenu
}
