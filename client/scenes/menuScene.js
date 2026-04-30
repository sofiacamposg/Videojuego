//& menuScene.js
//& Handles the main menu screen — draws the background and navigation buttons
//& Entry point of the game where the player can start, access settings or open the shop

"use strict"
import { handleMouseMove, handleClick, drawButton } from "../libs/game_functions.js";

//? mouse position tracking
let mouseX = 0;
let mouseY = 0;

//? button definitions
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

const buttonShop = {
    x: 500,
    y: 550,
    text: "SHOP"
};

//? background image
let backgroundImage = new Image();
backgroundImage.src = "./assets/Portada.png";

//* draws the main menu — background image and all three navigation buttons
function drawMenu(ctx, canvas) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);

    drawButton(ctx, buttonStart, mouseX, mouseY);
    drawButton(ctx, buttonSettings, mouseX, mouseY);
    drawButton(ctx, buttonShop, mouseX, mouseY);
}

//* checks which button was clicked and returns the corresponding scene name
function handleClickMenu(ctx) {
    if (handleClick(mouseX, mouseY, buttonStart, ctx)) return "start";      // go to login
    if (handleClick(mouseX, mouseY, buttonSettings, ctx)) return "settings"; // go to settings
    if (handleClick(mouseX, mouseY, buttonShop, ctx)) return "shop";         // go to shop
    return null;
}

//* updates mouse position relative to the canvas each frame
function handleMouseMoveMenu(event, canvas) {
    const pos = handleMouseMove(event, canvas);
    mouseX = pos.x;
    mouseY = pos.y;
}

export { drawMenu, handleMouseMoveMenu, handleClickMenu };