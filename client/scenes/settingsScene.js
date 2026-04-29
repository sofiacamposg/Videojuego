"use strict"
import { 
    handleMouseMove, 
    drawButton, 
    handleClick, 
    isMouseOverBox 
} from "../libs/game_functions.js";

let mouseX = 0;
let mouseY = 0;
let draggingVolume = false;

// Buttons
const buttonBack = { x: 150, y: 50, text: "BACK" };
const buttonConfirm = { x: 850, y: 50, text: "CONFIRM" };

// Valores guardados (los reales del juego)
let savedVolumeOn = false;
let savedVolumeLevel = 50;

// Valores temporales (los que el usuario está cambiando)
let volumeOn = savedVolumeOn;
let volumeLevel = savedVolumeLevel;

// Cajas del toggle y barra de volumen
const toggleBox = { x: 500, y: 300, w: 200, h: 60 };
const volumeBar = { x: 500, y: 400, w: 300, h: 30 };

let backgroundImage = new Image();
backgroundImage.src = "./assets/PortadaBase.png";

// Referencia a la música
const bgMusic = document.getElementById("bgMusic");

// Dibuja toda la pantalla de settings
function drawSettings(ctx, canvas) {
    ctx.clearRect(0,0,canvas.width,canvas.height);
    ctx.drawImage(backgroundImage,0,0,canvas.width,canvas.height);

    ctx.fillStyle = "white";
    ctx.font = "40px 'VT323'";
    ctx.textAlign = "center";
    ctx.strokeStyle = "rgb(255, 187, 86)";
    ctx.lineWidth = 3;
    ctx.strokeText("S E T T I N G S", canvas.width/2,150);
    ctx.fillText("S E T T I N G S", canvas.width/2,150);

    // Texto de volumen
    ctx.font = "25px 'VT323'";
    ctx.fillText("VOLUME", canvas.width/2,220);

    drawToggle(ctx); // botón ON/OFF
    if(volumeOn) drawVolumeBar(ctx); // solo muestra barra si está encendido

    // botones reutilizables
    drawButton(ctx, buttonBack, mouseX, mouseY);
    drawButton(ctx, buttonConfirm, mouseX, mouseY);
}

// Dibuja el botón de encendido/apagado
function drawToggle(ctx){
    const left = toggleBox.x - toggleBox.w/2;
    const top = toggleBox.y - toggleBox.h/2;

    const isHover = mouseX > left && mouseX < left + toggleBox.w && mouseY > top && mouseY < top + toggleBox.h;

    // Cambia color según estado
    ctx.fillStyle = volumeOn ? "green" : "red";
    if(isHover) ctx.fillStyle = volumeOn ? "#66ff66" : "#ff6666";

    ctx.strokeStyle = "white";
    ctx.lineWidth = 3;
    ctx.fillRect(left, top, toggleBox.w, toggleBox.h);
    ctx.strokeRect(left, top, toggleBox.w, toggleBox.h);

    ctx.font = "25px 'VT323'";
    ctx.fillStyle = "white";
    ctx.textAlign = "center";
    ctx.fillText(volumeOn ? "ON" : "OFF", toggleBox.x, toggleBox.y + 8);
}

// Dibuja la barra del volumen
function drawVolumeBar(ctx){
    const left = volumeBar.x - volumeBar.w/2;

    ctx.strokeStyle = "white";
    ctx.strokeRect(left,volumeBar.y,volumeBar.w,volumeBar.h);

    // Calcula cuánto se llena la barra
    let filled = (volumeLevel/100) * volumeBar.w;
    ctx.fillStyle = "red";
    ctx.fillRect(left,volumeBar.y,filled,volumeBar.h);

    ctx.fillStyle = "white";
    ctx.font = "20px 'VT323'";
    ctx.fillText("LEVEL: "+volumeLevel, volumeBar.x, volumeBar.y+60);
}

// Detecta movimiento del mouse
function handleMouseMoveSettings(event, canvas){
    const pos = handleMouseMove(event, canvas);
    mouseX = pos.x;
    mouseY = pos.y;

    // dragging barra
    if(draggingVolume){
        const left = volumeBar.x - volumeBar.w/2;
        const posX = mouseX - left;
        volumeLevel = Math.min(
            Math.max(Math.floor((posX / volumeBar.w) * 100),0),
            100
        );
    }
}

// Maneja clicks del usuario
function handleClickSettings(ctx){

    // toggle
    if(isMouseOverBox(mouseX, mouseY, toggleBox)){
        volumeOn = !volumeOn;
        return;
    }

    // confirm
    if(handleClick(mouseX, mouseY, buttonConfirm, ctx)){
        savedVolumeOn = volumeOn;
        savedVolumeLevel = volumeLevel;

        // Aplica los cambios a la música
        bgMusic.muted = !savedVolumeOn;
        bgMusic.volume = savedVolumeLevel / 100;

        return "confirm";
    }

    // back
    if(handleClick(mouseX, mouseY, buttonBack, ctx)){
        volumeOn = savedVolumeOn;
        volumeLevel = savedVolumeLevel;
        return "back";
    }
}

// Empieza a arrastrar la barra
function startDragging(){
    if(volumeOn && isMouseOverBox(mouseX, mouseY, volumeBar)){
        draggingVolume = true;
    }
}

function stopDragging(){
    draggingVolume = false;
}

// Se ejecuta cuando entras a settings
function resetSettings(){
    draggingVolume = false;
    mouseX = 0;
    mouseY = 0;

    // Carga los valores guardados
    volumeOn = savedVolumeOn;
    volumeLevel = savedVolumeLevel;
}

export { drawSettings, handleMouseMoveSettings, handleClickSettings, startDragging, stopDragging, resetSettings };