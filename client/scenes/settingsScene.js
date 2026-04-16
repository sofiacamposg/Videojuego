"use strict"
import { mouseX, mouseY } from "../libs/game_functions.js";

let draggingVolume = false;

// Botones de navegación
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

// Dibuja toda la pantalla de settings
function draw(ctx, canvas) {
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

    drawButton(ctx, buttonBack);
    drawButton(ctx, buttonConfirm);
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

// Dibuja botones (BACK y CONFIRM)
function drawButton(ctx, button){
    ctx.font = "25px 'VT323'";
    ctx.textAlign = "center";

    const textWidth = ctx.measureText(button.text).width;
    const left = button.x - textWidth/2;
    const right = button.x + textWidth/2;

    // Detecta si el mouse está encima
    const isHover = mouseX > left && mouseX < right && mouseY > button.y - 30 && mouseY < button.y;

    ctx.fillStyle = isHover ? "red" : "white";
    ctx.fillText(button.text, button.x, button.y);
}

//controls 3 states of the sliding bar
function handleDrag(type){
    if(type === 'down'){  //case1: there's a click on the bar
        if(volumeOn &&
           mouseX > volumeBar.x - volumeBar.w/2 &&
           mouseX < volumeBar.x + volumeBar.w/2 &&
           mouseY > volumeBar.y &&
           mouseY < volumeBar.y + volumeBar.h){
            draggingVolume = true;
        }
    } else if(type === 'up'){  //case 2: no one has touch the bar
        draggingVolume = false;
    } else if(type === 'move' && draggingVolume){  //case 3: is moving
        const left = volumeBar.x - volumeBar.w/2;
        const pos = mouseX - left;
        volumeLevel = Math.min(Math.max(Math.floor((pos / volumeBar.w) * 100),0),100);
    }
}

// Detecta si el mouse está sobre el toggle
function isMouseOverToggle(){
    return mouseX > toggleBox.x - toggleBox.w/2 &&
           mouseX < toggleBox.x + toggleBox.w/2 &&
           mouseY > toggleBox.y - toggleBox.h/2 &&
           mouseY < toggleBox.y + toggleBox.h/2;
}

// Detecta si el mouse está sobre un botón
function isMouseOverButton(button){
    const textWidth = 120;
    return mouseX > button.x - textWidth/2 &&
           mouseX < button.x + textWidth/2 &&
           mouseY > button.y - 30 &&
           mouseY < button.y;
}

// Maneja clicks del usuario
function handleClick(){
    if(isMouseOverToggle()){
        volumeOn = !volumeOn; // cambia ON/OFF
        return;
    }

    if(isMouseOverButton(buttonConfirm)){
        // Guarda los cambios
        savedVolumeOn = volumeOn;
        savedVolumeLevel = volumeLevel;
        return "confirm";
    }

    if(isMouseOverButton(buttonBack)){
        // Cancela cambios y regresa a lo guardado
        volumeOn = savedVolumeOn;
        volumeLevel = savedVolumeLevel;
        return "back";
    }
}

// Se ejecuta cuando entras a settings
function reset(){
    draggingVolume = false;
    // Carga los valores guardados
    volumeOn = savedVolumeOn;
    volumeLevel = savedVolumeLevel;
}

export { draw, handleDrag, handleClick, reset };