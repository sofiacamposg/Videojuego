"use strict"
//& dropped local mouseX/mouseY/handleMouseMove/drawButton — now using shared versions from game_functions
import { drawButton, handleClick, handleMouseMove } from "../libs/game_functions.js";

//? mouse track
let mouseX = 0;
let mouseY = 0;

let matchData = null;  //later, API data
let loaded = false;

const buttonExit = {
    x: 200,
    y: 500,
    text: "EXIT"
};

const buttonAgain = {
    x: 750,
    y: 500,
    text: "START AGAIN"
};

// Background image
let backgroundImage = new Image();
backgroundImage.src = "./assets/PortadaBase.png";

let cachedCtx;

//fetch of the match
export async function loadMatchSummary() {
    if (!window.lastMatchId || loaded) return;

    loaded = true;

    try {
        const res = await fetch(`http://localhost:3000/match/summary/${window.lastMatchId}`);
        matchData = await res.json();

        console.log("MATCH SUMMARY:", matchData);
    } catch (err) {
        console.log("Error loading match summary:", err);
    }
}

// DRAW
function drawScoreScene(ctx, canvas) {
    cachedCtx = ctx;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);

    // For prettu UI of the match summary 
    const panelX = 300;
    const panelY = 120;
    const panelW = 400;
    const panelH = 300;

    // background
    ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
    ctx.fillRect(panelX, panelY, panelW, panelH);

    // border
    ctx.strokeStyle = "#ffbb56";
    ctx.lineWidth = 3;
    ctx.strokeRect(panelX, panelY, panelW, panelH);

    // title
    ctx.fillStyle = "#ffbb56";
    ctx.font = "36px 'VT323'";
    ctx.textAlign = "center";
    ctx.fillText("MATCH RESULT", panelX + panelW / 2, panelY + 50);

    // stats
    ctx.textAlign = "left";
    ctx.font = "24px 'VT323'";

    const startX = panelX + 40;
    let y = panelY + 120;
    const gap = 40;

    if (matchData) {
        const centerX = panelX + panelW / 2;

        //  línea vertical
        ctx.strokeStyle = "#d4af37";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(centerX, panelY + 100);
        ctx.lineTo(centerX, panelY + panelH - 30);
        ctx.stroke();

        // estilos
        ctx.font = "26px 'VT323'";
        ctx.textBaseline = "middle";

        let y = panelY + 100;
        const gap = 45;

        const labels = ["PLAYER", "LEVEL", "FAME", "TIME", "RESULT"];
        const values = [
            matchData.player_name,
            matchData.level_reached,
            matchData.final_fame,
            matchData.duration_seconds + "s",
            matchData.result
        ];

        for (let i = 0; i < labels.length; i++) {

            // izquierda (labels)
            ctx.textAlign = "right";
            ctx.fillStyle = "#d4af37";
            ctx.fillText(labels[i], centerX - 20, y);

            // derecha (values)
            ctx.textAlign = "left";
            ctx.fillStyle = (labels[i] === "RESULT")
                ? (matchData.result === "WIN" ? "lime" : "red")
                : "white";

            ctx.fillText(values[i], centerX + 20, y);

            y += gap;
        }
    }

    drawButton(ctx, buttonExit, mouseX, mouseY);
    drawButton(ctx, buttonAgain, mouseX, mouseY);
}
//Mouse Move

function handleMouseMoveScore(event, canvas) {
    const pos = handleMouseMove(event, canvas);
    mouseX = pos.x;
    mouseY = pos.y;
}

// CLICK
function handleClickScoreScene() {
    if (handleClick(mouseX, mouseY, buttonExit, cachedCtx)) return "exit";
    if (handleClick(mouseX, mouseY, buttonAgain, cachedCtx)) return "again";
    return null;
}

export { drawScoreScene, handleClickScoreScene, handleMouseMoveScore };
