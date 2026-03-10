"use strict"
// Mouse
let mouseX = 0;
let mouseY = 0;
//Botones
const buttonBack = {
    x: 150,
    y: 50,
    text: "BACK TO MENU"
};

const buttonConfirm = {
    x: 850,
    y: 50,
    text: "CONFIRM"
};
//Inputs
let username = "";
let password = "";
let activeField = null; // "username" | "password" | null
const inputUsername = { cx: 500, cy: 350, w: 500, h: 60 };
const inputPassword = { cx: 500, cy: 470, w: 500, h: 60 };

// Imagen de fondo 
let backgroundImage = new Image();
backgroundImage.src = "./assets/PortadaBase.png";

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
  ctx.font = "25px 'VT323'";
    ctx.textAlign = "left";

    let valueToShow = "";
    if (label === "USERNAME") valueToShow = username;
    if (label === "PASSWORD") valueToShow = "*".repeat(password.length);

    if (valueToShow.length === 0) {
    ctx.fillStyle = "rgba(255,255,255,0.6)";
    ctx.fillText("click to type...", x + 18, y + 45);
    } else {
    ctx.fillStyle = "white";
    ctx.fillText(valueToShow, x + 18, y + 45);
    }
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
//Esta es para poder saber si el mouse pasa por encima del espacio del input
function isMouseOverBox(box) {
  const left = box.cx - box.w / 2;
  const right = box.cx + box.w / 2;
  const top = box.cy - box.h / 2;
  const bottom = box.cy + box.h / 2;

  return mouseX > left && mouseX < right && mouseY > top && mouseY < bottom;
}
//Esta función solo revisa el resultado de la anterior y hace return
function handleButtonClick() {
  // revisa si el mouse está encima de START, SETTINGS o LOG IN
  if (isMouseOverButton(buttonBack)) return "back";
  if (isMouseOverButton(buttonConfirm)) return "confirm";
  return null;
}

//Tenemos que hacer esta función para darle valor a la variable activeField
function handleKeyDown(event) {
  
  if (activeField === null) return; // si no hay campo activo, no hacemos nada

  if (event.key === "Backspace") { // Backspace
    event.preventDefault();
    if (activeField === "username") username = username.slice(0, -1);
    if (activeField === "password") password = password.slice(0, -1);
    return;
  }

  if (event.key === "Enter") { // Enter
    activeField = null;
    return;
  }
 
  if (event.key.length !== 1) return; // Solo aceptar teclas que sean 1 caracter (letras/números/símbolos)

  const allowed = /^[a-zA-Z0-9 _\-\.@]$/.test(event.key); // Filtro básico de caracteres permitidos
  if (!allowed) return;

  if (activeField === "username") username += event.key;
  if (activeField === "password") password += event.key;
}

function handleClick() {
  // 1) si clickeó input
  if (isMouseOverBox(inputUsername)) {
    activeField = "username";
    return "username";
  }
  if (isMouseOverBox(inputPassword)) {
    activeField = "password";
    console.log("activeField:", activeField);
    return "password";
  }

  // 2) si no, entonces clickeó botones
  return handleButtonClick(); // "back" | "confirm"
}
function getUsername() {
  return username;
}
function reset() {
  username = "";
  password = "";
  activeField = null;
  mouseX = 0;
  mouseY = 0;
}

function getPassword() {
  return password;
}
export { draw, handleMouseMove, handleClick, handleKeyDown, getUsername, getPassword, reset };