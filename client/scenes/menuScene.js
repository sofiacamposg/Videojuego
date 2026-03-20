"use strict"
// Mouse
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

const buttonLogIn = {
    x: 500,
    y: 550,
    text: "LOG IN"
};

// Imagen de fondo
let backgroundImage = new Image();
backgroundImage.src = "./assets/Portada.png";

function draw(ctx, canvas) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);

    drawButton(ctx, buttonStart);
    drawButton(ctx, buttonSettings);
    drawButton(ctx, buttonLogIn);
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

//Esta función es para poder saber que botón se clickeo y asi movernos a otra escena
function isMouseOverButton(button) {
  //usa el mismo font y tamaño que usas para dibujar
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
//Esta función solo revisa el resultado de la anterior y hace return
function handleClick() {
  // revisa si el mouse está encima de START, SETTINGS o LOG IN
  if (isMouseOverButton(buttonStart)) return "start";
  if (isMouseOverButton(buttonSettings)) return "settings";
  if (isMouseOverButton(buttonLogIn)) return "login";
  return null;
}

export { draw, handleMouseMove, handleClick };