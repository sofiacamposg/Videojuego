import { draw as drawMenu, handleMouseMove as handleMouseMoveMenu, handleClick as handleClickMenu } from "./scenes/menuScene.js";
import { draw as drawLogIn, handleMouseMove as handleMouseMoveLogIn, handleClick as handleClickLogIn, handleKeyDown as handleKeyDownLogIn, getUsername, reset as resetLogIn } from "./scenes/logInScene.js";
import { draw as drawSelect, handleMouseMove as handleMouseMoveSelect, handleClick as handleClickSelect, reset as resetSelect } from "./scenes/selectScene.js";

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
                currentScene = 'start';
            }
        }
        clicked = 'back';
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
    });

    window.addEventListener("keydown", (event) => {
    if (currentScene === "login") {
        handleKeyDownLogIn(event);
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
         requestAnimationFrame(gameLoop);
    }

main();