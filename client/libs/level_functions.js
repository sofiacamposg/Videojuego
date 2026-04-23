import { EnemyBase } from "../objects/EnemyBase.js";
import { Vector } from "../libs/Vector.js";
import { playerConfigs } from "./levelConfig.js";
export function spawnEnemy(x, y, config){
    return new EnemyBase(new Vector(x,y), config);
}
export function generatePlatform(lastPlatform){
    let minGap = 200;
    let maxGap = 300;

    let x = lastPlatform.x + Math.random() * (maxGap - minGap) + minGap;
    let y = lastPlatform.y + (Math.random() - 0.5) * 120;

    if(y > 420) y = 420;
    if(y < 380) y = 380;

    return {
        x, y,
        width: 100,
        height: 70
    };
}
export function updateCamera(playerX, canvasWidth, worldWidth){
    let cameraX = playerX - canvasWidth / 2;

    if(cameraX < 0) return 0;
    if(cameraX > worldWidth - canvasWidth)
        return worldWidth - canvasWidth;

    return cameraX;
}

export function updateCoins(player, prevKilled, newKilled) {
    player.coins += Math.floor(newKilled / 3) - Math.floor(prevKilled / 3);
}

export function drawCoins(ctx, x, y, coins) {
    ctx.fillStyle = "gold";
    ctx.font = "20px Arial";
    ctx.fillText("🪙 " + coins, x, y);
}