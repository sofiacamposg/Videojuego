import { draw, handleMouseMove } from "./scenes/menuScene.js";

const canvasWidth = 2000;
const canvasHeight = 1000;

let canvas;
let ctx;

function main() {
    canvas = document.getElementById("canvas");

    canvas.width = canvasWidth;
    canvas.height = canvasHeight;

    ctx = canvas.getContext("2d");

    canvas.addEventListener("mousemove", (event) => {
        handleMouseMove(event, canvas);
    });

    gameLoop();
}

function gameLoop() {
    draw(ctx, canvas);
    requestAnimationFrame(gameLoop);
}

main();