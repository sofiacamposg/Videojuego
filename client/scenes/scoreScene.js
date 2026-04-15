"use strict"
// Mouse
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

function draw(ctx, canvas) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);

    drawButton(ctx, buttonExit);
    drawButton(ctx, buttonAgain);
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

function handleMouseMove(event, canvas) {
    const rect = canvas.getBoundingClientRect();
    mouseX = event.clientX - rect.left;
    mouseY = event.clientY - rect.top;
}

//This function is used to detect which button was clicked so we can move to another scene
function isMouseOverButton(button) {
  //uses the same font and size as used for drawing
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
  //checks if the mouse is over EXIT or START AGAIN
  if (isMouseOverButton(buttonExit)) return "exit";
  if (isMouseOverButton(buttonAgain)) return "again";
  return null;
}

export { draw, handleMouseMove, handleClick };