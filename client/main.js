import { draw as drawMenu, handleMouseMove as handleMouseMoveMenu, handleClick as handleClickMenu } from "./scenes/menuScene.js";
import SelectScene from "./scenes/selectScene.js";

const canvasWidth = 1000;
const canvasHeight = 600;

let canvas;
let ctx;
let currentScene; // "menu" o SelectScene instance

function main() {
    canvas = document.getElementById("canvas");
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    ctx = canvas.getContext("2d");

    // Empezar con el menú
    currentScene = "menu";

    canvas.addEventListener("mousemove", (event) => {
        if (currentScene === "menu") {
            handleMouseMoveMenu(event, canvas);
        } else {
            currentScene.handleMouseMove(event);
        }
    });

    canvas.addEventListener("click", (event) => {
        const rect = canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        if (currentScene === "menu") {
            // PASAR ctx aquí
            const scene = handleClickMenu(x, y, ctx);
            if (scene === "select") {
                currentScene = new SelectScene(canvas);
            }
        }
    });

    gameLoop();
}

function gameLoop() {
    if (currentScene === "menu") {
        drawMenu(ctx, canvas);
    } else {
        currentScene.draw(ctx);
    }
    requestAnimationFrame(gameLoop);
}

main();