"use strict";

import { drawButton, handleClick, handleMouseMove } from "../libs/game_functions.js";

let mouseX = 0;
let mouseY = 0;
let cachedCtx;

const buttonBuyHeart = {
    x: 400,
    y: 300,
    text: "BUY HEART - 50 FAME",
    disabled: false
};

const buttonBack = {
    x: 400,
    y: 400,
    text: "BACK"
};

let message = "";

let backgroundImage = new Image();
backgroundImage.src = "./assets/PortadaBase.png";

export function drawShop(ctx, canvas) {
    cachedCtx = ctx;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);

    // panel centrado
    const panelW = 500;
    const panelH = 350;
    const panelX = canvas.width / 2 - panelW / 2;
    const panelY = canvas.height / 2 - panelH / 2;

    // fondo panel
    ctx.fillStyle = "rgba(0,0,0,0.7)";
    ctx.fillRect(panelX, panelY, panelW, panelH);

    // borde
    ctx.strokeStyle = "#ffbb56";
    ctx.lineWidth = 3;
    ctx.strokeRect(panelX, panelY, panelW, panelH);

    // título
    ctx.fillStyle = "#ffbb56";
    ctx.font = "48px VT323";
    ctx.textAlign = "center";
    ctx.fillText("SHOP", canvas.width / 2, panelY + 60);

    //  datos
    const fame = window.loggedPlayer?.fame ?? 0;
    const hearts = window.loggedPlayer?.hearts ?? 1;
    const canAfford = fame >= 50;

    ctx.font = "28px VT323";
    ctx.fillStyle = "white";

    const centerX = canvas.width / 2;

    // etiquetas + valores alineados
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

    // botón BUY centrado
    buttonBuyHeart.x = canvas.width / 2;
    buttonBuyHeart.y = panelY + 240;
    buttonBuyHeart.text = canAfford ? "BUY HEART - 50 FAME" : "NEED 50 FAME";
    buttonBuyHeart.disabled = !canAfford;

    // ⬅ botón BACK
    buttonBack.x = canvas.width / 2;
    buttonBack.y = panelY + 300;

    drawButton(ctx, buttonBuyHeart, mouseX, mouseY);
    drawButton(ctx, buttonBack, mouseX, mouseY);

    // mensaje
    if (message) {
        ctx.font = "24px VT323";
        ctx.textAlign = "center";

        ctx.fillStyle = message.includes("❤️") ? "lime" : "red";

        ctx.fillText(message, canvas.width / 2, panelY + panelH + 40);
    }
}

export function handleMouseMoveShop(event, canvas) {
    const pos = handleMouseMove(event, canvas);
    mouseX = pos.x;
    mouseY = pos.y;
}

export async function handleClickShop() {
    if (handleClick(mouseX, mouseY, buttonBack, cachedCtx)) {
        return "back";
    }

    if (buttonBuyHeart.disabled) return null;

    if (handleClick(mouseX, mouseY, buttonBuyHeart, cachedCtx)) {

        const res = await fetch("http://localhost:3000/shop/buy-heart", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                player_id: window.loggedPlayer.player_id
            })
        });

        const data = await res.json();

        if (res.ok && data.success) {
    window.loggedPlayer.fame = data.fame;
    window.loggedPlayer.hearts = data.hearts;
    message = "❤️ Heart purchased!";
    const fameEl = document.getElementById("fame");
    if (fameEl) fameEl.textContent = data.fame;
} else {
            message = data.error || "Not enough fame";
        }
    }

    return null;
}