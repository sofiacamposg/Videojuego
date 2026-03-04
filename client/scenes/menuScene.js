"use strict"

// Mouse
let mouseX = 0;
let mouseY = 0;

const buttonStart = { x: 500, y: 450, text: "START" };
const buttonSettings = { x: 500, y: 500, text: "SETTINGS" };
const buttonLogIn = { x: 500, y: 550, text: "LOG IN" };

let backgroundImage = new Image();
backgroundImage.src = "./assets/Portada.png";

function draw(ctx, canvas) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);

    drawButton(ctx, buttonStart);
    drawButton(ctx, buttonSettings);
    drawButton(ctx, buttonLogIn);
}

function drawButton(ctx, button) {
    ctx.font = "25px 'VT323'";
    ctx.textAlign = "center";

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

// Recibe ctx para medir correctamente el texto
function handleClick(x, y, ctx) {
    const buttons = [
        { obj: buttonStart, action: "start" },
        { obj: buttonSettings, action: "settings" },
        { obj: buttonLogIn, action: "login" }
    ];

    for (let b of buttons) {
        const textWidth = ctx.measureText(b.obj.text).width;
        const textHeight = 30;
        const left = b.obj.x - textWidth / 2;
        const right = b.obj.x + textWidth / 2;
        const top = b.obj.y - textHeight;
        const bottom = b.obj.y;

        if (x > left && x < right && y > top && y < bottom) {
            if (b.action === "start") return "select";
            if (b.action === "settings") console.log("Settings pressed!");
            if (b.action === "login") console.log("Login pressed!");
        }
    }
}

export { draw, handleMouseMove, handleClick };