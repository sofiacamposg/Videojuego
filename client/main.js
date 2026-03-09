import { draw as drawMenu, handleMouseMove as handleMouseMoveMenu, handleClick as handleClickMenu } from "./scenes/menuScene.js";
import { draw as drawLogIn, handleMouseMove as handleMouseMoveLogIn, handleClick as handleClickLogIn, handleKeyDown as handleKeyDownLogIn, getUsername, reset as resetLogIn } from "./scenes/logInScene.js";
import { draw as drawSelect, handleMouseMove as handleMouseMoveSelect, handleClick as handleClickSelect, reset as resetSelect } from "./scenes/selectScene.js";
import { draw as drawLevel1, handleMouseMove as handleMouseMoveLevel1, handleClick as handleClickLevel1, reset as resetLevel1, handleKeyDown as handleKeyDownLevel1,
    handleKeyUp as handleKeyUpLevel1 } from "./scenes/level1Scene.js";

const canvasWidth = 1000;
const canvasHeight = 600;

let canvas;
let ctx;

let currentScene = "menu"; //nos posicionamos en menuScene al inicio de cualquier run
let playerName = ""; //variable para log in

function main() {
    canvas = document.getElementById("canvas");

    canvas.width = canvasWidth;
    canvas.height = canvasHeight;

    ctx = canvas.getContext("2d");

    let clicked;
    canvas.addEventListener("click", (event) => {
        if(currentScene === 'menu'){
            clicked = handleClickMenu(); //función que definimos en menuScene y nos regresa alguno de los botones
            if(clicked === 'login'){
                currentScene = 'login';
            }
            if (clicked === 'start'){
                currentScene = 'start'; //Start es selectScene, que te lleva a escoger tu character
            }
        }
        if (currentScene === 'login'){
            clicked = handleClickLogIn(); //función que definimos en menuScene y nos regresa alguno de los botones
            if(clicked === 'back'){
                resetLogIn();
                currentScene = 'menu';
            }
            if(clicked === 'confirm'){
                playerName = getUsername();
                currentScene = 'start';
            }
        }
        if (currentScene === 'start'){
            clicked = handleClickSelect(); //función que definimos en menuScene y nos regresa alguno de los botones
            if(clicked === 'back'){
                resetSelect();
                currentScene = 'menu'; 
            }
            //Ahorita vamos a dejar que si das a start sin log in te mnada directo al nivel 1
            //FALTA SCREEN DE SELECCIÓN DEL MUNDO
            if (clicked === 'confirm'){
                currentScene = 'level1';
            }
        }
        if (currentScene === 'level1'){
            clicked = handleClickLevel1();
        }
    });

     canvas.addEventListener("mousemove", (event) => {
        if(currentScene === 'menu'){
            handleMouseMoveMenu(event, canvas);
        }
        if(currentScene === 'login'){
            handleMouseMoveLogIn(event,canvas);
        }
        if(currentScene === 'start'){
            handleMouseMoveSelect(event,canvas);
        }
        if(currentScene === 'level1'){
            handleMouseMoveLevel1(event,canvas);
        }
    });

    window.addEventListener("keydown", (event) => {
        if (currentScene === "login") { 
            handleKeyDownLogIn(event);
        }
    });
    //Estas dos funciones se llaman para identificar que teclas se presionan en level1
    window.addEventListener("keydown", (event)=>{
        if(currentScene === "level1"){
            handleKeyDownLevel1(event);
        }
    });

    window.addEventListener("keyup", (event)=>{
        if(currentScene === "level1"){
            handleKeyUpLevel1(event);
        }
    });

    gameLoop();
}

function gameLoop() {
    if (currentScene === 'menu'){
        drawMenu(ctx, canvas);
    }
    if (currentScene === 'login'){
        drawLogIn (ctx, canvas);
    }
    if (currentScene === 'start'){
        drawSelect (ctx, canvas);
    }
    if (currentScene === 'level1'){
        drawLevel1 (ctx, canvas);
    }
         requestAnimationFrame(gameLoop);
    }

main();