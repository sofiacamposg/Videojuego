"use strict"

let mouseX = 0;
let mouseY = 0;

let backgroundLoaded = false;
let imageLoaded = false;

// Fondo
let background = new Image();
background.src = "./assets/Coliseo.png";
background.onload = () => { backgroundLoaded = true; };

// Imagen gladiadores
let gladiatorsImage = new Image();
gladiatorsImage.src = "./assets/gladiadores.png";
gladiatorsImage.onload = () => { imageLoaded = true; };

// Zonas de personajes
const zones = [
    { x: 200, y: 150, width: 200, height: 300, name: "Guerrero", stats: "Vida:120 Ataque:20 Vel:5", description: "Gladiador equilibrado en ataque y defensa. Ideal para un estilo adaptable" },
    { x: 400, y: 150, width: 200, height: 300, name: "Lancero", stats: "Vida:100 Ataque:25 Vel:6", description: "Gladiador rápido con mayor alcance. Perfecto para jugadores ágiles" },
    { x: 600, y: 150, width: 200, height: 300, name: "Pesado", stats: "Vida:150 Ataque:15 Vel:3", description: "Gladiador resistente con gran defensa. Soporta mucho daño pero es más lento" }
];

function draw(ctx, canvas) {

    ctx.clearRect(0,0,canvas.width,canvas.height);

    ctx.fillStyle = "black";
    ctx.fillRect(0,0,canvas.width,canvas.height);

    // Fondo
    if(backgroundLoaded){
        ctx.drawImage(background,0,0,canvas.width,canvas.height);
    }

    // Cargando
    if(!imageLoaded){
        ctx.fillStyle = "white";
        ctx.font = "30px Arial";
        ctx.textAlign = "center";
        ctx.fillText("Cargando...",canvas.width/2,canvas.height/2);
        return;
    }

    // Imagen gladiadores
    ctx.drawImage(gladiatorsImage,200,150,600,300);

    ctx.fillStyle = "white";
    ctx.font = "40px Arial";
    ctx.textAlign = "center";
    ctx.fillText("ELIGE TU GLADIADOR",canvas.width/2,100);

    zones.forEach(zone => {

        const isHover =
        mouseX > zone.x &&
        mouseX < zone.x + zone.width &&
        mouseY > zone.y &&
        mouseY < zone.y + zone.height;

        if(isHover){

            ctx.fillStyle = "rgba(0,0,0,0.85)";
            ctx.fillRect(150,480,700,160);

            ctx.fillStyle = "yellow";
            ctx.font = "22px Arial";
            ctx.fillText(zone.name,canvas.width/2,510);

            const vida = zone.stats.match(/Vida:(\d+)/)[1];
            const ataque = zone.stats.match(/Ataque:(\d+)/)[1];
            const vel = zone.stats.match(/Vel:(\d+)/)[1];

            ctx.font = "18px Arial";

            ctx.fillStyle = "red";
            ctx.fillText(`Vida: ${vida}`,canvas.width/2 - 100,540);

            ctx.fillStyle = "#40E0D0";
            ctx.fillText(`Ataque: ${ataque}`,canvas.width/2,540);

            ctx.fillStyle = "green";
            ctx.fillText(`Velocidad: ${vel}`,canvas.width/2 + 100,540);

            ctx.font = "16px Arial";
            ctx.fillStyle = "white";
            ctx.fillText(zone.description,canvas.width/2,570);
        }

    });
}

function handleMouseMove(event,canvas){
    const rect = canvas.getBoundingClientRect();
    mouseX = event.clientX - rect.left;
    mouseY = event.clientY - rect.top;
}

function handleClick(x,y){

    for(let zone of zones){

        if(
            x > zone.x &&
            x < zone.x + zone.width &&
            y > zone.y &&
            y < zone.y + zone.height
        ){
            console.log("Elegiste:",zone.name);
        }

    }
}

export {draw,handleMouseMove,handleClick};