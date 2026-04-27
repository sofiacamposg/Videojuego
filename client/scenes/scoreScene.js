"use strict"
//& dropped local mouseX/mouseY/handleMouseMove/drawButton — now using shared versions from game_functions
import { drawButton, handleClick, handleMouseMove } from "../libs/game_functions.js";

//? mouse track
let mouseX = 0;
let mouseY = 0;

let matchData = null;  //later, API data

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
    if (!window.lastMatchId) return;

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
    let y = panelY + 100;
    const gap = 40;

    if (matchData) {
        ctx.fillStyle = "white";
        ctx.fillText(`Player: ${matchData.player_name}`, startX, y); y += gap;
        ctx.fillText(`Level: ${matchData.level_reached}`, startX, y); y += gap;
        ctx.fillText(`Fame: ${matchData.final_fame}`, startX, y); y += gap;
        ctx.fillText(`Time: ${matchData.duration_seconds}s`, startX, y); y += gap;

        // result-based color
        ctx.fillStyle = matchData.result === "WIN" ? "lime" : "red";
        ctx.fillText(`Result: ${matchData.result}`, startX, y);

    } else {
        ctx.fillStyle = "white";
        ctx.fillText("Loading...", startX, y);
    }

    if (matchData) {
        ctx.fillText(`PLAYER: ${matchData.player_name}`, 350, 150);
        ctx.fillText(`LEVEL: ${matchData.level_reached}`, 350, 200);
        ctx.fillText(`FAME: ${matchData.final_fame}`, 350, 250);
        ctx.fillText(`TIME: ${matchData.duration_seconds}s`, 350, 300);
        ctx.fillText(`RESULT: ${matchData.result}`, 350, 350);
    } else {
        ctx.fillText("LOADING...", 400, 250);
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
