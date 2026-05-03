/* 
& Shop scene, includes:
& info about items and current fame, buttons, api calls

^ Note: We recommend installing the Colorful Comments extension to improve code readability 
^ https://marketplace.visualstudio.com/items?itemName=ParthR2031.colorful-comments
^ Color Legend:
    & pink: file description
    * green: section title
    ~ purple: general funtion description
*/
"use strict";

//* === imports ===
import { drawButton, handleClick, handleMouseMove } from "../libs/game_functions.js";

//* === mouse track and global variables ===
let mouseX = 0;
let mouseY = 0;
let cachedCtx;
let message = "";

//* === buttons ===
const buttonBuyHeart = {  //~ to buy more hearts
    x: 400,
    y: 300,
    text: "BUY HEART - 50 FAME",
    disabled: false
};

const buttonBuyGalen = {  //~ to buy more shields
    x: 400,
    y: 350,
    text: "BUY GALEN'S REMEDY - 25 FAME",
    disabled: false
};

const buttonBack = {  //~ to go bakc to menu
    x: 400,
    y: 400,
    text: "BACK"
};

//~ background, our assets were made by NanoBanana
let backgroundImage = new Image();
backgroundImage.src = "../Videojuego/assets/PortadaBase.png";

//* === function ===
export function drawShop(ctx, canvas) { //~ draw all the canvas
    cachedCtx = ctx;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);

    // rect where info will be displayed
    const panelW = 500;
    const panelH = 450;
    const panelX = canvas.width / 2 - panelW / 2;
    const panelY = canvas.height / 2 - panelH / 2;
    ctx.fillStyle = "rgba(0,0,0,0.7)";
    ctx.fillRect(panelX, panelY, panelW, panelH);

    // rect border
    ctx.strokeStyle = "#ffbb56";
    ctx.lineWidth = 3;
    ctx.strokeRect(panelX, panelY, panelW, panelH);

    // tittle
    ctx.fillStyle = "#ffbb56";
    ctx.font = "48px VT323";
    ctx.textAlign = "center";
    ctx.fillText("SHOP", canvas.width / 2, panelY + 60);

    // info, hardcoded data for edge cases
    const fame = window.loggedPlayer?.fame ?? 0;
    const hearts = window.loggedPlayer?.hearts ?? 1;
    const galen = window.loggedPlayer?.galen ?? 0;
    const canAffordHearts = fame >= 50;  //which message needs to display, for the user to buy or to let them know they need more fame
    const canAffordGalen = fame >= 25;

    ctx.font = "28px VT323";
    ctx.fillStyle = "white";

    const centerX = canvas.width / 2;

    // labels
    ctx.textAlign = "right";
    ctx.fillStyle = "#d4af37";
    ctx.fillText("FAME", centerX - 20, panelY + 140);

    ctx.textAlign = "left";
    ctx.fillStyle = "white";
    ctx.fillText(fame, centerX + 20, panelY + 140);

    ctx.textAlign = "right";
    ctx.fillStyle = "#d4af37";
    ctx.fillText("HEARTS", centerX - 20, panelY + 190);

    ctx.textAlign = "left";
    ctx.fillStyle = "white";
    ctx.fillText("❤️ " + hearts, centerX + 20, panelY + 190);

    ctx.textAlign = "right";
    ctx.fillStyle = "#d4af37";
    ctx.fillText("Galen's Remedy", centerX - 20, panelY + 240);

    ctx.textAlign = "left";
    ctx.fillStyle = "white";
    ctx.fillText("🛡️ " + galen, centerX + 20, panelY + 240);

    // buy hearts button
    buttonBuyHeart.x = canvas.width / 2;
    buttonBuyHeart.y = panelY + 290;
    buttonBuyHeart.text = canAffordHearts ? "BUY HEART - 50 FAME" : "NEED 50 FAME";
    buttonBuyHeart.disabled = !canAffordHearts;

    // nuy galen button
    buttonBuyGalen.x = canvas.width / 2;
    buttonBuyGalen.y = panelY + 345;
    buttonBuyGalen.text = canAffordGalen ? "BUY GALEN'S REMEDY - 25 FAME" : "NEED 25 FAME";
    buttonBuyGalen.disabled = !canAffordGalen;

    // back button
    buttonBack.x = canvas.width / 2;
    buttonBack.y = panelY + 400;

    drawButton(ctx, buttonBuyHeart, mouseX, mouseY);
    drawButton(ctx, buttonBack, mouseX, mouseY);
    drawButton(ctx, buttonBuyGalen, mouseX, mouseY);

    // status message
    if (message) {
        ctx.font = "24px VT323";
        ctx.textAlign = "center";

        ctx.fillStyle = message.includes("❤️") ? "lime" : "red";
        ctx.fillText(message, canvas.width / 2, panelY + panelH + 40);
    }
}

//* === helpers
export function handleMouseMoveShop(event, canvas) {  //~ wheres the mouse?
    const pos = handleMouseMove(event, canvas);
    mouseX = pos.x;
    mouseY = pos.y;
}

export async function handleClickShop() {  //~ where does the user clicking?
    if (handleClick(mouseX, mouseY, buttonBack, cachedCtx)) {
        return "back";  //tell main.js the user wants to go to menu
    }

    if (!buttonBuyHeart.disabled && handleClick(mouseX, mouseY, buttonBuyHeart, cachedCtx)) {
        const res = await fetch("http://localhost:3000/shop/buy-heart", {
            method: "POST",  //ask the db if the player can buy a heart
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ player_id: window.loggedPlayer.player_id })
        });

        if (!res.ok) {  //edge case
            message = await res.text() || "Purchase failed";
            return null;
        }
        const data = await res.json();
        window.loggedPlayer.fame = data.fame;
        window.loggedPlayer.hearts = data.hearts;
        message = "❤️ Heart purchased!";  //confirmation
        const fameEl = document.getElementById("fame");
        if (fameEl) fameEl.textContent = data.fame;  //update right-side stats
        return null;
    }

    if (!buttonBuyGalen.disabled && handleClick(mouseX, mouseY, buttonBuyGalen, cachedCtx)) {
        const res = await fetch("http://localhost:3000/shop/buy-galen", {
            method: "POST",  //ask the db if the player can buy a heart
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ player_id: window.loggedPlayer.player_id })
        });

        if (!res.ok) {  //edge case
            message = await res.text() || "Purchase failed";
            return null;
        }
        const data = await res.json();
        window.loggedPlayer.fame = data.fame;
        window.loggedPlayer.galen = data.galen;
        message = "🛡️ Galen's Remedy purchased!";  //confirmation
        const fameEl2 = document.getElementById("fame");  //update reight-side stats
        if (fameEl2) fameEl2.textContent = data.fame;
        return null;
    }

    return null;
}