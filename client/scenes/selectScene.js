import { MessageBox } from "../objects/MessageBox.js";

"use strict"
let mouseX = 0;
let mouseY = 0;
let ctx;

//Botones
const buttonBack = {
    x: 150,
    y: 50,
    text: "BACK TO MENU"
};

const buttonConfirm = {
    x: 850,
    y: 50,
    text: "CONFIRM"
}; 

let errorMessage = new MessageBox(
    "ERROR", 
    "You must select a Character to continue",
    250,
    150,
    500,
    250
);
errorMessage.addButton("Resume", 440, 300, 120, 50, () =>{
   errorMessage.hide()
});


    //fondo
    let backgroundImage = new Image();
    backgroundImage.src = "./assets/PortadaBase.png";    ;
    //characters
    let gladiatorsImage = new Image();
    gladiatorsImage.src = "./assets/gladiadores.png";

    // Zonas de los personajes
    let zones = [
        { x: 200, y: 190, width: 180, height: 150, name: "Guerrero", stats: "Vida:120 Ataque:20 Vel:5", description: "Gladiador equilibrado en ataque y defensa. Ideal para un estilo adaptable" },
        { x: 400, y: 190, width: 180, height: 150, name: "Lancero", stats: "Vida:100 Ataque:25 Vel:6", description: "Gladiador rápido con mayor alcance. Perfecto para jugadores ágiles" },
        { x: 600, y: 190, width: 180, height: 150, name: "Pesado", stats: "Vida:150 Ataque:15 Vel:3", description: "Gladiador resistente con gran defensa. Soporta mucho daño pero es más lento" }
    ];

    let selectedCharacter = null;
    //reset
    function reset() {
    mouseX = 0;
    mouseY = 0;
    selectedCharacter = null;
    }

    function draw(ctx, canvas) {
        ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
        // Título
        ctx.fillStyle = "white"; //texto
        ctx.font = "40px 'VT323'";
        ctx.textAlign = "center";
        ctx.strokeStyle = "rgb(255, 187, 86)"; //borde
        ctx.lineWidth = 3;
        ctx.strokeText("S E L E C T   C H A R A C T E R", canvas.width / 2, 150);
        ctx.fillText("S E L E C T   C H A R A C T E R", canvas.width / 2, 150);

        // Botones
        drawButton(ctx, buttonConfirm);
        drawButton(ctx, buttonBack);
        //Dibujamos a los gladiadores
        const targetW = 600;
        const scale = targetW / gladiatorsImage.width;
        const targetH = gladiatorsImage.height * scale;

        ctx.drawImage(gladiatorsImage, 200, 150, targetW, targetH);

        // Hover: mostrar panel de stats/desc
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

        // Visual de las stats de los characters
        if (isHover) {

        // Panel
        ctx.fillStyle = "rgba(0,0,0,0.85)";
        ctx.fillRect(150, 480, 700, 160);


        // Extraer stats 
        const vidaMatch = zone.stats.match(/Vida:(\d+)/);
        const ataqueMatch = zone.stats.match(/Ataque:(\d+)/);
        const velMatch = zone.stats.match(/Vel:(\d+)/);

        const vida = vidaMatch ? vidaMatch[1] : "?";
        const ataque = ataqueMatch ? ataqueMatch[1] : "?";
        const vel = velMatch ? velMatch[1] : "?";

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
        //errorBox
         errorMessage.draw(ctx); 
    }

    //Reutiliza función de menuScreen
    function drawButton(ctx, button) {
        ctx.font = "25px 'VT323'";
        ctx.textAlign = 'center';

        const textWidth = ctx.measureText(button.text).width;
        const textHeight = 30;

        const left = button.x - textWidth / 2;
        const right = button.x + textWidth / 2;
        const top = button.y - textHeight;
        const bottom = button.y;

        const isHover =
            mouseX > left &&
            mouseX < right &&
            mouseY > top &&
            mouseY < bottom;

        ctx.fillStyle = isHover ? "red" : "white";
        ctx.fillText(button.text, button.x, button.y);

        if (isHover) {
            ctx.beginPath();
            ctx.moveTo(left, button.y + 5);
            ctx.lineTo(right, button.y + 5);
            ctx.strokeStyle = "red";
            ctx.lineWidth = 3;
            ctx.stroke();
        }
    }

    function handleMouseMove(event, canvas) {
        const rect = canvas.getBoundingClientRect();
        mouseX = event.clientX - rect.left;
        mouseY = event.clientY - rect.top;

    }

    //Esta función es para poder saber que botón se clickeo y asi movernos a otra escena
    function isMouseOverButton(button) {
        //usa el mismo font y tamaño que usas para dibujar
        const dummyCanvas = document.createElement("canvas");
        const dummyCtx = dummyCanvas.getContext("2d");
        dummyCtx.font = "25px 'VT323'";

        const textWidth = dummyCtx.measureText(button.text).width;
        const textHeight = 30;

        const left = button.x - textWidth / 2;
        const right = button.x + textWidth / 2;
        const top = button.y - textHeight;
        const bottom = button.y;

        return mouseX > left && mouseX < right && mouseY > top && mouseY < bottom;
    }
    
    // Detecta click en zona y regresa cuál eligieron
    function handleClick() {
    //errorMessage
    if(errorMessage.visible){
          return errorMessage.handleClick(mouseX, mouseY);
    }
    for (const zone of zones) {
        const inside =
        mouseX > zone.x &&
        mouseX < zone.x + zone.width &&
        mouseY > zone.y &&
        mouseY < zone.y + zone.height;

        if (inside) {
            selectedCharacter = zone.name; // "Guerrero" | "Lancero" | "Pesado"
            return "selectedCharacter";
        }
    }
        // revisa si el mouse está encima de BACK O CONFIRM
    if (isMouseOverButton(buttonBack)) {
        return "back";
    }
    if (isMouseOverButton(buttonConfirm)){
        if(selectedCharacter != null){
            return 'confirm'
        }
        else{
            errorMessage.show();
        }
        //return null; //no deja confirmar si no eligió personaje
    } 
     return null;
    }

    function getSelectedCharacter(){
        return selectedCharacter;
    }
    export { draw, handleMouseMove, handleClick, reset, getSelectedCharacter };
        

        