import { draw as drawMenu, handleMouseMove as handleMouseMoveMenu, handleClick as handleClickMenu } from "./scenes/menuScene.js";
import { draw as drawLogIn, handleMouseMove as handleMouseMoveLogIn, handleClick as handleClickLogIn, handleKeyDown as handleKeyDownLogIn, reset as resetLogIn, getUsername } from "./scenes/logInScene.js";
import { draw as drawSelect, handleMouseMove as handleMouseMoveSelect, handleClick as handleClickSelect, reset as resetSelect, getSelectedCharacter } from "./scenes/selectScene.js";
import { draw as drawLevel1, handleMouseMove as handleMouseMoveLevel1, handleClick as handleClickLevel1, reset as resetLevel1, handleKeyDown as handleKeyDownLevel1,
    handleKeyUp as handleKeyUpLevel1, setSelectedCharacter } from "./scenes/level1Scene.js";
import { draw as drawCreateAccount, handleMouseMove as handleMouseMoveCreateAccount, handleClick as handleClickCreateAccount, handleKeyDown as handleKeyDownCreateAccount, reset as resetCreateAccount } from "./scenes/createAccountScene.js";
import { draw as drawSettings, handleMouseMove as handleMouseMoveSettings, handleClick as handleClickSettings, startDragging, stopDragging, reset as resetSettings } from "./scenes/settingsScene.js";

const canvasWidth = 1000;
const canvasHeight = 600;

let canvas;
let ctx;

let currentScene = "menu";
let selectedCharacter = null; 

function main() {
    canvas = document.getElementById("canvas");

    canvas.width = canvasWidth;
    canvas.height = canvasHeight;

    ctx = canvas.getContext("2d");

    let clicked;

    canvas.addEventListener("click", (event) => {

        // MENU
        if(currentScene === 'menu'){
            clicked = handleClickMenu();

            if (clicked === 'start'){
                currentScene = 'login';
            }
            if (clicked === 'settings'){
                currentScene = 'settings';
            }
        }

        // SETTINGS
        else if(currentScene === 'settings') {
            clicked = handleClickSettings();
            if(clicked === 'back' || clicked === 'confirm') {
                resetSettings();
                currentScene = 'menu';
            }
        }

        // LOGIN
        else if (currentScene === 'login'){
            clicked = handleClickLogIn(ctx);

            if(clicked === 'back'){
                resetLogIn();
                currentScene = 'menu';
            }

            if (clicked === 'create'){
                currentScene = 'createAccount'
            }

            if(clicked === 'confirm'){

                fetch("http://localhost:3000/login", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        nombre_usuario: getUsername()
                    })
                })
                .then(res => res.json())
                .then(data => {
                    console.log("Respuesta del server:", data);
                })
                .catch(err => {
                    console.error("Error:", err);
                });

                currentScene = 'start';
            }
        }

        // CREATE ACCOUNT
        else if(currentScene === 'createAccount') {
            clicked = handleClickCreateAccount(ctx);

            if(clicked === 'back') {
                resetCreateAccount();
                currentScene = 'menu';
            }

            if(clicked === 'login') {
                currentScene = 'login';
            }

            if(clicked === 'confirm') {

                fetch("http://localhost:3000/crearJugador", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        nombre_usuario: getUsername()
                    })
                })
                .then(res => res.json())
                .then(data => {
                    console.log("Jugador creado:", data);
                })
                .catch(err => {
                    console.error("Error:", err);
                });

                currentScene = 'login';
            }
        }

        // SELECT CHARACTER
        else if (currentScene === 'start'){
            clicked = handleClickSelect();

            if(clicked === 'back'){
                resetSelect();
                currentScene = 'menu'; 
            }

            if (clicked === 'selectedCharacter'){
                selectedCharacter = getSelectedCharacter();
            }

            if (clicked === 'confirm'){
                selectedCharacter = getSelectedCharacter();
                setSelectedCharacter(selectedCharacter);
                currentScene = 'level1';
            }
        }

        // LEVEL 1
        else if (currentScene === 'level1'){
            clicked = handleClickLevel1();  
        }
    });

    // SETTINGS SLIDER
    canvas.addEventListener("mousedown", () => {
        if(currentScene === "settings") startDragging();
    });

    canvas.addEventListener("mouseup", () => {
        if(currentScene === "settings") stopDragging();
    });

    canvas.addEventListener("mousemove", (event) => {
        if(currentScene === 'menu') handleMouseMoveMenu(event,canvas);
        if(currentScene === 'settings') handleMouseMoveSettings(event,canvas);
        if(currentScene === 'login') handleMouseMoveLogIn(event,canvas);
        if(currentScene === 'createAccount') handleMouseMoveCreateAccount(event,canvas);
        if(currentScene === 'start') handleMouseMoveSelect(event,canvas);
        if(currentScene === 'level1') handleMouseMoveLevel1(event,canvas);
    });

    window.addEventListener("keydown", (event) => {
        if (currentScene === "login") handleKeyDownLogIn(event);
        if(currentScene === "level1") handleKeyDownLevel1(event);
        if(currentScene === "createAccount") handleKeyDownCreateAccount(event); 
    });

    window.addEventListener("keyup", (event)=>{
        if(currentScene === "level1"){
            handleKeyUpLevel1(event);
        }
    });

    gameLoop();
}

function gameLoop() {
    if(currentScene === 'menu') drawMenu(ctx,canvas);
    else if(currentScene === 'settings') drawSettings(ctx,canvas);
    else if(currentScene === 'login') drawLogIn(ctx,canvas);
    else if(currentScene === 'createAccount') drawCreateAccount(ctx,canvas);
    else if(currentScene === 'start') drawSelect(ctx,canvas);   
    else if(currentScene === 'level1') drawLevel1(ctx,canvas);

    requestAnimationFrame(gameLoop);
}

main();