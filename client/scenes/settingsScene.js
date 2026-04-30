//& settingsScene.js
//& Handles the settings screen — volume toggle, volume slider, and colorblind mode toggle
//& Changes are only applied when the player confirms — back button discards unsaved changes

"use strict"
import { 
    handleMouseMove, 
    drawButton, 
    handleClick, 
    isMouseOverBox 
} from "../libs/game_functions.js";

//? mouse position tracking
let mouseX = 0;
let mouseY = 0;
let draggingVolume = false;  // true while the player is dragging the volume slider

//? button definitions
const buttonBack = { x: 150, y: 100, text: "BACK" };
const buttonConfirm = { x: 850, y: 100, text: "CONFIRM" };

//? saved values — the real applied settings, only updated on confirm
let savedVolumeOn = false;
let savedVolumeLevel = 50;
let handleBox = { x: 500, y: 355, w: 28, h: 28 };  // draggable slider handle hitbox

//? temporary values — what the user is currently adjusting before confirming
let volumeOn = savedVolumeOn;
let volumeLevel = savedVolumeLevel;

//? toggle and volume bar hitbox definitions
const toggleBox = { x: 500, y: 300, w: 200, h: 60 };
const volumeBar = { x: 500, y: 350, w: 300, h: 30 };

//? colorblind mode toggle hitbox
const colorblindBox = { x: 500, y: 500, w: 200, h: 60 };

// colorblind mode state — exported so other scenes can read it if needed
export let colorblindMode = false;

//? background image
let backgroundImage = new Image();
backgroundImage.src = "./assets/PortadaBase.png";

// reference to the background music element in the HTML
const bgMusic = document.getElementById("bgMusic");

//* draws the full settings screen — background, title, toggles, volume bar and buttons
function drawSettings(ctx, canvas) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);

    //? title with golden outline
    ctx.fillStyle = "white";
    ctx.font = "40px 'VT323'";
    ctx.textAlign = "center";
    ctx.strokeStyle = "rgb(255, 187, 86)";
    ctx.lineWidth = 3;
    ctx.strokeText("S E T T I N G S", canvas.width / 2, 150);
    ctx.fillText("S E T T I N G S", canvas.width / 2, 150);

    //? volume section label
    ctx.font = "25px 'VT323'";
    ctx.fillText("VOLUME", canvas.width / 2, 220);

    drawToggle(ctx);
    if(volumeOn) drawVolumeBar(ctx);  // only show the bar when volume is on

    //? colorblind mode section label and toggle
    ctx.fillStyle = "white";
    ctx.font = "25px 'VT323'";
    ctx.fillText("COLORBLIND MODE", canvas.width / 2, 450);
    drawColorblindToggle(ctx);

    drawButton(ctx, buttonBack, mouseX, mouseY);
    drawButton(ctx, buttonConfirm, mouseX, mouseY);
}

//* draws the volume on/off toggle button
//* green when on, red when off — lighter shade on hover
function drawToggle(ctx){
    const left = toggleBox.x - toggleBox.w / 2;
    const top = toggleBox.y - toggleBox.h / 2;

    const isHover = mouseX > left && mouseX < left + toggleBox.w && mouseY > top && mouseY < top + toggleBox.h;

    //? color changes based on state and hover
    ctx.fillStyle = volumeOn ? "green" : "red";
    if(isHover) ctx.fillStyle = volumeOn ? "#66ff66" : "#ff6666";

    ctx.strokeStyle = "white";
    ctx.lineWidth = 3;
    ctx.fillRect(left, top, toggleBox.w, toggleBox.h);
    ctx.strokeRect(left, top, toggleBox.w, toggleBox.h);

    //? ON / OFF label centered in the button
    ctx.font = "25px 'VT323'";
    ctx.fillStyle = "white";
    ctx.textAlign = "center";
    ctx.fillText(volumeOn ? "ON" : "OFF", toggleBox.x, toggleBox.y + 8);
}

//* draws the colorblind mode toggle button
//* blue when on, gray when off — lighter shade on hover
function drawColorblindToggle(ctx){
    const left = colorblindBox.x - colorblindBox.w / 2;
    const top = colorblindBox.y - colorblindBox.h / 2;

    const isHover = mouseX > left && mouseX < left + colorblindBox.w && mouseY > top && mouseY < top + colorblindBox.h;

    //? color changes based on state and hover
    ctx.fillStyle = colorblindMode ? "#0077bb" : "#888888";
    if(isHover) ctx.fillStyle = colorblindMode ? "#3399dd" : "#aaaaaa";

    ctx.strokeStyle = "white";
    ctx.lineWidth = 3;
    ctx.fillRect(left, top, colorblindBox.w, colorblindBox.h);
    ctx.strokeRect(left, top, colorblindBox.w, colorblindBox.h);

    //? ON / OFF label centered in the button
    ctx.font = "25px 'VT323'";
    ctx.fillStyle = "white";
    ctx.textAlign = "center";
    ctx.fillText(colorblindMode ? "ON" : "OFF", colorblindBox.x, colorblindBox.y + 8);
}

//* draws the volume level bar with a draggable circular handle
//* filled portion shows current volume level as a percentage
function drawVolumeBar(ctx){
    const left = volumeBar.x - volumeBar.w / 2;

    //? empty bar outline
    ctx.strokeStyle = "white";
    ctx.strokeRect(left, volumeBar.y, volumeBar.w, volumeBar.h);

    //? red fill proportional to volume level
    let filled = (volumeLevel / 100) * volumeBar.w;
    ctx.fillStyle = "red";
    ctx.fillRect(left, volumeBar.y, filled, volumeBar.h);

    //? circular handle at the current volume position
    const handleX = left + filled;
    const handleY = volumeBar.y + volumeBar.h / 2;
    ctx.beginPath();
    ctx.arc(handleX, handleY, 14, 0, Math.PI * 2);
    ctx.fillStyle = "white";
    ctx.fill();
    ctx.strokeStyle = "gray";
    ctx.stroke();

    //? numeric level label below the bar
    ctx.fillStyle = "white";
    ctx.font = "20px 'VT323'";
    ctx.fillText("LEVEL: " + volumeLevel, volumeBar.x, volumeBar.y + 60);
}

//* updates mouse position and recalculates volume level if the slider is being dragged
function handleMouseMoveSettings(event, canvas){
    const pos = handleMouseMove(event, canvas);
    mouseX = pos.x;
    mouseY = pos.y;

    //? if dragging — update volume based on mouse X position within the bar
    if(draggingVolume){
        const left = volumeBar.x - volumeBar.w / 2;
        const posX = mouseX - left;
        volumeLevel = Math.min(
            Math.max(Math.floor((posX / volumeBar.w) * 100), 0),
            100  // clamp between 0 and 100
        );
    }
}

//* handles all click events on the settings screen
//* toggles, confirm and back are handled in priority order
function handleClickSettings(ctx){

    //? volume toggle — flip on/off state
    if(isMouseOverBox(mouseX, mouseY, toggleBox)){
        volumeOn = !volumeOn;
        return;
    }

    //? colorblind toggle — flip mode and apply CSS filter to the canvas
    if(isMouseOverBox(mouseX, mouseY, colorblindBox)){
        colorblindMode = !colorblindMode;
        const canvas = document.getElementById("canvas");
        canvas.style.filter = colorblindMode 
            ? "url(#deuteranopia)"  // apply deuteranopia SVG filter
            : "none";
        return;
    }

    //? confirm — save current settings and apply them to the music element
    if(handleClick(mouseX, mouseY, buttonConfirm, ctx)){
        savedVolumeOn = volumeOn;
        savedVolumeLevel = volumeLevel;
        bgMusic.muted = !savedVolumeOn;
        bgMusic.volume = savedVolumeLevel / 100;
        return "confirm";
    }

    //? back — discard unsaved changes and restore saved values
    if(handleClick(mouseX, mouseY, buttonBack, ctx)){
        volumeOn = savedVolumeOn;
        volumeLevel = savedVolumeLevel;
        return "back";
    }
}

//* starts dragging the volume slider if the mouse is over the handle and volume is on
function startDragging(){
    const left = volumeBar.x - volumeBar.w / 2;
    handleBox.x = left + (volumeLevel / 100) * volumeBar.w;  // sync handle position with current volume
    handleBox.y = volumeBar.y + volumeBar.h / 2;
    if(volumeOn && isMouseOverBox(mouseX, mouseY, handleBox)){
        draggingVolume = true;
    }
}

//* stops dragging the volume slider on mouse up
function stopDragging(){
    draggingVolume = false;
}

//* resets temporary settings state — called when entering the settings scene
//* restores the temporary values to match the last saved settings
function resetSettings(){
    draggingVolume = false;
    mouseX = 0;
    mouseY = 0;
    volumeOn = savedVolumeOn;
    volumeLevel = savedVolumeLevel;
}

export { drawSettings, handleMouseMoveSettings, handleClickSettings, startDragging, stopDragging, resetSettings };