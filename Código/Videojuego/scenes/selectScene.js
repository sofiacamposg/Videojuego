/* 
& Select an archetype scene, includes:
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
import { MessageBox } from "../objects/MessageBox.js";
import { handleMouseMove, drawButton, handleClick } from "../libs/game_functions.js";

//* === mouse track and global variables ===
let mouseX = 0;
let mouseY = 0;
//zones for hover
let zones =[];
let selectedCharacter = null;

//* === buttons ===
const buttonBack = { x: 150, y: 50, text: "BACK TO MENU" };
const buttonConfirm = { x: 850, y: 50, text: "CONFIRM" };

let errorMessage = new MessageBox(
    "ERROR", 
    "You must select a Character to continue",
    250, 150, 500, 250
);

errorMessage.addButton("Resume", 440, 300, 120, 50, () =>{
   errorMessage.hide();
});

//~ background, our assets were made by NanoBanana
let backgroundImage = new Image();
backgroundImage.src = "../Videojuego/assets/PortadaBase.png";

let gladiatorsImage = new Image();
gladiatorsImage.src = "../Videojuego/assets/gladiadores.png";

//* === api ===
async function loadArchetypes(){
    try{
        const res = await fetch("http://localhost:3000/archetypes");  //bring the archetypes data

        if(!res.ok) throw new Error("HTTP " + res.status);

        const data = await res.json();  //save the data in a json

        zones = data.map((arch, index) => ({  //organize info
            x: 200 + index * 200,
            y: 190,
            width: 180,
            height: 150,
            name: arch.name,
            stats: `Vida:${arch.hp_start} Ataque:${arch.damage_start} Vel:${arch.speed_start}`,
            description: `${arch.name}`
        }));

        console.log(" Archetypes loaded:", zones);  //confirmation

    }catch(err){
        console.error(" API failed", err);  
    }
}

//*  === functions ===
function drawSelect(ctx, canvas) {   //~ draw all canvas
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

    // hover and selection logic
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

            //harcoded data for any edge case
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

    errorMessage.draw(ctx);  //user hasn't picked a character
}

//* === helpeers ===
function handleMouseMoveSelect(event, canvas) {   //~ where is the mouse?
    const pos = handleMouseMove(event, canvas);
    mouseX = pos.x;
    mouseY = pos.y;
}

function handleClickSelect(ctx) {  //where does the user click?
    if(errorMessage.visible){
        return errorMessage.handleClick(mouseX, mouseY);  //if there is an error, message box will handle the click
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
            return "selectedCharacter";  //go to main.js and tell them
        }
    }

    if (handleClick(mouseX, mouseY, buttonBack, ctx)) {  //~ user wants to go back
        return "back";
    }

    if (handleClick(mouseX, mouseY, buttonConfirm, ctx)) {  //~ user wants to continue
        if(selectedCharacter != null){  //case1: player has chose a character
            return "confirm";
        } else {  //case2: user didnt select a character
            errorMessage.show();
        }
    }
    return null;
}

function getSelectedCharacter(){  //~ getter
    return selectedCharacter;
}

function resetSelect() {  //~ base data
    mouseX = 0;
    mouseY = 0;
    selectedCharacter = null;
    loadArchetypes();
}
 
//* === export ===
export { drawSelect, handleMouseMoveSelect, handleClickSelect, resetSelect, getSelectedCharacter };