// Global variables
const canvasWidth = 1000;
const canvasHeight = 600;
const boxSize = 200;

let ctx; //referencia al objeto con las animmaciones que vamos a usar
let canvas; 

let backgroundImage = new Image(); //función donde ajustamos nuestra imagen al canvas
backgroundImage.src = "./assets/Portada.png"; //referencia al fondo

//Mouse
let mouseX = 0; //Constantes para saber donde está el mouse
let mouseY = 0;
const buttonStart = { //Botón Start
    x: 500,
    y: 450,
    text: "START"  
};
const buttonSettings = { //Botón Settings
    x: 500,
    y: 500,
    text: "SETTINGS"   
};
const buttonLogIn = { //Botón Settings
    x: 500,
    y: 550,
    text: "LOG IN"   
};

function main() {
    canvas = document.getElementById('canvas'); // Get a reference to the object with id 'canvas' in the page
    // Resize the element
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    ctx = canvas.getContext('2d');  // Get the context for drawing in 2D

    canvas.addEventListener("mousemove", handleMouseMove);
    draw(); //función definida abajo
}

function draw() {
  //FONDO
  ctx.clearRect(0, 0, canvasWidth, canvasHeight);  // Limpiar el canvas en cada frame
  ctx.drawImage(backgroundImage, 0, 0, canvasWidth, canvasHeight); // Dibujar la imagen de fondo

  drawButton(buttonStart);//Llamamos a drawButton()
  drawButton(buttonSettings);
  drawButton(buttonLogIn);
  requestAnimationFrame(draw);
}

//Función que dibuja los botones
function drawButton(button) {
    ctx.font = "25px 'VT223'";
    ctx.textAlign = "center";

    const textWidth = ctx.measureText(button.text).width;
    const textHeight = 30; // aproximado

    const left = button.x - textWidth / 2;
    const right = button.x + textWidth / 2;
    const top = button.y - textHeight;
    const bottom = button.y;

    // Detectar hover
    const isHover =
        mouseX > left &&
        mouseX < right &&
        mouseY > top &&
        mouseY < bottom;

    ctx.fillStyle = isHover ? "red" : "white";
    ctx.fillText(button.text, button.x, button.y);

    // Subrayado si hover
    if (isHover) {
        ctx.beginPath();
        ctx.moveTo(left, button.y + 5);
        ctx.lineTo(right, button.y + 5);
        ctx.strokeStyle = "red";
        ctx.lineWidth = 3;
        ctx.stroke();
    }
}

 //Botones click event
function handleMouseMove(event) {
    const rect = canvas.getBoundingClientRect();
    mouseX = event.clientX - rect.left;
    mouseY = event.clientY - rect.top;
}

