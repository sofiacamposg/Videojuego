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
const buttonBack = { x: 150, y: 100, text: "BACK" };
const buttonConfirm = { x: 850, y: 100, text: "CONFIRM" };

// Valores guardados (los reales del juego)
let savedVolumeOn = false;
let savedVolumeLevel = 50;
let handleBox = { x: 500, y: 355, w: 28, h: 28 };  

// Valores temporales (los que el usuario está cambiando)
let volumeOn = savedVolumeOn;
let volumeLevel = savedVolumeLevel;

// Cajas del toggle y barra de volumen
const toggleBox = { x: 500, y: 280, w: 200, h: 60 };
const volumeBar = { x: 500, y: 340, w: 300, h: 30 };

// Caja del toggle de daltonismo
const colorblindBox = { x: 500, y: 500, w: 200, h: 60 };

// Variable exportable del modo daltónico
export let colorblindMode = false;

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

    drawToggle(ctx);
    if(volumeOn) drawVolumeBar(ctx);

    // Texto de daltonismo
    ctx.fillStyle = "white";
    ctx.font = "25px 'VT323'";
    ctx.fillText("COLORBLIND MODE", canvas.width/2, 450);
    drawColorblindToggle(ctx);

    drawButton(ctx, buttonBack, mouseX, mouseY);
    drawButton(ctx, buttonConfirm, mouseX, mouseY);
}

// Dibuja el botón de encendido/apagado del volumen
function drawToggle(ctx){
    const left = toggleBox.x - toggleBox.w/2;
    const top = toggleBox.y - toggleBox.h/2;

    const isHover = mouseX > left && mouseX < left + toggleBox.w && mouseY > top && mouseY < top + toggleBox.h;

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

// Dibuja el botón de daltonismo
function drawColorblindToggle(ctx){
    const left = colorblindBox.x - colorblindBox.w/2;
    const top = colorblindBox.y - colorblindBox.h/2;

    const isHover = mouseX > left && mouseX < left + colorblindBox.w && mouseY > top && mouseY < top + colorblindBox.h;

    ctx.fillStyle = colorblindMode ? "#0077bb" : "#888888";
    if(isHover) ctx.fillStyle = colorblindMode ? "#3399dd" : "#aaaaaa";

    ctx.strokeStyle = "white";
    ctx.lineWidth = 3;
    ctx.fillRect(left, top, colorblindBox.w, colorblindBox.h);
    ctx.strokeRect(left, top, colorblindBox.w, colorblindBox.h);

    ctx.font = "25px 'VT323'";
    ctx.fillStyle = "white";
    ctx.textAlign = "center";
    ctx.fillText(colorblindMode ? "ON" : "OFF", colorblindBox.x, colorblindBox.y + 8);
}

// Dibuja la barra del volumen
function drawVolumeBar(ctx){
    const left = volumeBar.x - volumeBar.w/2;

    ctx.strokeStyle = "white";
    ctx.strokeRect(left,volumeBar.y,volumeBar.w,volumeBar.h);

    let filled = (volumeLevel/100) * volumeBar.w;
    ctx.fillStyle = "red";
    ctx.fillRect(left,volumeBar.y,filled,volumeBar.h);

    // circle handle so the user knows where to drag
    const handleX = left + filled;
    const handleY = volumeBar.y + volumeBar.h / 2;
    ctx.beginPath();
    ctx.arc(handleX, handleY, 14, 0, Math.PI * 2);
    ctx.fillStyle = "white";
    ctx.fill();
    ctx.strokeStyle = "gray";
    ctx.stroke();

    ctx.fillStyle = "white";
    ctx.font = "20px 'VT323'";
    ctx.fillText("LEVEL: "+ volumeLevel, volumeBar.x, volumeBar.y+60);
}

// Detecta movimiento del mouse
function handleMouseMoveSettings(event, canvas){
    const pos = handleMouseMove(event, canvas);
    mouseX = pos.x;
    mouseY = pos.y;

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

    // toggle volumen
    if(isMouseOverBox(mouseX, mouseY, toggleBox)){
        volumeOn = !volumeOn;
        return;
    }

    // toggle daltonismo
    if(isMouseOverBox(mouseX, mouseY, colorblindBox)){
        colorblindMode = !colorblindMode;
        const canvas = document.getElementById("canvas");
        canvas.style.filter = colorblindMode 
            ? "url(#deuteranopia)" 
            : "none";
        return;
    }

    // confirm
    if(handleClick(mouseX, mouseY, buttonConfirm, ctx)){
        savedVolumeOn = volumeOn;
        savedVolumeLevel = volumeLevel;
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
    const left = volumeBar.x - volumeBar.w / 2;
    handleBox.x = left + (volumeLevel / 100) * volumeBar.w;  //update handle position to match current volume
    handleBox.y = volumeBar.y + volumeBar.h / 2;
    if(volumeOn && isMouseOverBox(mouseX, mouseY, handleBox)){
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
    volumeOn = savedVolumeOn;
    volumeLevel = savedVolumeLevel;
}

export { drawSettings, handleMouseMoveSettings, handleClickSettings, startDragging, stopDragging, resetSettings };