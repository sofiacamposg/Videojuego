/* 
& Menu scene, includes:
& buttons, draw, and helpers

^ Note: We recommend installing the Colorful Comments extension to improve code readability 
^ https://marketplace.visualstudio.com/items?itemName=ParthR2031.colorful-comments
^ Color Legend:
    & pink: file description
    * green: section title
    ~ purple: general funtion description
*/
"use strict"

//* === imports ===
import { handleMouseMove, handleClick, drawButton } from "../libs/game_functions.js";

//* === mouse tracker ===
let mouseX = 0;
let mouseY = 0;

//* === buttons ===
const buttonStart = {  //~ start a level
    x: 500,
    y: 450,
    text: "START"
};

const buttonSettings = {  //~ go to settings
    x: 500,
    y: 500,
    text: "SETTINGS"
};

const buttonShop = {  //~ go to shop
    x: 500,
    y: 550,
    text: "SHOP"
};

//~ background, our assets were made by NanoBanana
let backgroundImage = new Image();
backgroundImage.src = "../Videojuego/assets/Portada.png";

//* === functions ===
function drawMenu(ctx, canvas) {  //~ draw all the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);

    drawButton(ctx, buttonStart, mouseX, mouseY);
    drawButton(ctx, buttonSettings, mouseX, mouseY);
    drawButton(ctx, buttonShop, mouseX, mouseY);
}

//* === helpers ===
function handleClickMenu(ctx) {  //~ where does user click?
    if (handleClick(mouseX, mouseY, buttonStart, ctx)) return "start";  //tell main.js to stat a match
    if (handleClick(mouseX, mouseY, buttonSettings, ctx)) return "settings";  //tell main.js to go to settings
    if (handleClick(mouseX, mouseY, buttonShop, ctx)) return "shop";  //tell main.js user wants to shop
    return null;
}

function handleMouseMoveMenu(event, canvas) {  //~ wheres the mouse?
    const pos = handleMouseMove(event, canvas);
    mouseX = pos.x;
    mouseY = pos.y;
}
//* === exports ===
export { drawMenu, handleMouseMoveMenu, handleClickMenu };