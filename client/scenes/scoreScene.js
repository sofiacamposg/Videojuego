"use strict"
//& dropped local mouseX/mouseY/handleMouseMove/drawButton — now using shared versions from game_functions
import { drawButton, handleClick, isMouseOverBox } from "../libs/game_functions.js";

//? mouse track
let mouseX = 0;
let mouseY = 0;
const buttonExit = {
    x: 150,
    y: 600,
    text: "EXIT"
};

const buttonAgain = {
    x: 850,
    y: 600,
    text: "START AGAIN"
};

// Background image
let backgroundImage = new Image();
backgroundImage.src = "./assets/PortadaBase.png";

let cachedCtx;

function drawScoreScene(ctx, canvas) {
    cachedCtx = ctx;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);

    drawButton(ctx, buttonExit, mouseX, mouseY);
    drawButton(ctx, buttonAgain, mouseX, mouseY);
}

//This function only checks the result of the previous one and returns it
function handleClickScoreScene() {
  //checks if the mouse is over EXIT or START AGAIN
  if (isClickOnButton(mouseX, mouseY, buttonExit, cachedCtx)) return "exit";
  if (isClickOnButton(mouseX, mouseY, buttonAgain, cachedCtx)) return "again";
  return null;
}

export { drawScoreScene, handleClickScoreScene };
