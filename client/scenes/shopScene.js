//& shopScene.js
//& Handles the shop screen where players can spend fame to buy extra hearts
//& Validates fame client-side before sending the purchase request to the API
//& Updates both the shop display and the HUD panel after a successful purchase

"use strict";

import { drawButton, handleClick, handleMouseMove } from "../libs/game_functions.js";

//? mouse position tracking
let mouseX = 0;
let mouseY = 0;
let cachedCtx;  // stored so handleClickShop can access ctx without it being passed in

//? button definitions
const buttonBuyHeart = {
    x: 400,
    y: 300,
    text: "BUY HEART - 50 FAME",
    disabled: false  // set to true when player can't afford a heart
};

const buttonBuyGalen = {
    x: 400,
    y: 350,
    text: "BUY GALEN'S REMEDY - 25 FAME",
    disabled: false
};

const buttonBack = {
    x: 400,
    y: 400,
    text: "BACK"
};

let message = "";  // feedback message shown after a purchase attempt

//? background image
let backgroundImage = new Image();
backgroundImage.src = "./assets/PortadaBase.png";

//* draws the full shop screen — background, panel, player stats, buttons and feedback message
export function drawShop(ctx, canvas) {
    cachedCtx = ctx;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);

    //? centered dark panel with golden border
    const panelW = 500;
    const panelH = 450;
    const panelX = canvas.width / 2 - panelW / 2;
    const panelY = canvas.height / 2 - panelH / 2;

    ctx.fillStyle = "rgba(0,0,0,0.7)";
    ctx.fillRect(panelX, panelY, panelW, panelH);

    ctx.strokeStyle = "#ffbb56";
    ctx.lineWidth = 3;
    ctx.strokeRect(panelX, panelY, panelW, panelH);

    //? shop title
    ctx.fillStyle = "#ffbb56";
    ctx.font = "48px VT323";
    ctx.textAlign = "center";
    ctx.fillText("SHOP", canvas.width / 2, panelY + 60);

    //? read player stats from global state
    const fame = window.loggedPlayer?.fame ?? 0;
    const hearts = window.loggedPlayer?.hearts ?? 1;
    const galen = window.loggedPlayer?.galen ?? 0;
    const canAffordHearts = fame >= 50;
    const canAffordGalen = fame >= 25;
    

    ctx.font = "28px VT323";
    ctx.fillStyle = "white";

    const centerX = canvas.width / 2;

    //? fame row — label on the left, value on the right of center line
    ctx.textAlign = "right";
    ctx.fillStyle = "#d4af37";
    ctx.fillText("FAME", centerX - 20, panelY + 140);

    ctx.textAlign = "left";
    ctx.fillStyle = "white";
    ctx.fillText(fame, centerX + 20, panelY + 140);

    //? hearts row
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

    // botón BUY hearts centrado
    buttonBuyHeart.x = canvas.width / 2;
    buttonBuyHeart.y = panelY + 290;
    buttonBuyHeart.text = canAffordHearts ? "BUY HEART - 50 FAME" : "NEED 50 FAME";
    buttonBuyHeart.disabled = !canAffordHearts;

    // botón BUY galen centrado
    buttonBuyGalen.x = canvas.width / 2;
    buttonBuyGalen.y = panelY + 345;
    buttonBuyGalen.text = canAffordGalen ? "BUY GALEN'S REMEDY - 25 FAME" : "NEED 25 FAME";
    buttonBuyGalen.disabled = !canAffordGalen;

    // botón BACK
    buttonBack.x = canvas.width / 2;
    buttonBack.y = panelY + 400;

    drawButton(ctx, buttonBuyHeart, mouseX, mouseY);
    drawButton(ctx, buttonBack, mouseX, mouseY);
    drawButton(ctx, buttonBuyGalen, mouseX, mouseY);

    //? feedback message — green for success, red for error
    if (message) {
        ctx.font = "24px VT323";
        ctx.textAlign = "center";
        ctx.fillStyle = message.includes("❤️") ? "lime" : "red";
        ctx.fillText(message, canvas.width / 2, panelY + panelH + 40);
    }
}

//* updates mouse position relative to the canvas each frame
export function handleMouseMoveShop(event, canvas) {
    const pos = handleMouseMove(event, canvas);
    mouseX = pos.x;
    mouseY = pos.y;
}

//* handles click events in the shop
//* back button returns to menu, buy button sends purchase request to the API
//* disabled state prevents the fetch if player can't afford the heart
export async function handleClickShop() {
    //? back button — return to menu
    if (handleClick(mouseX, mouseY, buttonBack, cachedCtx)) {
        return "back";
    }

    if (!buttonBuyHeart.disabled && handleClick(mouseX, mouseY, buttonBuyHeart, cachedCtx)) {
        const res = await fetch("http://localhost:3000/shop/buy-heart", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ player_id: window.loggedPlayer.player_id })
        });

        if (!res.ok) {
            message = await res.text() || "Purchase failed";
            return null;
        }
        const data = await res.json();
        window.loggedPlayer.fame = data.fame;
        window.loggedPlayer.hearts = data.hearts;
        message = "❤️ Heart purchased!";
        const fameEl = document.getElementById("fame");
        if (fameEl) fameEl.textContent = data.fame;
        return null;
    }

    if (!buttonBuyGalen.disabled && handleClick(mouseX, mouseY, buttonBuyGalen, cachedCtx)) {
        const res = await fetch("http://localhost:3000/shop/buy-galen", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ player_id: window.loggedPlayer.player_id })
        });

        if (!res.ok) {
            message = await res.text() || "Purchase failed";
            return null;
        }
        const data = await res.json();
        window.loggedPlayer.fame = data.fame;
        window.loggedPlayer.galen = data.galen;
        message = "🛡️ Galen's Remedy purchased!";
        const fameEl2 = document.getElementById("fame");
        if (fameEl2) fameEl2.textContent = data.fame;
        return null;
    }

    return null;
}