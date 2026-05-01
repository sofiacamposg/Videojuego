"use strict"

import { MessageBox } from "../objects/MessageBox.js";
import { handleMouseMove, drawButton, handleClick } from "../libs/game_functions.js";

//? mouse
let mouseX = 0;
let mouseY = 0;

//? buttons
const buttonBack = { x: 150, y: 50, text: "BACK TO MENU" };
const buttonConfirm = { x: 850, y: 50, text: "CONFIRM" };

//? error
let errorMessage = new MessageBox(
    "ERROR", 
    "You must select a Character to continue",
    250, 150, 500, 250
);

errorMessage.addButton("Resume", 440, 300, 120, 50, () =>{
   errorMessage.hide();
});

//? images
let backgroundImage = new Image();
backgroundImage.src = "./assets/PortadaBase.png";

let gladiatorsImage = new Image();
gladiatorsImage.src = "./assets/gladiadores.png";

//? zones
/*let zones = [
    { x: 200, y: 190, width: 180, height: 150, name: "Guerrero", stats: "Vida:120 Ataque:20 Vel:5", description: "Gladiador equilibrado en ataque y defensa." },
    { x: 400, y: 190, width: 180, height: 150, name: "Lancero", stats: "Vida:100 Ataque:25 Vel:6", description: "Gladiador rápido con mayor alcance." },
    { x: 600, y: 190, width: 180, height: 150, name: "Pesado", stats: "Vida:150 Ataque:15 Vel:3", description: "Gladiador resistente y lento." }
];*/
let zones =[];
let selectedCharacter = null;

//? reset
function resetSelect() {
    mouseX = 0;
    mouseY = 0;
    selectedCharacter = null;
    loadArchetypes();
}
// ================== LOAD FROM API ==================
async function loadArchetypes(){
    try{
        const res = await fetch("http://localhost:3000/archetypes");

        if(!res.ok) throw new Error("HTTP " + res.status);

        const data = await res.json();

        zones = data.map((arch, index) => ({
            x: 200 + index * 200,
            y: 190,
            width: 180,
            height: 150,
            name: arch.name,
            stats: `Vida:${arch.hp_start} Ataque:${arch.damage_start} Vel:${arch.speed_start}`,
            description: `${arch.name}`
        }));

        console.log(" Archetypes loaded:", zones);

    }catch(err){
        console.error(" API failed, using fallback:", err);
    }
}
function drawSelect(ctx, canvas) {
    ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);

    // title
    ctx.fillStyle = "white";
    ctx.font = "40px 'VT323'";
    ctx.textAlign = "center";
    ctx.strokeStyle = "rgb(255, 187, 86)";
    ctx.lineWidth = 3;
    ctx.strokeText("S E L E C T   C H A R A C T E R", canvas.width / 2, 150);
    ctx.fillText("S E L E C T   C H A R A C T E R", canvas.width / 2, 150);

    // buttons
    drawButton(ctx, buttonConfirm, mouseX, mouseY);
    drawButton(ctx, buttonBack, mouseX, mouseY);

    // gladiators
    const targetW = 600;
    const scale = targetW / gladiatorsImage.width;
    const targetH = gladiatorsImage.height * scale;
    ctx.drawImage(gladiatorsImage, 200, 150, targetW, targetH);

    // hover + selection
    zones.forEach((zone) => {
        const isHover =
            mouseX > zone.x &&
            mouseX < zone.x + zone.width &&
            mouseY > zone.y &&
            mouseY < zone.y + zone.height;

        const isSelected = selectedCharacter === zone.name;

        if (isSelected){
            ctx.strokeStyle = 'lime';
            ctx.lineWidth = 4;
            ctx.strokeRect(zone.x, zone.y, zone.width, zone.height);
        }

        if (isHover) {
            ctx.fillStyle = "rgba(0,0,0,0.85)";
            ctx.fillRect(150, 480, 700, 160);

            const vida = zone.stats.match(/Vida:(\d+)/)?.[1] || "?";
            const ataque = zone.stats.match(/Ataque:(\d+)/)?.[1] || "?";
            const vel = zone.stats.match(/Vel:(\d+)/)?.[1] || "?";

            ctx.font = "22px 'VT323'";
            ctx.fillStyle = "red";
            ctx.fillText(`Vida: ${vida}`, canvas.width / 2 - 160, 550);

            ctx.fillStyle = "#40E0D0";
            ctx.fillText(`Ataque: ${ataque}`, canvas.width / 2, 550);

            ctx.fillStyle = "green";
            ctx.fillText(`Velocidad: ${vel}`, canvas.width / 2 + 160, 550);

            ctx.font = "18px 'VT323'";
            ctx.fillStyle = "white";
            ctx.fillText(zone.description, canvas.width / 2, 585);
        }
    });

    errorMessage.draw(ctx);
}

//? mouse global
function handleMouseMoveSelect(event, canvas) {
    const pos = handleMouseMove(event, canvas);
    mouseX = pos.x;
    mouseY = pos.y;
}

//? click
function handleClickSelect(ctx) {

    if(errorMessage.visible){
        return errorMessage.handleClick(mouseX, mouseY);
    }

    // select character
    for (const zone of zones) {
        const inside =
            mouseX > zone.x &&
            mouseX < zone.x + zone.width &&
            mouseY > zone.y &&
            mouseY < zone.y + zone.height;

        if (inside) {
            selectedCharacter = zone.name;
            return "selectedCharacter";
        }
    }

    // buttons
    if (handleClick(mouseX, mouseY, buttonBack, ctx)) {
        return "back";
    }

    if (handleClick(mouseX, mouseY, buttonConfirm, ctx)) {
        if(selectedCharacter != null){
            return "confirm";
        } else {
            errorMessage.show();
        }
    }

    return null;
}

function getSelectedCharacter(){
    return selectedCharacter;
}

export { drawSelect, handleMouseMoveSelect, handleClickSelect, resetSelect, getSelectedCharacter };