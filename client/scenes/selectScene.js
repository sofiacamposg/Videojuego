//& selectScene.js
//& Handles the character selection screen — loads archetypes from the API,
//& draws selectable zones over the gladiators image, shows stats on hover,
//& and returns the selected character name to main.js on confirm

"use strict"

import { MessageBox } from "../objects/MessageBox.js";
import { handleMouseMove, drawButton, handleClick } from "../libs/game_functions.js";

//? mouse position tracking
let mouseX = 0;
let mouseY = 0;

//? button definitions
const buttonBack = { x: 150, y: 50, text: "BACK TO MENU" };
const buttonConfirm = { x: 850, y: 50, text: "CONFIRM" };

//? error message shown when player tries to confirm without selecting a character
let errorMessage = new MessageBox(
    "ERROR", 
    "You must select a Character to continue",
    250, 150, 500, 250
);
errorMessage.addButton("Resume", 440, 300, 120, 50, () => {
   errorMessage.hide();
});

//? background and character sprite images
let backgroundImage = new Image();
backgroundImage.src = "./assets/PortadaBase.png";

let gladiatorsImage = new Image();
gladiatorsImage.src = "./assets/gladiadores.png";

//? clickable zones over each archetype — populated from the API
let zones = [];
let selectedCharacter = null;  // name of the currently selected archetype

//* resets the scene state and reloads archetypes from the API
function resetSelect() {
    mouseX = 0;
    mouseY = 0;
    selectedCharacter = null;
    loadArchetypes();
}

//===== API =====

//* fetches archetypes from the server and builds the clickable zones array
//* each zone maps to a character with its position, name and stats
async function loadArchetypes(){
    try{
        const res = await fetch("http://localhost:3000/archetypes");

        if(!res.ok) throw new Error("HTTP " + res.status);

        const data = await res.json();

        // build one zone per archetype, spaced evenly across the screen
        zones = data.map((arch, index) => ({
            x: 200 + index * 200,
            y: 190,
            width: 180,
            height: 150,
            name: arch.name,
            stats: `Vida:${arch.hp_start} Ataque:${arch.damage_start} Vel:${arch.speed_start}`,
            description: `${arch.name}`
        }));

        console.log("Archetypes loaded:", zones);

    } catch(err){
        console.error("API failed, using fallback:", err);
    }
}

//* draws the full character selection screen each frame
//* renders background, title, buttons, gladiator image, selection highlights and hover stats
function drawSelect(ctx, canvas) {
    ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);

    //? title with golden outline
    ctx.fillStyle = "white";
    ctx.font = "40px 'VT323'";
    ctx.textAlign = "center";
    ctx.strokeStyle = "rgb(255, 187, 86)";
    ctx.lineWidth = 3;
    ctx.strokeText("S E L E C T   C H A R A C T E R", canvas.width / 2, 150);
    ctx.fillText("S E L E C T   C H A R A C T E R", canvas.width / 2, 150);

    //? navigation and confirm buttons
    drawButton(ctx, buttonConfirm, mouseX, mouseY);
    drawButton(ctx, buttonBack, mouseX, mouseY);

    //? draw the gladiators image scaled to a fixed width
    const targetW = 600;
    const scale = targetW / gladiatorsImage.width;
    const targetH = gladiatorsImage.height * scale;
    ctx.drawImage(gladiatorsImage, 200, 150, targetW, targetH);

    //? draw hover and selection effects for each character zone
    zones.forEach((zone) => {
        const isHover =
            mouseX > zone.x &&
            mouseX < zone.x + zone.width &&
            mouseY > zone.y &&
            mouseY < zone.y + zone.height;

        const isSelected = selectedCharacter === zone.name;

        //? selected character gets a lime green border
        if (isSelected){
            ctx.strokeStyle = 'lime';
            ctx.lineWidth = 4;
            ctx.strokeRect(zone.x, zone.y, zone.width, zone.height);
        }

        //? hovered character shows a stats panel at the bottom of the screen
        if (isHover) {
            ctx.fillStyle = "rgba(0,0,0,0.85)";
            ctx.fillRect(150, 480, 700, 160);

            // extract individual stat values from the stats string
            const vida = zone.stats.match(/Vida:(\d+)/)?.[1] || "?";
            const ataque = zone.stats.match(/Ataque:(\d+)/)?.[1] || "?";
            const vel = zone.stats.match(/Vel:(\d+)/)?.[1] || "?";

            //? draw each stat in a different color
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

//* updates mouse position relative to the canvas each frame
function handleMouseMoveSelect(event, canvas) {
    const pos = handleMouseMove(event, canvas);
    mouseX = pos.x;
    mouseY = pos.y;
}

//* handles all click events on the select screen
//* checks error box, character zones and buttons in priority order
function handleClickSelect(ctx) {

    //? if error box is visible, let it handle the click first
    if(errorMessage.visible){
        return errorMessage.handleClick(mouseX, mouseY);
    }

    //? check if the player clicked on a character zone
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

    //? back button — return to menu
    if (handleClick(mouseX, mouseY, buttonBack, ctx)) return "back";

    //? confirm button — proceed only if a character is selected
    if (handleClick(mouseX, mouseY, buttonConfirm, ctx)) {
        if(selectedCharacter != null){
            return "confirm";
        } else {
            errorMessage.show();  // force player to pick before continuing
        }
    }

    return null;
}

//* returns the currently selected character name
function getSelectedCharacter(){
    return selectedCharacter;
}

export { drawSelect, handleMouseMoveSelect, handleClickSelect, resetSelect, getSelectedCharacter };