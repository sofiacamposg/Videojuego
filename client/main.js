"use strict";

// Global variables
const canvasWidth = 1000;
const canvasHeight = 600;
const boxSize = 200;

let backgroundImage = new Image(); //función donde ajustamos nuestra imagen al canvas
backgroundImage.src = "Coliseo.png"; //referencia al fondo

let ctx; //referencia al objeto con las animmaciones que vamos a usar


function main() {
    const canvas = document.getElementById('canvas'); // Get a reference to the object with id 'canvas' in the page
    // Resize the element
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    ctx = canvas.getContext('2d');  // Get the context for drawing in 2D
    
    draw(); //función definida abajo
}

function draw() {

    // TÍTULO
  ctx.fillStyle = "white";
  ctx.font = "bold 56px Arial";
  ctx.textAlign = "center";
  ctx.fillText("GLADIATOR", canvasWidth / 2, 140);

  //FONDO
  ctx.clearRect(0, 0, canvasWidth, canvasHeight);  // Limpiar el canvas en cada frame
  ctx.drawImage(backgroundImage, 0, 0, canvasWidth, canvasHeight); // Dibujar la imagen de fondo
  // Draw a square
  ctx.fillStyle = "red";
  ctx.fillRect(canvasWidth / 2, canvasHeight / 2, boxSize, boxSize);

  requestAnimationFrame(draw);
}

