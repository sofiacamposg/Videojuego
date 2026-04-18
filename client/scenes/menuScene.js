"use strict"
//& swapped local drawButton/isMouseOverButton for shared versions from game_functions
import { mouseX, mouseY, drawButton, handleClick as isClickOnButton } from "../libs/game_functions.js";

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

// Background
let backgroundImage = new Image();
backgroundImage.src = "./assets/Portada.png";

let cachedCtx;

function draw(ctx, canvas) {
    cachedCtx = ctx;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);

    drawButton(ctx, buttonStart, mouseX, mouseY);
    drawButton(ctx, buttonSettings, mouseX, mouseY);
}

//This function only checks the result of the previous one and returns it
function handleClick() {
  //checks if the mouse is over START, SETTINGS or LOG IN
  if (isClickOnButton(mouseX, mouseY, buttonStart, cachedCtx)) return "start";
  if (isClickOnButton(mouseX, mouseY, buttonSettings, cachedCtx)) return "settings";
  return null;
}

export { draw, handleClick };
