/* 
& Score scene, includes:
& buttons, draw, helpers, and api call

^ Note: We recommend installing the Colorful Comments extension to improve code readability 
^ https://marketplace.visualstudio.com/items?itemName=ParthR2031.colorful-comments
^ Color Legend:
    & pink: file description
    * green: section title
    ~ purple: general funtion description
*/
"use strict"

//* === imports ===
import { drawButton, handleClick, handleMouseMove } from "../libs/game_functions.js";

//* === mouse track and global variables ===
let mouseX = 0;
let mouseY = 0;
let matchData = null;  //for API data
let loading = false;
let loadedMatchId = null;
let cachedCtx;

//* === buttons ===
const buttonExit = {  //go to menu
    x: 200,
    y: 500,
    text: "EXIT"
};

const buttonAgain = {  //reset match
    x: 750,
    y: 500,
    text: "START AGAIN"
};

//~ background, our assets were made by NanoBanana
let backgroundImage = new Image();
backgroundImage.src = "../Videojuego/assets/PortadaBase.png";

//* === api ===
export async function loadMatchSummary() {
    if (!window.lastMatchId) {  //not id found
        matchData = null;
        loadedMatchId = null;
        return;
    }

    if (loading) return;  //api is loking for data
    if (loadedMatchId === window.lastMatchId) return;  // data already found

    loading = true;

    try {
        const res = await fetch(`http://localhost:3000/match/summary/${window.lastMatchId}`);  //go search the data
        matchData = await res.json();  //add it to a json
        loadedMatchId = window.lastMatchId;

        console.log("MATCH SUMMARY:", matchData);  //confirmation
    } catch (err) {
        console.log("Error loading match summary:", err);  //confrmation
    }

    loading = false;
}

//* === functions ===
function drawScoreScene(ctx, canvas) {  //~ draw all canvas
    ctx.save();
    cachedCtx = ctx;
    if (!matchData) {  //we dont have the data, keep loking
        loadMatchSummary();
    }
    console.log("LAST MATCH ID:", window.lastMatchId);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);

    //dimentions
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

        //vertical divider
        ctx.strokeStyle = "#d4af37";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(centerX, panelY + 100);
        ctx.lineTo(centerX, panelY + panelH - 30);
        ctx.stroke();

        // data 
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

            // left labels
            ctx.textAlign = "right";
            ctx.fillStyle = "#d4af37";
            ctx.fillText(labels[i], centerX - 20, y);

            // right labels
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
    ctx.restore();
}

//* === helpers ===
function handleMouseMoveScore(event, canvas) {  //~ where is the mouse?
    const pos = handleMouseMove(event, canvas);
    mouseX = pos.x;
    mouseY = pos.y;
}

function handleClickScoreScene() {  //~ where does the user click?
    if (handleClick(mouseX, mouseY, buttonExit, cachedCtx)) return "exit";  //tell main.js user wants to go to menu
    if (handleClick(mouseX, mouseY, buttonAgain, cachedCtx)) return "again";  // tell main.js user wants to restart their match
    return null;
}

function resetScoreScene() {  //~ base data
    matchData = null;
    loading = false;
    loadedMatchId = null;
}

//* === exports ===
export { drawScoreScene, handleClickScoreScene, handleMouseMoveScore, resetScoreScene };
