import { draw as drawMenu, handleMouseMove as handleMouseMoveMenu, handleClick as handleClickMenu } from "./scenes/menuScene.js";

import { draw as drawSelect, handleMouseMove as handleMouseMoveSelect, handleClick as handleClickSelect } from "./scenes/selectScene.js";

const canvasWidth = 1000;
const canvasHeight = 600;

let canvas;
let ctx;

let currentScene;

function main(){

    canvas = document.getElementById("canvas");

    canvas.width = canvasWidth;
    canvas.height = canvasHeight;

    ctx = canvas.getContext("2d");

    currentScene = "menu";

    canvas.addEventListener("mousemove",(event)=>{

        if(currentScene === "menu"){
            handleMouseMoveMenu(event,canvas);
        }

        if(currentScene === "select"){
            handleMouseMoveSelect(event,canvas);
        }

    });

    canvas.addEventListener("click",(event)=>{

        const rect = canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        if(currentScene === "menu"){

            const scene = handleClickMenu(x,y,ctx);

            if(scene === "select"){
                currentScene = "select";
            }

        }

        if(currentScene === "select"){
            handleClickSelect(x,y);
        }

    });

    gameLoop();
}

function gameLoop(){

    if(currentScene === "menu"){
        drawMenu(ctx,canvas);
    }

    if(currentScene === "select"){
        drawSelect(ctx,canvas);
    }

    requestAnimationFrame(gameLoop);
}

main();