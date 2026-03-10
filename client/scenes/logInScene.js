"use strict"
// Mouse
let mouseX = 0;
let mouseY = 0;

const buttonBack = {
    x: 800,
    y: 100,
    text: "BACK TO MENU"
};

const buttonConfirm = {
    x: 800,
    y: 200,
    text: "CONFIRM"
};

// Imagen de fondo 
let backgroundImage = new Image();
backgroundImage.src = "./assets/fondo2.png";

function draw(ctx, canvas) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);

    // Título
    ctx.fillStyle = "white"; //texto
    ctx.font = "40px 'VT323'";
    ctx.textAlign = "center";
    ctx.strokeStyle = "rgb(255, 187, 86)"; //borde
    ctx.lineWidth = 3;
    ctx.strokeText("L O G    I N", canvas.width / 2, 180);
    ctx.fillText("L O G   I N", canvas.width / 2, 180);

    // “Inputs” falsos (solo visual por ahora)
    drawInputBox(ctx, canvas.width / 2, 350, 500, 60, "USERNAME");
    drawInputBox(ctx, canvas.width / 2, 470, 500, 60, "PASSWORD");

     // Botones
    drawButton(ctx, buttonConfirm);
    drawButton(ctx, buttonBack);

}

//Básicamente lo nuevo son la svariables de los inputs y esta función para poder dibujarlos
function drawInputBox(ctx, centerX, centerY, w, h, label) {
  const x = centerX - w / 2;
  const y = centerY - h / 2;

  // Caja
  ctx.strokeStyle = "rgb(255, 187, 86)";
  ctx.lineWidth = 3;
  ctx.strokeRect(x, y, w, h);

  // Label
  ctx.fillStyle = "white";
  ctx.font = "22px 'VT323'";
  ctx.textAlign = "left";
  ctx.fillText(label + ":", x, y - 15);

  // Placeholder text inside
  ctx.fillStyle = "rgba(255,255,255,0.6)";
  ctx.font = "22px 'VT323'";
  ctx.fillText("click to type...", x + 18, y + 40);
}

//Reutiliza función de menuScreen
function drawButton(ctx, button) {
    ctx.font = "25px 'VT323'";
    ctx.textAlign = 'center';

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
  if (isMouseOverButton(buttonBack)) return "back";
  if (isMouseOverButton(buttonConfirm)) return "confirm";
  return null;
}

export { draw, handleMouseMove, handleClick };