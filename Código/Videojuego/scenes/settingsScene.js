/* 
& Settings scene, includes:
& buttons, draw and helpers

^ Note: We recommend installing the Colorful Comments extension to improve code readability 
^ https://marketplace.visualstudio.com/items?itemName=ParthR2031.colorful-comments
^ Color Legend:
    & pink: file description
    * green: section title
    ~ purple: general funtion description
*/
"use strict"

//* === imports ===
import { handleMouseMove, drawButton, handleClick, isMouseOverBox } from "../libs/game_functions.js";

//* === mouse tracker ang global variables===
let mouseX = 0;
let mouseY = 0;
let colorblindMode = false;
let draggingVolume = false;  //when user is moving the bar
let savedVolumeOn = true;
let savedVolumeLevel = 50;
let handleBox = { x: 500, y: 355, w: 28, h: 28 };  
//new values assigned by user
let volumeOn = savedVolumeOn;
let volumeLevel = savedVolumeLevel;

//* === buttons ===
const buttonBack = { x: 150, y: 100, text: "BACK" };
const buttonConfirm = { x: 850, y: 100, text: "CONFIRM" };
//volume bar
const toggleBox = { x: 500, y: 300, w: 200, h: 60 };
const volumeBar = { x: 500, y: 350, w: 300, h: 30 };
// color blind mode button
const colorblindBox = { x: 500, y: 500, w: 200, h: 60 };

//~ background, our assets were made by NanoBanana
let backgroundImage = new Image();
backgroundImage.src = "../Videojuego/assets/PortadaBase.png";

//music
const bgMusic = document.getElementById("bgMusic");

//* === functions ===
function drawSettings(ctx, canvas) {  //~ draw all the canvas
    ctx.clearRect(0,0,canvas.width,canvas.height);
    ctx.drawImage(backgroundImage,0,0,canvas.width,canvas.height);

    //tittle
    ctx.fillStyle = "white";
    ctx.font = "40px 'VT323'";
    ctx.textAlign = "center";
    ctx.strokeStyle = "rgb(255, 187, 86)";
    ctx.lineWidth = 3;
    ctx.strokeText("S E T T I N G S", canvas.width/2,150);
    ctx.fillText("S E T T I N G S", canvas.width/2,150);

    // labels
    ctx.font = "25px 'VT323'";
    ctx.fillText("VOLUME", canvas.width/2,220);

    drawToggle(ctx);
    if(volumeOn) drawVolumeBar(ctx);  //draw the bar when volume is on

    ctx.fillStyle = "white";
    ctx.font = "25px 'VT323'";
    ctx.fillText("COLORBLIND MODE", canvas.width/2, 450);
    drawColorblindToggle(ctx);

    drawButton(ctx, buttonBack, mouseX, mouseY);
    drawButton(ctx, buttonConfirm, mouseX, mouseY);
}

function drawToggle(ctx){  //~ draw the volume button
    //dimentions
    const left = toggleBox.x - toggleBox.w/2;
    const top = toggleBox.y - toggleBox.h/2;

    const isHover = mouseX > left && mouseX < left + toggleBox.w && mouseY > top && mouseY < top + toggleBox.h;

    ctx.fillStyle = volumeOn ? "green" : "red";
    if(isHover) ctx.fillStyle = volumeOn ? "#66ff66" : "#ff6666";  //change color depending on status

    ctx.strokeStyle = "white";
    ctx.lineWidth = 3;
    ctx.fillRect(left, top, toggleBox.w, toggleBox.h);
    ctx.strokeRect(left, top, toggleBox.w, toggleBox.h);

    ctx.font = "25px 'VT323'";
    ctx.fillStyle = "white";
    ctx.textAlign = "center";
    ctx.fillText(volumeOn ? "ON" : "OFF", toggleBox.x, toggleBox.y + 8);  //change text depending on status
}

function drawColorblindToggle(ctx){  //~ draw colorblicnd button
    //dimentions
    const left = colorblindBox.x - colorblindBox.w/2;
    const top = colorblindBox.y - colorblindBox.h/2;

    const isHover = mouseX > left && mouseX < left + colorblindBox.w && mouseY > top && mouseY < top + colorblindBox.h;

    if(isHover) ctx.fillStyle = colorblindMode ? "#3399dd" : "#aaaaaa";

    ctx.strokeStyle = "white";
    ctx.lineWidth = 3;
    ctx.fillRect(left, top, colorblindBox.w, colorblindBox.h);
    ctx.strokeRect(left, top, colorblindBox.w, colorblindBox.h);

    ctx.font = "25px 'VT323'";
    ctx.fillStyle = "white";
    ctx.textAlign = "center";
    ctx.fillText(colorblindMode ? "ON" : "OFF", colorblindBox.x, colorblindBox.y + 8);  //change text depending on status
}

function drawVolumeBar(ctx){  //~ draw volume bar 
    //dimentions
    const left = volumeBar.x - volumeBar.w/2;

    ctx.strokeStyle = "white";
    ctx.strokeRect(left,volumeBar.y,volumeBar.w,volumeBar.h);
    let filled = (volumeLevel/100) * volumeBar.w;  //change color depending on volume
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
    ctx.fillText("LEVEL: "+ volumeLevel, volumeBar.x, volumeBar.y+60);  //number confirmation
}

//* === helpers ===
function handleMouseMoveSettings(event, canvas){  //~ wheres the mouse?
    const pos = handleMouseMove(event, canvas);
    mouseX = pos.x;
    mouseY = pos.y;

    if(draggingVolume){  //is user moveing the bar?
        const left = volumeBar.x - volumeBar.w/2;
        const posX = mouseX - left;
        volumeLevel = Math.min(  //constraint to avoid float numbers
            Math.max(Math.floor((posX / volumeBar.w) * 100),0),
            100
        );
    }
}

function handleClickSettings(ctx){  //~ where does user click?
    if(isMouseOverBox(mouseX, mouseY, toggleBox)){  //case1: user activates/desactivates the volume
        volumeOn = !volumeOn;
        return;
    }

    // case2: user activates/desactivates color blindness mode, implemented with the help of AI and https://daltonlens.org/colorblindness-simulator
    // to determine if the colors had high contrast for any type of color blindness
    if(isMouseOverBox(mouseX, mouseY, colorblindBox)){
        colorblindMode = !colorblindMode;
        document.documentElement.style.filter = colorblindMode ? "hue-rotate(180deg)" : "none";
        return;
    }

    if(handleClick(mouseX, mouseY, buttonConfirm, ctx)){  //case3: user has made all changes
        savedVolumeOn = volumeOn;
        savedVolumeLevel = volumeLevel;
        bgMusic.muted = !savedVolumeOn;
        bgMusic.volume = savedVolumeLevel / 100;
        return "confirm";  //go tell main.js
    }

    if(handleClick(mouseX, mouseY, buttonBack, ctx)){  //case4: user wants to go to menu without saving changes
        volumeOn = savedVolumeOn;
        volumeLevel = savedVolumeLevel;
        return "back";  //go tell main.js
    }
}

function startDragging(){ //~ "user is moving the bar" logic
    const left = volumeBar.x - volumeBar.w / 2;
    handleBox.x = left + (volumeLevel / 100) * volumeBar.w;  //update handle position to match current volume
    handleBox.y = volumeBar.y + volumeBar.h / 2;
    if(volumeOn && isMouseOverBox(mouseX, mouseY, handleBox)){
        draggingVolume = true;
    }
}

function stopDragging(){  //~ user stopped dragging
    draggingVolume = false;
}

function resetSettings(){  //~ base data
    draggingVolume = false;
    mouseX = 0;
    mouseY = 0;
    volumeOn = savedVolumeOn;
    volumeLevel = savedVolumeLevel;
}
//* === exports ===
export { drawSettings, handleMouseMoveSettings, handleClickSettings, startDragging, stopDragging, resetSettings };