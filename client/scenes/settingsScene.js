"use strict"

let mouseX = 0;
let mouseY = 0;
let draggingVolume = false;

const buttonBack = { x: 150, y: 50, text: "BACK" };
const buttonConfirm = { x: 850, y: 50, text: "CONFIRM" };

let volumeOn = false;
let volumeLevel = 50;

const toggleBox = { x: 500, y: 300, w: 200, h: 60 };
const volumeBar = { x: 500, y: 400, w: 300, h: 30 };

let backgroundImage = new Image();
backgroundImage.src = "./assets/PortadaBase.png";

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

    ctx.font = "25px 'VT323'";
    ctx.fillText("VOLUME", canvas.width/2,220);

    drawToggle(ctx);
    if(volumeOn) drawVolumeBar(ctx);

    drawButton(ctx, buttonBack);
    drawButton(ctx, buttonConfirm);
}

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

function drawVolumeBar(ctx){
    const left = volumeBar.x - volumeBar.w/2;
    ctx.strokeStyle = "white";
    ctx.strokeRect(left,volumeBar.y,volumeBar.w,volumeBar.h);
    let filled = (volumeLevel/100) * volumeBar.w;
    ctx.fillStyle = "red";
    ctx.fillRect(left,volumeBar.y,filled,volumeBar.h);

    ctx.fillStyle = "white";
    ctx.font = "20px 'VT323'";
    ctx.fillText("LEVEL: "+volumeLevel, volumeBar.x, volumeBar.y+60);
}

function drawButton(ctx, button){
    ctx.font = "25px 'VT323'";
    ctx.textAlign = "center";
    const textWidth = ctx.measureText(button.text).width;
    const left = button.x - textWidth/2;
    const right = button.x + textWidth/2;
    const isHover = mouseX > left && mouseX < right && mouseY > button.y - 30 && mouseY < button.y;
    ctx.fillStyle = isHover ? "red" : "white";
    ctx.fillText(button.text, button.x, button.y);
}

function handleMouseMove(event, canvas){
    const rect = canvas.getBoundingClientRect();
    mouseX = event.clientX - rect.left;
    mouseY = event.clientY - rect.top;

    if(draggingVolume){
        const left = volumeBar.x - volumeBar.w/2;
        const pos = mouseX - left;
        volumeLevel = Math.min(Math.max(Math.floor((pos / volumeBar.w) * 100),0),100);
    }
}

function isMouseOverToggle(){
    return mouseX > toggleBox.x - toggleBox.w/2 &&
           mouseX < toggleBox.x + toggleBox.w/2 &&
           mouseY > toggleBox.y - toggleBox.h/2 &&
           mouseY < toggleBox.y + toggleBox.h/2;
}

function isMouseOverButton(button){
    const textWidth = 120;
    return mouseX > button.x - textWidth/2 &&
           mouseX < button.x + textWidth/2 &&
           mouseY > button.y - 30 &&
           mouseY < button.y;
}

function handleClick(){
    if(isMouseOverToggle()){
        volumeOn = !volumeOn;
        return;
    }
    if(isMouseOverButton(buttonBack)) return "back";
    if(isMouseOverButton(buttonConfirm)) return "confirm";
}

function startDragging(){
    if(volumeOn && mouseX > volumeBar.x - volumeBar.w/2 &&
       mouseX < volumeBar.x + volumeBar.w/2 &&
       mouseY > volumeBar.y &&
       mouseY < volumeBar.y + volumeBar.h){
        draggingVolume = true;
    }
}

function stopDragging(){
    draggingVolume = false;
}

function reset(){
    draggingVolume = false;
    mouseX = 0;
    mouseY = 0;
}

export { draw, handleMouseMove, handleClick, startDragging, stopDragging, reset };