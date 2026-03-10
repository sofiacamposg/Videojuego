import { draw as drawMenu, handleMouseMove as handleMouseMoveMenu, handleClick as handleClickMenu } from "./scenes/menuScene.js";
import { draw as drawLogIn, handleMouseMove as handleMouseMoveLogIn, handleClick as handleClickLogIn} from "./scenes/logInScene.js";

const canvasWidth = 1000;
const canvasHeight = 600;

let canvas;
let ctx;

let currentScene = "menu"; //nos posicionamos en menuScene al inicio de cualquier run

function main() {
    canvas = document.getElementById("canvas");

    canvas.width = canvasWidth;
    canvas.height = canvasHeight;

    ctx = canvas.getContext("2d");

    canvas.addEventListener("mousemove", (event) => {
        if(currentScene === 'menu'){
            handleMouseMoveMenu(event, canvas);
        }
        else if(currentScene === 'login'){
            handleMouseMoveLogIn(event,canvas);
        }
    });

    canvas.addEventListener("click", (event) => {
        if(currentScene === 'menu'){
            let clicked = handleClickMenu(); //función que definimos en menuScene y nos regresa alguno de los botones
            if(clicked === 'login'){
                currentScene = 'login';
            }
        }
        else if (currentScene === 'login'){
            let clicked = handleClickLogIn(); //función que definimos en menuScene y nos regresa alguno de los botones
            if(clicked === 'back'){
                currentScene = 'menu';
            }
        }
    });

    gameLoop();
}

function gameLoop() {
    if (currentScene === 'menu'){
        drawMenu(ctx, canvas);
    }
    else if (currentScene === 'login'){
        drawLogIn (ctx, canvas);
    }
         requestAnimationFrame(gameLoop);
    }

main();