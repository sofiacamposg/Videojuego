"use strict"
import { mouseX, mouseY } from "../libs/game_functions.js";

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

function draw(ctx, canvas) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);

    drawButton(ctx, buttonStart);
    drawButton(ctx, buttonSettings);
}

function drawButton(ctx, button) {
    ctx.font = "25px 'VT323'";
    ctx.textAlign = "center";

    const textWidth = ctx.measureText(button.text).width;
    const textHeight = 30;

    const left = button.x - textWidth / 2;
    const right = button.x + textWidth / 2;
    const top = button.y - textHeight;
    const bottom = button.y;

    const isHover =
        mouseX > left &&
        mouseX < right &&
        mouseY > top &&
        mouseY < bottom;

    ctx.fillStyle = isHover ? "red" : "white";
    ctx.fillText(button.text, button.x, button.y);

    if (isHover) {
        ctx.beginPath();
        ctx.moveTo(left, button.y + 5);
        ctx.lineTo(right, button.y + 5);
        ctx.strokeStyle = "red";
        ctx.lineWidth = 3;
        ctx.stroke();
    }
}

//This function is used to detect which button was clicked and move to another scene
function isMouseOverButton(button) {
  //uses the same font and size used for drawing
  const dummyCanvas = document.createElement("canvas");
  const dummyCtx = dummyCanvas.getContext("2d");
  dummyCtx.font = "25px 'VT323'";

  const textWidth = dummyCtx.measureText(button.text).width;
  const textHeight = 30;

  const left = button.x - textWidth / 2;
  const right = button.x + textWidth / 2;
  const top = button.y - textHeight;
  const bottom = button.y;

  return mouseX > left && mouseX < right && mouseY > top && mouseY < bottom;
}
//This function only checks the result of the previous one and returns it
function handleClick() {
  //checks if the mouse is over START, SETTINGS or LOG IN
  if (isMouseOverButton(buttonStart)) return "start";
  if (isMouseOverButton(buttonSettings)) return "settings";
  return null;
}

export { draw, handleClick };