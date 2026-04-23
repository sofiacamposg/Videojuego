"use strict"
import { handleMouseMove, handleClick, drawButton } from "../libs/game_functions.js";

// Mouse (SE QUEDA AQUÍ)
let mouseX = 0;
let mouseY = 0;

const buttonStart = {
    x: 500,
    y: 450,
    text: "START"
};

const buttonSettings = {
    x: 500,
    y: 500,
    text: "SETTINGS"
};

let backgroundImage = new Image();
backgroundImage.src = "./assets/Portada.png";

function drawMenu(ctx, canvas) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);

    drawButton(ctx, buttonStart, mouseX, mouseY);
    drawButton(ctx, buttonSettings, mouseX, mouseY);
}

function handleClickMenu(ctx) {
    if (handleClick(mouseX, mouseY, buttonStart, ctx)) return "start";
    if (handleClick(mouseX, mouseY, buttonSettings, ctx)) return "settings";
    return null;
}

function handleMouseMoveMenu(event, canvas) {
    const pos = handleMouseMove(event, canvas);
    mouseX = pos.x;
    mouseY = pos.y;
}

export { drawMenu, handleMouseMoveMenu, handleClickMenu };